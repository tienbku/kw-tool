import { sortBy } from 'lodash';
import ReactPaginate from 'react-paginate';
import React, { useEffect, useMemo, useState } from 'react';

interface IItem {
  value: string;
  count: number;
}

interface Props {
  label: string;
  current: string[];
  labelExtra?: string;
  items: Array<IItem>;
  setCurrent: (s: string[]) => void;
}

const PER_PAGE = 25;

const SectionSimpleFilter = ({ items, current, setCurrent, label, labelExtra }: Props) => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = React.useState('');
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState<IItem[]>([]);

  const sortedDomains = useMemo(() => {
    const filtered = items.filter((c) => {
      if (current.includes(c.value)) {
        return true;
      }
      return !search || c.value.includes(search);
    });

    return sortBy(filtered, (c) => c.count).reverse();
  }, [items, current, search]);

  useEffect(() => {
    const endOffset = itemOffset + PER_PAGE;
    setCurrentItems(sortedDomains.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(sortedDomains.length / PER_PAGE));
    setPage(Math.floor(itemOffset / PER_PAGE));
  }, [itemOffset, sortedDomains]);

  return (
    <div className="bg-white rounded shadow mb-3 select-none">
      <div className="pt-3 px-3">
        <div className="text-sky-600">
          <i className="fa-solid fa-circle-question" />
          <span className="text-slate-500 text-xs pl-2">
            Find keywords by {label} {labelExtra}. Total of {items.map((c) => c.count).reduce((a, b) => a + b, 0)}
          </span>
        </div>
      </div>
      <div>
        <div className="px-2 pb-3">
          <input
            type="text"
            value={search}
            placeholder={`Search ${items.length} ${label}`}
            onChange={(e) => {
              setItemOffset(0);
              setSearch(e.target.value || '');
            }}
            className={`w-full text-sm mt-3 bg-white relative border border-gray-300 rounded-md px-2 py-1 shadow-sm focus-within:ring-1 focus-within:ring-sky-600 focus-within:border-sky-600`}
          />
        </div>
        {currentItems.length === 0 && (
          <div className="px-2 pb-3">
            <div className="text-center text-gray-600">No {label} found</div>
          </div>
        )}
        {currentItems.map((item, i) => {
          const isCurrent = current.includes(item.value);
          return (
            <div
              key={`${item.value}-${i}`}
              className={`select-none border-0 border-t border-slate-200 py-1.5 ${
                isCurrent ? 'bg-lime-50 hover:bg-red-50' : 'hover:bg-sky-50'
              } cursor-pointer`}
              onClick={() => {
                if (isCurrent) {
                  setCurrent(current.filter((c) => c !== item.value));
                } else {
                  setCurrent([...current, item.value]);
                }
              }}
            >
              <div className="flex items-center px-3">
                <div className="flex-grow truncate">
                  <span className="text-gray-800" title={item.value.length > 45 ? item.value : undefined}>
                    {item.value}
                  </span>
                </div>
                <div className="flex items-center justify-end text-purple-500 text-xs pl-2" title="Count">
                  {item.count}
                </div>
              </div>
            </div>
          );
        })}
        {pageCount > 1 && (
          <ReactPaginate
            forcePage={page}
            breakLabel="..."
            nextLabel="next"
            previousLabel="prev"
            pageCount={pageCount}
            pageRangeDisplayed={1}
            renderOnZeroPageCount={undefined}
            breakClassName="text-gray-500 pr-2"
            nextLinkClassName="text-xs text-sky-800 pl-1"
            previousLinkClassName="mr-1 text-xs text-sky-800 pr-1"
            className="flex items-center justify-center p-3 select-none"
            activeLinkClassName="bg-sky-300 hover:text-white hover:bg-sky-900 font-medium"
            pageLinkClassName="mr-1 px-2 py-0.5 text-xs bg-sky-100 hover:bg-sky-200 text-sky-900 rounded cursor-pointer select-none"
            onPageChange={(event) => {
              setItemOffset((event.selected * PER_PAGE) % sortedDomains.length);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SectionSimpleFilter;
