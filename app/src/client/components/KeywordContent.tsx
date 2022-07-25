import React from 'react';
import Serp from './Serp';
import Highlighter from 'react-highlight-words';
import { IDiscoverySerpItem } from '../../types/IDiscoverySerpItem';
import { FEATURED_SNIPPET, ISerpFeature, ORGANIC } from '../../types/ISerpFeature';
import type { IDiscoveryItemOutput } from '../../api/discovery/input/inputGetDiscoveryItems';
import { getWordBoundaryRegex } from '../../shared/regex';
import InputWithIcon from './InputWithIcon';

interface Props {
  search?: string;
  ranking?: string;
  rankingPos?: number;
  ewPatterns?: string[];
  competitors?: string[];
  keyword: IDiscoveryItemOutput;
  setRanking: (ranking: string) => void;
}

const KeywordContent = ({ competitors, setRanking, ranking, ewPatterns, search, rankingPos, keyword }: Props) => {
  const [searchUrls, setSearchUrls] = React.useState('');
  const urls: Array<IDiscoverySerpItem & { type: ISerpFeature }> = [];

  if (keyword.featuredSnippet) {
    urls.push({ ...keyword.featuredSnippet, type: FEATURED_SNIPPET, position: 0 });
  }
  if (keyword.urlsTop) {
    urls.push(...keyword.urlsTop.map((url) => ({ ...url, type: ORGANIC })));
  }

  let foundInUrls: Array<{ url: string; position: number }> = [];
  if (ranking && keyword.urlsAll) {
    const reg = getWordBoundaryRegex(ranking);
    foundInUrls = keyword.urlsAll.filter((url) => reg.test(url.url));
  }

  return (
    <div className="flex flex-wrap">
      <div className="w-full lg:w-7/12">
        <div>
          {foundInUrls.length > 0 && (
            <div className=" mt-2 text-slate-700 text-sm">
              <div className="text-lg text-gray-700 font-semibold mb-2 mt-2 select-none">
                Rankings for <span className="italic text-base">{ranking}</span>
              </div>
              {foundInUrls.map((pos, index) => (
                <div key={`${pos.position}-${index}`} className="pb-2">
                  <a target="_blank" href={pos.url} rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 font-medium">
                    <span className="text-slate-600 pr-1 w-[35px] text-right inline-block">#{pos.position}</span> {pos.url}
                  </a>
                </div>
              ))}
            </div>
          )}
          <div className="text-lg text-gray-700 font-semibold mb-1 mt-2 select-none">Top 10</div>
          <Serp
            search={search}
            ranking={ranking}
            serpPositions={urls}
            patterns={ewPatterns}
            rankingPos={rankingPos}
            setRanking={setRanking}
            keyword={keyword.keyword}
            competitors={competitors}
          />
        </div>
        <div>
          {keyword.paa && keyword.paa.length > 0 && <div className="mb-1 mt-1 text-lg text-gray-600 font-semibold select-none">PAA</div>}
          {keyword.paa?.map((pa, i) => {
            return (
              <div className="flex items-center text-sm" key={`pa-${i}`}>
                <span className="font-semibold mr-1 select-none">{i + 1}.</span> <span className="capitalize">{pa}?</span>
              </div>
            );
          })}
        </div>
        <div>
          {keyword.related && keyword.related.length > 0 && (
            <div className="mb-1 mt-1 text-lg text-gray-600 font-semibold select-none">Related Searches</div>
          )}
          {keyword.related?.map((kw, i) => {
            return (
              <div className="flex items-center text-sm" key={`pa-${i}`}>
                <span className="font-semibold mr-1 select-none">{i + 1}.</span>{' '}
                <Highlighter searchWords={[keyword.keyword]} textToHighlight={kw} highlightClassName="bg-yellow-100 text-slate-700 py-0" />
              </div>
            );
          })}
        </div>
        <div>
          {keyword.bolded && keyword.bolded.length > 0 && (
            <div className="mb-1 mt-1 text-lg text-gray-600 font-semibold select-none">Bolded in SERP</div>
          )}
          {keyword.bolded?.map((bolded, i) => {
            return (
              <div className="flex items-center text-sm" key={`pa-${i}`}>
                <span className="font-semibold mr-1 select-none">{i + 1}.</span> <span className="capitalize">{bolded}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full lg:w-5/12">
        <div className="pt-3 lg:pt-0 lg:pl-3 truncate text-xs">
          <div className="text-lg text-gray-700 font-semibold mb-1 mt-2 select-none">Top 10+</div>
          <InputWithIcon
            small
            className="mb-2"
            label="Search URLs"
            icon="ri-search-line"
            placeholder="Search URLs"
            onChange={(e) => setSearchUrls(e)}
          />
          {keyword.urlsAll
            ?.slice(keyword.featuredSnippet !== undefined ? 11 : 10, 100)
            .filter((url) => !searchUrls || url.url.includes(searchUrls))
            .map((url, i) => {
              const isFound = foundInUrls.find((pos) => pos.url === url.url);
              return (
                <div key={`${url}-${i}`} className={`truncate py-1 px-1 ${isFound ? 'bg-lime-100' : ''}`}>
                  <span className="pr-2">#{url.position}</span>
                  <a
                    href={url.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-blue-600 hover:text-blue-700 truncate ${isFound ? 'underline' : ''}`}
                  >
                    {url.url}
                  </a>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default KeywordContent;
