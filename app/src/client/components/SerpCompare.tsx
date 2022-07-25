import React from 'react';
import { IDiscoveryItemOutput } from '../../api/discovery/input/inputGetDiscoveryItems';

interface IComparisonItem {
  url: string;
  found: boolean;
  sameInPosition: boolean;
  isFeaturedSnippet: boolean;
}

interface Props {
  selected: [string, string];
  kw1: IDiscoveryItemOutput;
  kw2: IDiscoveryItemOutput;
}

const stringIsNotUndefined = (str: string | undefined): str is string => str !== undefined;

const SerpCompare = ({ kw1, kw2 }: Props) => {
  const urls1: string[] = (kw1.urlsTop || []).map((pos) => pos.url || '').filter(stringIsNotUndefined);
  const urls2: string[] = (kw2.urlsTop || []).map((pos) => pos.url || '').filter(stringIsNotUndefined);

  const featuredSnippet1 = kw1.featuredSnippet?.url || '';
  urls1.unshift(featuredSnippet1);

  const featuredSnippet2 = kw2.featuredSnippet?.url || '';
  urls2.unshift(featuredSnippet2);

  const comparisonData: Record<string, IComparisonItem[]> = {};

  for (const url of urls1) {
    if (!comparisonData[kw1.keyword]) {
      comparisonData[kw1.keyword] = [];
    }

    const sameInPosition = url !== '' && urls1.indexOf(url) === urls2.indexOf(url);
    comparisonData[kw1.keyword].push({
      url,
      sameInPosition,
      found: url !== '' && urls2.includes(url),
      isFeaturedSnippet: kw1.featuredSnippet?.url === url,
    });
  }

  for (const url of urls2) {
    if (!comparisonData[kw2.keyword]) {
      comparisonData[kw2.keyword] = [];
    }

    const sameInPosition = url !== '' && urls1.indexOf(url) === urls2.indexOf(url);
    comparisonData[kw2.keyword].push({
      url,
      sameInPosition,
      found: url !== '' && urls1.includes(url),
      isFeaturedSnippet: kw2.featuredSnippet?.url === url,
    });
  }

  return (
    <div className="mb-3 flex flex-wrap">
      <div className="w-full lg:w-6/12 mb-3 lg:mb-0">
        <div className="h-full">
          <ComparisonKw keyword={kw1.keyword} sameSide="right" comparisons={comparisonData[kw1.keyword]} />
        </div>
      </div>
      <div className="w-full lg:w-6/12">
        <div className="lg:pl-3 h-full ">
          <ComparisonKw keyword={kw2.keyword} sameSide="left" comparisons={comparisonData[kw2.keyword]} />
        </div>
      </div>
    </div>
  );
};

const ComparisonKw = ({
  keyword,
  sameSide,
  comparisons,
}: {
  keyword: string;
  sameSide: 'left' | 'right';
  comparisons: IComparisonItem[];
}) => {
  return (
    <div className="bg-white rounded shadow-md mb-3 h-full">
      <div className="text-gray-600 mb-2 pl-2 pt-2" title={keyword}>
        {keyword}
      </div>
      {comparisons?.map((item, i) => {
        const { url, found, sameInPosition } = item;

        let border;
        if (sameInPosition) {
          border = `border-green-500 border-solid border-0 ${sameSide === 'right' ? 'border-r-8' : 'border-l-8'}`;
        } else if (found) {
          border = `border-gray-400 border-solid border-0 ${sameSide === 'right' ? 'border-r-4' : 'border-l-4'}`;
        }

        let icon = '';
        if (item.isFeaturedSnippet) {
          icon = 'fa-solid fa-star text-yellow-500';
        }

        return (
          <div key={`item-${i}`} className="">
            <div
              className={`${border} ${
                found ? 'bg-green-100 hover:bg-green-200' : 'bg-red-100 hover:bg-red-200'
              } py-1 px-2 divide-y divide-gray-100 mb-1 truncate`}
            >
              <a
                href={url}
                title={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${found ? 'text-green-700 hover:text-green-800' : 'text-red-700 hover:text-red-800'} text-sm truncate`}
              >
                {icon ? <i className={icon} /> : undefined} {url || <span>&mdash;</span>}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SerpCompare;
