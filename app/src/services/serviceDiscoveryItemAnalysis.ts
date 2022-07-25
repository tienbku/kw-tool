// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as stat from 'jstat';
import { Request, Response } from 'express';
import { IDiscoveryItemAnalysisMessage } from '../types/IDiscoveryItemAnalysisMessage';
import { dbAddOrUpdateDiscoveryTask } from '../db/discovery';
import { REPORT_STATUS_COMPLETED, REPORT_STATUS_ERROR, REPORT_STATUS_PROCESSING } from '../types/IReportStatus';
import { ObjectId } from 'mongodb';
import { dbGetDiscoveryItem, dbUpdateDiscoveryItem } from '../db/discovery-item';
import { getDatetime } from '../shared/ymd';
import { getUrl } from '../helpers/getUrl';
import {
  IDiscoveryAnalysisCorrelation,
  IDiscoveryAnalysisPage,
  IDiscoveryAnalysisTerm,
  IDiscoveryItemAnalysis,
} from '../types/IDiscoveryItemAnalysis';
import { IDiscoveryItem } from '../types/IDiscoveryItem';
import { callPy } from '../shared/py';
import { chunk, flatten, uniq } from 'lodash';
import { getWordBoundaryRegex } from '../shared/regex';
import { ORGANIC } from '../types/ISerpFeature';

const QUEUE_SIZE = 10;

type Req = Request<Record<string, unknown>, Record<string, unknown>, { message: IDiscoveryItemAnalysisMessage }>;

export const serviceDiscoveryItemAnalysis = async (req: Req, res: Response) => {
  const startTime = Date.now();
  console.log(`[item-analysis]: Starting at ${getDatetime(new Date(startTime))}`);

  const data: IDiscoveryItemAnalysisMessage = req.body.message;
  const reportId = new ObjectId(data.reportId);

  if (!process.env.D4S_API_USER || !process.env.D4S_API_PASS) {
    console.error(`[item-analysis]: D4S API credentials not set`);
    await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-item-analysis', REPORT_STATUS_ERROR);
    return res.status(500).json({ message: 'Error' });
  }

  const item = await dbGetDiscoveryItem<Pick<IDiscoveryItem, 'serpData'>>(reportId, data.keyword, {
    serpData: 1,
  });

  if (!item || !item.serpData || !item.serpData.items || item.serpData.items.length === 0) {
    console.error(`[item-analysis]: No required data found on item for: ${data.reportId} and keyword: ${data.keyword}`);
    await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-item-analysis', REPORT_STATUS_ERROR);
    return res.status(500).json({ message: 'Error' });
  }

  await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-item-analysis', REPORT_STATUS_PROCESSING);

  const finalUrls: string[] = [];
  const emptyUrls: string[] = [];
  const pages: IDiscoveryAnalysisPage[] = [];
  const organicUrls = item.serpData.items.filter((item) => item.type === ORGANIC);

  let tasks: Promise<{ url: string; page?: IDiscoveryAnalysisPage; existing?: boolean }>[] = [];

  for (const pos of organicUrls) {
    if (pos.url) {
      finalUrls.push(pos.url);

      tasks.push(getUrl(pos.url));

      if (tasks.length > QUEUE_SIZE) {
        const results = await Promise.all(tasks);
        for (const result of results) {
          if (result.page) {
            pages.push(result.page);
          } else {
            emptyUrls.push(result.url);
          }
        }

        tasks = [];
      }
    }
  }

  if (tasks.length > 0) {
    const results = await Promise.all(tasks);
    for (const result of results) {
      if (result.page) {
        pages.push(result.page);
      } else {
        emptyUrls.push(result.url);
      }
    }
  }

  console.log(`[item-analysis]: Found ${finalUrls.length} organic URLs, ${emptyUrls.length} empty URLs`);

  let corpus = '';
  for (const urlContent of pages) {
    corpus += urlContent.cleanContent + '\n\n';
  }

  const newItemAnalysis: IDiscoveryItemAnalysis = {
    emptyUrls,
    terms: [],
    urls: finalUrls,
    termsPerUrl: {},
    pages: pages,
  };

  const fullNgrams = await callPy<{ ngrams: string[] }, string>('ngrams-content.py', { data: corpus });
  const fullNgramsClean = uniq(fullNgrams?.ngrams || []).map((ngram) => ngram.replace(/_/g, ' '));

  const urlContentsTerms: Record<string, Record<string, number>> = {};

  if (fullNgrams) {
    for (const page of pages) {
      const termsCount: Record<string, number> = {};

      for (const ngram of fullNgramsClean) {
        const count = (page.cleanContent.match(getWordBoundaryRegex(ngram)) || []).length;
        if (count > 0) {
          termsCount[ngram] = count;
        }
      }

      urlContentsTerms[page.url] = termsCount;

      try {
        newItemAnalysis.termsPerUrl[page.url] = termsCount;
      } catch (err) {
        emptyUrls.push(page.url);
        console.error(`[item-analysis]: Error creating URLContent for: ${page.url}`);
        console.error(err);
      }
    }
  }

  const serpAnalysisTerms: IDiscoveryAnalysisTerm[] = [];

  for (const ngram of fullNgramsClean) {
    const count = (corpus.match(getWordBoundaryRegex(ngram)) || []).length;
    const urlsPerPage = chunk(finalUrls, 10);

    const correlations: IDiscoveryAnalysisCorrelation[] = [];
    for (let i = 0; i < urlsPerPage.length; i++) {
      const page = i + 1;
      const pageUrls = urlsPerPage[i];
      const counts: number[] = [];

      for (const url of pageUrls) {
        if (emptyUrls.includes(url)) {
          counts.push(0);
        } else if (urlContentsTerms[url] && urlContentsTerms[url][ngram]) {
          counts.push(urlContentsTerms[url][ngram]);
        } else {
          counts.push(0);
        }
      }

      const mean = stat.mean(counts) || 0;
      correlations.push({
        page,
        mean,
        counts,
      });
    }

    const means = correlations.map((correlation) => correlation.mean);

    let correlation = stat.spearmancoeff([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], means);
    if (correlation < -1.0) {
      correlation = -1;
    } else if (correlation > 1.0) {
      correlation = 1;
    }

    serpAnalysisTerms.push({
      count,
      correlation,
      term: ngram,
      correlationPerPage: correlations,
    });
  }

  console.log(`[item-analysis]: Found ${serpAnalysisTerms.length} terms`);

  const filteredSerpAnalysisTerms = serpAnalysisTerms.filter((term) => {
    const counts = flatten(term.correlationPerPage.map((correlation) => correlation.counts));
    return counts.filter((count) => count > 1).length > 1;
  });

  newItemAnalysis.terms = filteredSerpAnalysisTerms;

  console.log(`[item-analysis]: Found ${filteredSerpAnalysisTerms.length} terms with more than 1 page occurrence`);

  await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-item-analysis', REPORT_STATUS_COMPLETED);
  await dbUpdateDiscoveryItem(reportId, data.keyword, {
    analysis: newItemAnalysis,
  });

  const endTime = Date.now();
  const minutes = (endTime - startTime) / 1000 / 60;
  console.log(`[item-analysis]: Finished, took ${minutes} minutes`);

  return res.json({ success: true, message: 'Done' });
};
