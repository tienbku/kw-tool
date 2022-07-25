import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { sortBy } from 'lodash';

interface Props {
  pills: string[];
}

const PER_PAGE = 25;

const Ideas = ({ pills }: Props) => {
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [currentItems, setCurrentItems] = useState<string[]>([]);

  useEffect(() => {
    const endOffset = itemOffset + PER_PAGE;
    setCurrentItems(sortBy(pills, (p) => p.toLowerCase()).slice(itemOffset, endOffset));
    setPageCount(Math.ceil(pills.length / PER_PAGE));
    setPage(Math.floor(itemOffset / PER_PAGE));
  }, [itemOffset, pills]);

  return (
    <div className="bg-white rounded shadow mb-3">
      <div className="py-3 px-3 select-none">
        <div className="text-sky-600">
          <i className="fa-solid fa-circle-question" />
          <span className="text-slate-500 text-xs pl-2">Discover modifiers to use on wildcard search</span>
        </div>
      </div>
      <div>
        {currentItems.length === 0 && (
          <div className="px-2 pb-3">
            <div className="text-center text-gray-600">No ideas found</div>
          </div>
          )}
        {currentItems.map((pill, i) => {
          return (
            <div key={`${pill}-${i}`} className={`border-0 border-t border-slate-200 py-1`}>
              <div className="flex items-center px-3">
                <div className="flex-grow truncate">
                  <span className="text-gray-700">{pill}</span>
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
            nextLinkClassName="text-xs text-sky-700 pl-1"
            previousLinkClassName="mr-1 text-xs text-sky-700 pr-1"
            className="flex items-center justify-center p-3 select-none"
            activeLinkClassName="bg-sky-300 hover:text-white hover:bg-sky-900 font-medium"
            pageLinkClassName="mr-1 px-2 py-0.5 text-xs bg-sky-100 hover:bg-sky-200 text-sky-900 rounded cursor-pointer select-none"
            onPageChange={(event) => {
              setItemOffset((event.selected * PER_PAGE) % pills.length);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Ideas;
