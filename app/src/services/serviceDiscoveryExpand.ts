import { uniq } from 'lodash';
import URLParse from 'url-parse';
import { v4 as uuid } from 'uuid';
import { ObjectId } from 'mongodb';
import { Request, Response } from 'express';
import { getDatetime } from '../shared/ymd';
import { sendToQueue } from '../shared/queue';
import { ISuggestion } from '../types/ISuggestion';
import { getD4SRankedKeywords } from '../shared/d4s';
import calculateTerms from '../helpers/calculateTerms';
import { getNgrams } from './utils/getNgramsAndSimilar';
import { IDiscoveryItem } from '../types/IDiscoveryItem';
import { generateSuggestions } from './utils/generateSuggestions';
import { dbGetDiscoveryItemsForReport } from '../db/discovery-item';
import { IDiscoveryVerbsMessage } from '../types/IDiscoveryVerbsMessage';
import { IDiscoverySerpsMessage } from '../types/IDiscoverySerpsMessage';
import { IDiscoveryExpandMessage } from '../types/IDiscoveryExpandMessage';
import { dbAddOrUpdateDiscoveryTask, dbUpdateDiscovery } from '../db/discovery';
import { createOrUpdateDiscoveryItem } from './utils/createOrUpdateDiscoveryItem';
import { cleanKeyword, cleanKeywordYears, filterCommonKeywords } from '../shared/keyword';
import { REPORT_STATUS_COMPLETED, REPORT_STATUS_ERROR, REPORT_STATUS_QUEUED } from '../types/IReportStatus';
import { SEARCH_TYPE_CUSTOM, SEARCH_TYPE_QUESTIONS, SEARCH_TYPE_URL, SEARCH_TYPE_WILDCARD } from '../types/IDiscoverySearchType';

type Req = Request<Record<string, unknown>, Record<string, unknown>, { message: IDiscoveryExpandMessage }>;

