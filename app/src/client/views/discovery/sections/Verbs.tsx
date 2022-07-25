import { sortBy } from 'lodash';
import ReactPaginate from 'react-paginate';
import React, { useEffect, useState } from 'react';

interface Props {
  current: string;
  verbs: Record<string, number>;
  setSearch: (search: string) => void;
}

const PER_PAGE = 25;

const Verbs = ({ current, verbs, setSearch }: Props) => {
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState<string[]>([]);

  useEffect(() => {
    const endOffset = itemOffset + PER_PAGE;
    const allVerbs = Object.keys(verbs);
    setCurrentItems(sortBy(allVerbs, (p) => p.toLowerCase()).slice(itemOffset, endOffset));
    setPageCount(Math.ceil(verbs.length / PER_PAGE));
    setPage(Math.floor(itemOffset / PER_PAGE));
  }, [itemOffset, verbs]);

  return (
    <div className="bg-white rounded shadow mb-3 select-none">
      <div className="py-3 px-3 select-none">
        <div className="text-sky-600 flex items-center">
          <i className="ri-question-line" />
          <span className="text-slate-500 text-xs pl-2">Discover user intent/modifiers using extracted verbs</span>
        </div>
      </div>
      <div>
        {currentItems.length === 0 && (
          <div className={`border-0 border-t border-slate-200 py-1`}>
            <div className="flex items-center px-3">
              <div className="flex-grow truncate">
                <span className="text-gray-500">Nothing found yet.</span>
              </div>
            </div>
          </div>
        )}
        {currentItems.map((verb, i) => {
          return (
            <div
              key={`${verb}-${i}`}
              onClick={() => setSearch(verb)}
              className={`border-0 border-t border-slate-200 py-1 ${
                current === verb ? 'bg-lime-50 font-semibold hover:bg-red-50' : 'hover:bg-slate-50'
              } cursor-pointer`}
            >
              <div className="flex items-center px-3">
                <div className="flex-grow flex items-center">{verb}</div>
                {verbs[verb] > 0 && <div className="text-xs text-purple-500">{verbs[verb]}</div>}
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
            nextLinkClassName="text-xs text-sky-700 pl-1"
            previousLinkClassName="mr-1 text-xs text-sky-700 pr-1"
            className="flex items-center justify-center p-3 select-none"
            activeLinkClassName="bg-sky-300 hover:text-white hover:bg-sky-900 font-medium"
            pageLinkClassName="mr-1 px-2 py-0.5 text-xs bg-sky-100 hover:bg-sky-200 text-sky-900 rounded cursor-pointer select-none"
            onPageChange={(event) => {
              setItemOffset((event.selected * PER_PAGE) % verbs.length);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Verbs;
