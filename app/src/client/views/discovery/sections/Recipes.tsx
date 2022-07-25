import React, { useCallback } from 'react';
import Button from '../../../components/Button';
import { trpc } from '../../../utils';
import { DISCOVERY_TOPIC_MAP_COST } from '../../../../constants';

interface Props {
  reportId?: string;
  itemsCount: number;
  hasTopicMap?: boolean;
  semanticClustersCount: number;
}

const MIN_ITEMS = 500;
const MIN_SEMANTIC_CLUSTERS = 50;

const Recipes = ({ hasTopicMap, reportId, itemsCount, semanticClustersCount }: Props) => {
  const hasEnoughKeywords = itemsCount > MIN_ITEMS;
  const hasEnoughSemanticClusters = semanticClustersCount > MIN_SEMANTIC_CLUSTERS;

  const doCreateTopicMap = trpc.useMutation('discovery:create-topic-map', {
    onSuccess: (response) => {
      if (response.success) {
        window.location.href = `/discovery/topic-map/${reportId}`;
      }
    },
  });

  const createTopicMap = useCallback(() => {
    if (reportId) {
      doCreateTopicMap.mutate({
        reportId,
      });
    }
  }, [doCreateTopicMap, reportId]);

  return (
    <div className="bg-white pt-3 pb-1 rounded shadow select-none">
      <div className="text-sky-600 pl-3">
        <i className="fa-solid fa-circle-question" />
        <span className="text-slate-500 text-xs pl-2">Recipes to save you some time</span>
      </div>
      <div className="block border-t border-slate-200 mt-2 pt-1">
        <div className="px-3 py-2">
          <div className="text-lg text-slate-600">Topic Map</div>
          <div className="text-slate-700 text-sm">Automatically create a topic map based on your keywords.</div>
          <div className="mt-2">
            <ul className="pl-2">
              {hasEnoughKeywords ? (
                <li className="text-lime-700 text-base">
                  <i className="fa-solid fa-check pr-1" /> Enough keywords with data
                  <span className="text-sm pl-2">
                    {itemsCount}/{MIN_ITEMS}
                  </span>
                </li>
              ) : (
                <li className="text-red-700 text-base">
                  <i className="fa-solid fa-times pr-1" /> Enough keywords with data
                  <span className="text-sm pl-2">
                    {itemsCount}/{MIN_ITEMS}
                  </span>
                </li>
              )}
              {hasEnoughSemanticClusters ? (
                <li className="text-lime-700 text-base">
                  <i className="fa-solid fa-check pr-1" /> Enough semantic clusters
                  <span className="text-sm pl-2">
                    {semanticClustersCount}/{MIN_SEMANTIC_CLUSTERS}
                  </span>
                </li>
              ) : (
                <li className="text-red-700 text-base">
                  <i className="fa-solid fa-times pr-1" /> Enough semantic clusters
                  <span className="text-sm pl-2">
                    {semanticClustersCount}/{MIN_SEMANTIC_CLUSTERS}
                  </span>
                </li>
              )}
            </ul>
          </div>
          <div className="mt-1">
            {hasTopicMap && (
              <div className="mb-2 text-red-600 font-medium">Re-generating will cost you {DISCOVERY_TOPIC_MAP_COST} credits</div>
            )}
            <Button
              small
              icon="fa-solid fa-robot"
              className="mr-2"
              color="bg-lime-700 hover:bg-lime-600 text-white"
              text={`${hasTopicMap ? 'Re-Generate' : 'Generate'} Topic Map`}
              disabled={!hasEnoughKeywords || !hasEnoughSemanticClusters || !reportId}
              onClick={() => {
                if (hasEnoughKeywords && hasEnoughSemanticClusters) {
                  createTopicMap();
                }
              }}
            />
            {hasTopicMap && (
              <Button
                small
                className="mt-2 3xl:mt-0"
                text="View Topic-Map"
                icon="fa-solid fa-eye"
                color="text-white bg-blue-700 hover:bg-blue-600"
                disabled={!reportId || !hasTopicMap}
                onClick={() => {
                  window.location.href = `/discovery/topic-map/${reportId}`;
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipes;
