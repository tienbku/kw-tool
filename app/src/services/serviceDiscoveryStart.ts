import { uniq } from 'lodash';
import { v4 as uuid } from 'uuid';
import { ObjectId } from 'mongodb';
import URLParse from 'url-parse';
import { Request, Response } from 'express';
import { getDatetime } from '../shared/ymd';
import { sendToQueue } from '../shared/queue';
import { IDiscovery } from '../types/IDiscovery';
import { ISuggestion } from '../types/ISuggestion';
import { getD4SRankedKeywords } from '../shared/d4s';
import calculateTerms from '../helpers/calculateTerms';
import { getNgrams } from './utils/getNgramsAndSimilar';
import { generateSuggestions } from './utils/generateSuggestions';
import { IDiscoverySerpsMessage } from '../types/IDiscoverySerpsMessage';
import { IDiscoveryVerbsMessage } from '../types/IDiscoveryVerbsMessage';
import { dbAddOrUpdateDiscoveryTask, dbUpdateDiscovery } from '../db/discovery';
import { createOrUpdateDiscoveryItem } from './utils/createOrUpdateDiscoveryItem';
import { cleanKeyword, cleanKeywordYears, filterCommonKeywords } from '../shared/keyword';
import { REPORT_STATUS_COMPLETED, REPORT_STATUS_ERROR, REPORT_STATUS_PROCESSING, REPORT_STATUS_QUEUED } from '../types/IReportStatus';
import {
  SEARCH_TYPE_CUSTOM,
  SEARCH_TYPE_EMPTY,
  SEARCH_TYPE_QUESTIONS,
  SEARCH_TYPE_URL,
  SEARCH_TYPE_WILDCARD,
} from '../types/IDiscoverySearchType';

type IDiscoveryWithKeywords = IDiscovery & { keywords: string[]; url?: string };
type Req = Request<Record<string, unknown>, Record<string, unknown>, { message: IDiscoveryWithKeywords }>;

export const serviceDiscoveryStart = async (req: Req, res: Response) => {
  const startTime = Date.now();
  console.log(`[discovery-suggest]: Starting at ${getDatetime(new Date(startTime))}`);

  const data = {
    ...req.body.message,
    _id: new ObjectId(req.body.message._id.toString() || ''),
  };

  if (data.searchType === SEARCH_TYPE_EMPTY) {
    try {
      await dbUpdateDiscovery(data._id, { status: REPORT_STATUS_COMPLETED });
    } catch (err) {
      console.error(`[discovery-suggest]: Error getting terms for ${data.name}`);
      console.error(err);
    }

    const endTime = Date.now();
    const minutes = (endTime - startTime) / 1000 / 60;
    console.log(`[discovery-suggest]: Finished, took ${minutes} minutes`);

    return res.json({ success: true, message: 'Suggestions generated' });
  }

  await dbUpdateDiscovery(data._id, { status: REPORT_STATUS_PROCESSING });

  const seed = data.seed;
  let newSuggestions: ISuggestion[] = [];

  if (data.searchType === SEARCH_TYPE_CUSTOM && data.keywords && data.keywords.length > 0) {
    newSuggestions = data.keywords.map((keyword): ISuggestion => {
      const clean = cleanKeyword(keyword.replace(/\./gi, ''));
      return {
        seed: clean,
        suggestion: clean,
        modifier: { original: clean },
      };
    });
  } else if (data.searchType === SEARCH_TYPE_QUESTIONS || data.searchType === SEARCH_TYPE_WILDCARD) {
    if (!seed) {
      console.error(`[discovery-suggest]: No seed provided`);
      return res.json({ success: false, message: 'No seed provided' });
    }

    try {
      newSuggestions = await generateSuggestions(seed, data, []);
    } catch (err) {
      console.error(err);
      console.error(`Error on report ${data._id.toString()} for ${data.name}`);
      await dbUpdateDiscovery(data._id, { status: REPORT_STATUS_ERROR });
      return res.status(500).json({ message: 'Error getting suggestions' });
    }
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

  let keywords = uniq(newSuggestions.map((sug) => cleanKeyword(cleanKeywordYears(sug.suggestion))));
  if (data.searchType !== SEARCH_TYPE_CUSTOM && seed) {
    keywords = keywords.filter(filterCommonKeywords(seed));
  }

  if (data.searchType === SEARCH_TYPE_CUSTOM) {
    console.log(`[discovery-start]: Added ${keywords.length} custom keywords`);
  } else {
    console.log(`[discovery-start]: Found ${keywords.length} keywords`);
  }

  // Get ngrams for keywords

  let ngrams;
  try {
    const { ngrams: tmpNgrams } = await getNgrams(keywords);
    ngrams = tmpNgrams;
  } catch (err) {
    console.error(`[discovery-suggest]: Error getting ngrams for ${data.name}: ${data._id}`);
    await dbUpdateDiscovery(data._id, { status: REPORT_STATUS_ERROR });
    return res.status(500).json({ message: 'Error getting ngrams' });
  }

  for (const keyword of keywords) {
    await createOrUpdateDiscoveryItem(data, keyword, ngrams);
  }

  // Get terms and update discovery

  try {
    const terms = await calculateTerms(data._id);
    await dbUpdateDiscovery(data._id, { status: REPORT_STATUS_COMPLETED, terms });
  } catch (err) {
    console.error(`[discovery-suggest]: Error getting terms for ${data.name}`);
    console.error(err);
  }

  // Get keywords data

  console.log(`[discovery-suggest]: Starting queue for keywords data`);

  const taskKwsUuid = uuid();
  await dbAddOrUpdateDiscoveryTask(data._id, taskKwsUuid, 'discovery-keywords', REPORT_STATUS_QUEUED);
  await sendToQueue<IDiscoverySerpsMessage>('discovery-keywords', {
    seed,
    keywords,
    reportId: data._id,
    taskUuid: taskKwsUuid,
    location: data.location,
    language: data.language,
    searchEngine: data.searchEngine,
    serpLocation: data.serpLocation,
    easyWinsPatterns: data.easyWinsPatterns,
  });

  if (data.language === 'en') {
    const taskVerbsUuid = uuid();
    await dbAddOrUpdateDiscoveryTask(data._id, taskVerbsUuid, 'discovery-verbs', REPORT_STATUS_QUEUED);
    await sendToQueue<IDiscoveryVerbsMessage>('discovery-verbs', {
      taskUuid: taskVerbsUuid,
      reportId: data._id.toString(),
    });
  }

  const endTime = Date.now();
  const minutes = (endTime - startTime) / 1000 / 60;
  console.log(`[discovery-suggest]: Finished, took ${minutes} minutes`);

  return res.json({ success: true, message: 'Suggestions generated' });
};
