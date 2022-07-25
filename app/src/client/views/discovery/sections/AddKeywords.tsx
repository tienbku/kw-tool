import isURL from 'validator/lib/isURL';
import Button from '../../../components/Button';
import React, { Fragment, useEffect, useState } from 'react';
import InputWithIcon from '../../../components/InputWithIcon';
import { DISCOVERY_REPORT_COST, MAX_CUSTOM_KEYWORDS } from '../../../../constants';
import { SEARCH_TYPE_CUSTOM, SEARCH_TYPE_QUESTIONS, SEARCH_TYPE_URL, SEARCH_TYPE_WILDCARD } from '../../../../types/IDiscoverySearchType';
import { uniq } from 'lodash';

type IAllowedTypes = typeof SEARCH_TYPE_WILDCARD | typeof SEARCH_TYPE_QUESTIONS | typeof SEARCH_TYPE_CUSTOM | typeof SEARCH_TYPE_URL;

interface Props {
  allPaa: string[];
  reportSeed?: string;
  hasRunningTasks: boolean;
  doExpandKeywords: (seed: string | undefined, searchType: IAllowedTypes, keywords?: string[], url?: string) => void;
}

const AddKeywords = ({ allPaa, reportSeed, hasRunningTasks, doExpandKeywords }: Props) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [seedKeyword, setSeedKeyword] = useState('');
  const [tmpDisabled, setTmpDisabled] = useState(false);
  const [customKeywords, setCustomKeywords] = useState('');
  const [type, setType] = useState<IAllowedTypes>(SEARCH_TYPE_QUESTIONS);

  useEffect(() => {
    let errorMsg = '';

    const seedNeeded = type === SEARCH_TYPE_QUESTIONS || type === SEARCH_TYPE_WILDCARD;

    if (seedNeeded && !seedKeyword) {
      errorMsg = 'Please enter a seed keyword';
    } else if (type !== SEARCH_TYPE_WILDCARD && seedKeyword.includes('*')) {
      errorMsg = 'You can only use * with wildcard search';
    } else if (type === SEARCH_TYPE_CUSTOM && (customKeywords.includes(',') || customKeywords.includes('*'))) {
      errorMsg = 'Custom keywords cannot contain commas or asterisks';
    } else if (type === SEARCH_TYPE_CUSTOM && customKeywords.length === 0) {
      errorMsg = 'Please enter at least one custom keyword';
    } else if (type === SEARCH_TYPE_WILDCARD && seedKeyword.split('*').length > 3) {
      errorMsg = 'Seed keyword cannot contain more than two wildcards';
    } else if (type === SEARCH_TYPE_WILDCARD && !seedKeyword.includes('*')) {
      errorMsg = 'Wildcard search requires one wildcard character';
    } else if (
      type === SEARCH_TYPE_URL &&
      !isURL(url, {
        require_host: true,
        require_port: false,
        allow_fragments: false,
        protocols: ['http', 'https'],
        require_valid_protocol: true,
      })
    ) {
      errorMsg = 'Please enter a valid URL';
    } else if (seedNeeded && seedKeyword.length <= 1) {
      errorMsg = 'Seed keyword must be at least 2 characters long';
    }

    setError(errorMsg);
    setCanSubmit(errorMsg === '');
  }, [seedKeyword, customKeywords, type, url]);

  useEffect(() => {
    if (tmpDisabled) {
      setTimeout(() => {
        setTmpDisabled(false);
      }, 5000);
    }
  }, [tmpDisabled]);

  return (
    <div>
      <div className="bg-white pt-3 px-3 pb-1 rounded shadow select-none">
        <div className="text-sky-600">
          <i className="fa-solid fa-circle-question" />
          <span className="text-slate-500 text-xs pl-2">Expand your report with more keywords</span>
        </div>
        <div className="py-2">
          <div className="text-base font-medium text-slate-600 mb-1 mt-1">What do you want to do?</div>
          <select
            value={type}
            onChange={(e) => {
              if (e.target.value !== SEARCH_TYPE_CUSTOM) {
                setCustomKeywords('');
              }
              setType(e.target.value as IAllowedTypes);
            }}
            className="focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm text-sm border-gray-300 rounded-md"
          >
            <option value={SEARCH_TYPE_QUESTIONS}>Discover question keywords</option>
            <option value={SEARCH_TYPE_WILDCARD}>Wildcard search suggestions</option>
            <option value={SEARCH_TYPE_CUSTOM}>Add my own keywords</option>
            <option value={SEARCH_TYPE_URL}>Get keywords for a URL</option>
          </select>
          {(type === SEARCH_TYPE_QUESTIONS || type === SEARCH_TYPE_WILDCARD) && (
            <Fragment>
              <div className="text-base font-medium text-slate-600 mt-3 mb-1">Seed Keyword</div>
              <InputWithIcon
                value={seedKeyword}
                label="Seed Keyword"
                className="w-full mb-3"
                placeholder="Seed Keyword"
                onChange={(e) => setSeedKeyword(e)}
              />
            </Fragment>
          )}
          {type === SEARCH_TYPE_URL && (
            <Fragment>
              <div className="text-base font-medium text-slate-500 mb-1 mt-3">Domain or URL</div>
              <InputWithIcon
                value={url}
                label="Domain or URL"
                className="w-full mb-1"
                placeholder="Domain or URL"
                onChange={(e) => setUrl(e)}
              />
              <div className="text-xs text-slate-600 mb-1.5">
                Include protocol. Example: <span className="italic">https://www.example.com/blog/post</span>
              </div>
            </Fragment>
          )}
          {type === SEARCH_TYPE_CUSTOM && (
            <Fragment>
              <div className="text-base font-medium text-slate-600 mt-3 mb-1">Custom Keywords</div>
              <textarea
                rows={3}
                value={customKeywords}
                disabled={type !== SEARCH_TYPE_CUSTOM}
                onChange={(e) => setCustomKeywords(e.target.value || '')}
                className={`w-full shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm border border-gray-300 ${
                  type !== SEARCH_TYPE_CUSTOM ? 'bg-slate-50' : ''
                } rounded-md`}
              />
            </Fragment>
          )}
          <div className="text-xs text-slate-600 mb-1.5">One keyword per line</div>
          {error && <div className="px-3 py-2 rounded bg-red-100 text-red-800 text-sm mt-2">{error}</div>}
          <div className="px-3 py-2 bg-sky-50 text-sky-700 rounded mt-2">
            <span className="font-medium">Expanding the report will cost you {DISCOVERY_REPORT_COST} credits</span>
          </div>
          <Button
            className="mt-2"
            text="Expand Keywords"
            color="text-white bg-lime-600 hover:bg-lime-700"
            disabled={hasRunningTasks || !canSubmit || tmpDisabled}
            onClick={() => {
              if (!hasRunningTasks && canSubmit) {
                let keywords: string[] = [];
                if (type === SEARCH_TYPE_CUSTOM) {
                  keywords = uniq(
                    customKeywords
                      .split('\n')
                      .map((k) => k.trim())
                      .filter((k) => k.length > 0),
                  );

                  if (keywords.length > MAX_CUSTOM_KEYWORDS) {
                    setError(`You can only enter ${MAX_CUSTOM_KEYWORDS} custom keywords`);
                    setCanSubmit(false);
                    return;
                  }
                }

                setTmpDisabled(true);
                doExpandKeywords(seedKeyword, type, keywords, url);
              }
            }}
          />
          <Button
            text="Clear"
            className="ml-2"
            color={`text-white ${seedKeyword || customKeywords || url ? 'bg-red-500' : 'bg-slate-400'} hover:bg-red-400`}
            onClick={() => {
              setUrl('');
              setSeedKeyword('');
              setCanSubmit(true);
              setTmpDisabled(false);
              setCustomKeywords('');
            }}
          />
        </div>
      </div>
      <div className="bg-white pt-3 px-3 pb-1 rounded shadow select-none mt-3">
        <div className="text-sky-600">
          <i className="fa-solid fa-circle-question" />
          <span className="text-slate-500 text-xs pl-2">Add PAA keywords found to report</span>
        </div>
        <div className="py-2">
          <div className="text-base font-medium text-slate-600 mt-1">Would you like to include PAAs as keywords?</div>
          <div className="text-slate-500 text-xs mb-1">Only for found PAAs on already analyzed keywords</div>
          <Button
            className="mt-2"
            text="Inject PAAs"
            color="text-white bg-lime-600 hover:bg-lime-700"
            disabled={hasRunningTasks || allPaa.length === 0 || tmpDisabled}
            onClick={() => {
              if (!hasRunningTasks && allPaa.length > 0) {
                setTmpDisabled(true);
                doExpandKeywords(reportSeed, SEARCH_TYPE_CUSTOM, allPaa);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AddKeywords;
