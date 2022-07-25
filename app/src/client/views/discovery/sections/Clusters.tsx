import { sortBy } from 'lodash';
import { useRecoilState } from 'recoil';
import ReactPaginate from 'react-paginate';
import React, { useEffect, useMemo, useState } from 'react';
import { AtomDiscoveryControl } from '../atoms/AtomDiscoveryControl';
import type { IDiscoveryClusterOutput } from '../../../../api/discovery/input/inputGetDiscoveryClusters';

interface Props {
  clusters: IDiscoveryClusterOutput[];
}

const PER_PAGE = 25;

const Clusters = ({ clusters }: Props) => {
  const [page, setPage] = useState(0);
  const [search, setSearch] = React.useState('');
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [control, setControl] = useRecoilState(AtomDiscoveryControl);
  const [currentItems, setCurrentItems] = useState<IDiscoveryClusterOutput[]>([]);
  const sortedClusters = useMemo(() => {
    const filteredClusters = (clusters || []).filter((c) => {
      if (control.cluster.includes(c.keyword)) {
        return true;
      }

      return !search || c.keyword.includes(search);
    });
    return sortBy(filteredClusters, (c) => c?.similar.length).reverse();
  }, [clusters, control.cluster, search]);

  useEffect(() => {
    const endOffset = itemOffset + PER_PAGE;
    setCurrentItems(sortedClusters.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(sortedClusters.length / PER_PAGE));
    setPage(Math.floor(itemOffset / PER_PAGE));
  }, [itemOffset, sortedClusters]);

  return (
    <div className="bg-white rounded shadow mb-3 select-none">
      <div className="pt-3 px-3">
        <div className="text-sky-600">
          <i className="fa-solid fa-circle-question" />
          <span className="text-slate-500 text-xs pl-2">Use clusters to find topics, add them to your groups.</span>
        </div>
      </div>
      <div>
        <div className="pb-3 px-2">
          <input
            type="text"
            value={search}
            placeholder={`Search ${clusters.length} clusters`}
            onChange={(e) => {
              setItemOffset(0);
              setSearch(e.target.value || '');
            }}
            className={`w-full text-sm mt-3 bg-white relative border border-gray-300 rounded-md px-2 py-1 shadow-sm focus-within:ring-1 focus-within:ring-sky-600 focus-within:border-sky-600`}
          />
        </div>
        {currentItems.length === 0 && (
          <div className="px-2 pb-3">
            <div className="text-center text-gray-600">No clusters found</div>
          </div>
        )}
        {currentItems.map((cluster, i) => {
          const isCurrent = control.cluster.includes(cluster.keyword);
          return (
            <div
              key={`${cluster.keyword}-${i}`}
              className={`select-none border-0 border-t border-slate-200 py-1.5 ${
                isCurrent ? 'bg-lime-50 hover:bg-red-50' : 'hover:bg-sky-50'
              } cursor-pointer`}
              onClick={() => {
                if (isCurrent) {
                  setControl((prev) => ({
                    ...prev,
                    itemOffset: 0,
                    cluster: control.cluster.filter((c) => c !== cluster.keyword),
                  }));
                } else {
                  setControl((prev) => ({
                    ...prev,
                    itemOffset: 0,
                    cluster: [...control.cluster, cluster.keyword],
                  }));
                }
              }}
            >
              <div className="flex items-center px-3">
                <div className="flex-grow truncate">
                  <span className="text-gray-800" title={cluster.keyword.length > 45 ? cluster.keyword : undefined}>
                    {cluster.keyword}
                  </span>
                </div>
                <div className="flex items-center justify-end text-purple-500 text-xs pl-2" title="Volume">
                  {cluster.similar.length}
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
              setItemOffset((event.selected * PER_PAGE) % sortedClusters.length);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Clusters;