export const serviceDiscoveryExpand = async (req: Req, res: Response) => {
  const startTime = Date.now();
  console.log(`[discovery-expand]: Starting at ${getDatetime(new Date(startTime))}`);

  const data: IDiscoveryExpandMessage = req.body.message;
  if (!data.reportId || !data.taskUuid) {
    console.error(`[discovery-expand]: Invalid message received: ${JSON.stringify(data)}`);
    return res.status(404).json({ message: 'Invalid message' });
  }

  const seed = data.seed;
  const reportId = new ObjectId(data.reportId);

  if (data.searchType === 'custom' && (!data.keywords || data.keywords.length <= 0)) {
    console.error(`[discovery-expand]: Custom expand should include list of keywords: ${JSON.stringify(data)}`);
    await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-expand', REPORT_STATUS_ERROR);
    return res.status(404).json({ message: 'Invalid message' });
  }

  let newSuggestions: ISuggestion[] = [];

  if (data.searchType === SEARCH_TYPE_CUSTOM && data.keywords && data.keywords.length > 0) {
    newSuggestions = data.keywords.map((keyword): ISuggestion => {
      const clean = cleanKeyword(keyword);
      return {
        seed: clean,
        suggestion: clean,
        modifier: { original: clean },
      };
    });
  } else if (data.searchType === SEARCH_TYPE_QUESTIONS || data.searchType === SEARCH_TYPE_WILDCARD) {
    if (!seed) {
      console.error(`[discovery-expand]: No seed provided`);
      return res.json({ success: false, message: 'No seed provided' });
    }

    newSuggestions = await generateSuggestions(
      seed,
      {
        _id: reportId,
        language: data.language,
        location: data.location,
        searchType: data.searchType,
        searchEngine: data.searchEngine,
      },
      data.keywords || [],
    );
  } else if (data.searchType === SEARCH_TYPE_URL) {
    if (!data.url) {
      console.error(`[discovery-suggest]: No URL provided`);
      return res.json({ success: false, message: 'No URL provided' });
    }

    if (!process.env.D4S_API_USER || !process.env.D4S_API_PASS) {
      console.error(`[discovery-suggest]: No D4S credentials provided`);
      return res.json({ success: false, message: 'No D4S credentials provided' });
    }

    const url = URLParse(data.url);

    let pathname: string | undefined;
    if (data.url.endsWith('/') && url.pathname === '/') {
      pathname = url.pathname;
    } else if (!data.url.endsWith('/') && url.pathname === '/') {
      pathname = undefined;
    } else {
      pathname = url.pathname;
    }

    const newKeywords = await getD4SRankedKeywords(
      process.env.D4S_API_USER,
      process.env.D4S_API_PASS,
      url.hostname,
      pathname,
      data.serpLocation,
      data.searchEngine,
      data.language,
    );

    if (newKeywords && newKeywords.length > 0) {
      newSuggestions = newKeywords.map(
        (keyword): ISuggestion => ({
          seed: keyword,
          suggestion: keyword,
          modifier: { original: keyword },
        }),
      );
    }
  }

  let suggestions = newSuggestions.map((sug) => cleanKeyword(cleanKeywordYears(sug.suggestion)));
  if (data.searchType !== SEARCH_TYPE_CUSTOM && seed) {
    suggestions = suggestions.filter(filterCommonKeywords(seed));
  }

  const currentKeywords = await dbGetDiscoveryItemsForReport<Pick<IDiscoveryItem, 'keyword'>>(reportId, { keyword: 1 });
  const allKeywords = uniq([...(currentKeywords || []).map((kw) => kw.keyword), ...suggestions]);

  if (data.searchType === SEARCH_TYPE_CUSTOM) {
    console.log(`[discovery-expand]: Added ${suggestions.length} custom keywords`);
  } else {
    console.log(`[discovery-expand]: Generated ${suggestions.length} keywords`);
  }

  let ngrams;
  try {
    const { ngrams: tmpNgrams } = await getNgrams(allKeywords);
    ngrams = tmpNgrams;
  } catch (err) {
    console.error(`[discovery-expand]: Error getting ngrams for ${data.seed}: ${data.reportId}`);
    await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-expand', REPORT_STATUS_ERROR);
    return res.status(404).json({ message: 'Invalid message' });
  }

  for (const kw of allKeywords) {
    await createOrUpdateDiscoveryItem(
      {
        _id: reportId,
        searchEngine: data.searchEngine,
        language: data.language,
        location: data.location,
      },
      kw,
      ngrams,
    );
  }

  const terms = await calculateTerms(reportId);
  await dbUpdateDiscovery(reportId, { terms });
  await dbAddOrUpdateDiscoveryTask(reportId, data.taskUuid, 'discovery-expand', REPORT_STATUS_COMPLETED);

  const taskKwsUuid = uuid();
  await dbAddOrUpdateDiscoveryTask(reportId, taskKwsUuid, 'discovery-keywords', REPORT_STATUS_QUEUED);
  await sendToQueue<IDiscoverySerpsMessage>('discovery-keywords', {
    reportId,
    seed: data.seed,
    taskUuid: taskKwsUuid,
    language: data.language,
    location: data.location,
    searchEngine: data.searchEngine,
    serpLocation: data.serpLocation,
    easyWinsPatterns: data.easyWinsPatterns,
    keywords: newSuggestions.map((s) => s.suggestion),
  });

  if (data.language === 'en') {
    const taskVerbsUuid = uuid();
    await dbAddOrUpdateDiscoveryTask(reportId, taskVerbsUuid, 'discovery-verbs', REPORT_STATUS_QUEUED);
    await sendToQueue<IDiscoveryVerbsMessage>('discovery-verbs', {
      taskUuid: taskVerbsUuid,
      reportId: reportId.toString(),
    });
  }

  const endTime = Date.now();
  const minutes = (endTime - startTime) / 1000 / 60;
  console.log(`[discovery-expand]: Finished, took ${minutes} minutes`);

  return res.json({ success: true });
};
