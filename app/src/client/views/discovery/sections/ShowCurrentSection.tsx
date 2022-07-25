import Help from './Help';
import Terms from './Terms';
import Ideas from './Ideas';
import Value from './Value';
import Intent from './Intent';
import Groups from './Groups';
import Ranking from './Ranking';
import Filters from './Filters';
import Recipes from './Recipes';
import Clusters from './Clusters';
import React, { Fragment } from 'react';
import { useRecoilState } from 'recoil';
import AddKeywords from './AddKeywords';
import UpdateEwPatterns from './UpdateEwPatterns';
import UpdateCompetitors from './UpdateCompetitors';
import { IDiscoveryTerm } from '../../../../types/IDiscoveryTerm';
import { AtomDiscoveryControl } from '../atoms/AtomDiscoveryControl';
import SectionSimpleFilter from '../../../components/SectionSimpleFilter';
import type { IDiscoveryItemOutput } from '../../../../api/discovery/input/inputGetDiscoveryItems';
import type { IDiscoveryClusterOutput } from '../../../../api/discovery/input/inputGetDiscoveryClusters';
import { SEARCH_TYPE_CUSTOM, SEARCH_TYPE_QUESTIONS, SEARCH_TYPE_URL, SEARCH_TYPE_WILDCARD } from '../../../../types/IDiscoverySearchType';

interface Props {
  pills: string[];
  allPaa: string[];
  reportId: string;
  isLoading: boolean;
  reportSeed?: string;
  ewDefaults: boolean;
  hasTopicMap: boolean;
  terms: IDiscoveryTerm[];
  hasRunningTasks: boolean;
  reportNotFinished: boolean;
  items: IDiscoveryItemOutput[];
  verbs: Record<string, number>;
  competitorPatterns: string[];
  doAddGroup: (name: string) => void;
  clusters?: IDiscoveryClusterOutput[];
  doRemoveGroup: (name: string) => void;
  filteredItems: IDiscoveryItemOutput[];
  semanticClusters: Record<string, string[]>;
  groups?: Array<{ name: string; count: number }>;
  domains: Array<{ value: string; count: number }>;
  ewPatterns: Array<{ value: string; count: number }>;
  competitors: Array<{ value: string; count: number }>;
  doUpdateCompetitors: (competitors: string[]) => void;
  doUpdateEwPatterns: (patterns: string[], defaults: boolean) => void;
  doUpdateGroupKeywords: (name: string, action: 'add' | 'remove') => void;
  doExpandKeywords: (
    seed: string | undefined,
    searchType: typeof SEARCH_TYPE_WILDCARD | typeof SEARCH_TYPE_QUESTIONS | typeof SEARCH_TYPE_CUSTOM | typeof SEARCH_TYPE_URL,
    keywords?: string[],
  ) => void;
}

const ShowCurrentSection = ({
  verbs,
  items,
  terms,
  pills,
  allPaa,
  groups,
  domains,
  reportId,
  clusters,
  isLoading,
  reportSeed,
  ewPatterns,
  doAddGroup,
  ewDefaults,
  competitors,
  hasTopicMap,
  doRemoveGroup,
  filteredItems,
  hasRunningTasks,
  doExpandKeywords,
  semanticClusters,
  reportNotFinished,
  competitorPatterns,
  doUpdateEwPatterns,
  doUpdateCompetitors,
  doUpdateGroupKeywords,
}: Props) => {
  const [control, setControl] = useRecoilState(AtomDiscoveryControl);
  const sidebarSection = control.sidebarSection;
  const filteredVolume = (filteredItems || []).reduce((acc, item) => acc + (item.volume || 0), 0);
  const filteredCpc = (filteredItems || []).reduce((acc, item) => acc + parseInt((item.cpc || 0).toString()), 0);

  return (
    <Fragment>
      {sidebarSection === 'groups' && (
        <Groups
          isLoading={isLoading}
          doAddGroup={doAddGroup}
          doRemoveGroup={doRemoveGroup}
          doUpdateGroupKeywords={doUpdateGroupKeywords}
          groups={(groups || []).map((g) => ({ name: g.name, count: g.count }))}
        />
      )}
      {sidebarSection === 'terms' && <Terms items={items} terms={terms || []} isLoading={isLoading} />}
      {sidebarSection === 'clusters' && <Clusters clusters={clusters || []} />}
      {sidebarSection === 'domains' && (
        <SectionSimpleFilter
          label="domains"
          current={control.domain}
          labelExtra="in the top 10"
          items={domains.map((dom) => ({ value: dom.value, count: dom.count }))}
          setCurrent={(items) => {
            setControl((prev) => ({ ...prev, domain: items, itemOffset: 0 }));
          }}
        />
      )}
      {sidebarSection === 'competitors' && (
        <Fragment>
          <SectionSimpleFilter
            label="competitors"
            labelExtra="in the top 10"
            current={control.competitor}
            items={competitors.map((dom) => ({ value: dom.value, count: dom.count }))}
            setCurrent={(items) => {
              setControl((prev) => ({ ...prev, competitor: items, itemOffset: 0 }));
            }}
          />
          <UpdateCompetitors
            hasRunningTasks={hasRunningTasks}
            competitorPatterns={competitorPatterns}
            doUpdateCompetitors={doUpdateCompetitors}
          />
        </Fragment>
      )}
      {sidebarSection === 'ew-patterns' && (
        <Fragment>
          <SectionSimpleFilter
            label="ew patterns"
            labelExtra="in the top 10"
            current={control.ewPattern}
            items={ewPatterns.map((dom) => ({ value: dom.value, count: dom.count }))}
            setCurrent={(items) => {
              setControl((prev) => ({ ...prev, ewPattern: items, itemOffset: 0 }));
            }}
          />
          <UpdateEwPatterns
            ewDefaults={ewDefaults}
            hasRunningTasks={hasRunningTasks}
            doUpdateEwPatterns={doUpdateEwPatterns}
            ewPatterns={ewPatterns.map((dom) => dom.value)}
          />
        </Fragment>
      )}
      {sidebarSection === 'pills' && <Ideas pills={pills} />}
      {sidebarSection === 'verbs' && (
        <SectionSimpleFilter
          label="verbs"
          current={control.lemma}
          items={Object.keys(verbs).map((verb) => {
            const count = verbs[verb];
            return { value: verb, count };
          })}
          setCurrent={(items) => {
            setControl((prev) => ({ ...prev, lemma: items, itemOffset: 0 }));
          }}
        />
      )}
      {sidebarSection === 'semantic-clusters' && (
        <SectionSimpleFilter
          label="semantic clusters"
          current={control.semanticCluster}
          items={Object.keys(semanticClusters).map((cluster) => {
            const count = semanticClusters[cluster].length;
            return { value: cluster, count };
          })}
          setCurrent={(items) => {
            setControl((prev) => ({ ...prev, semanticCluster: items, semanticSuperCluster: [], itemOffset: 0 }));
          }}
        />
      )}
      {sidebarSection === 'filters' && <Filters reportNotFinished={reportNotFinished} />}
      {sidebarSection === 'intent' && <Intent />}
      {sidebarSection === 'value' && <Value volume={filteredVolume} cpc={filteredCpc} keywordsCount={filteredItems.length} />}
      {sidebarSection === 'ranking' && <Ranking />}
      {sidebarSection === 'help' && <Help />}
      {sidebarSection === 'recipes' && (
        <Recipes
          reportId={reportId}
          itemsCount={items.length}
          hasTopicMap={hasTopicMap}
          semanticClustersCount={Object.keys(semanticClusters).length}
        />
      )}
      {sidebarSection === 'add-keywords' && (
        <AddKeywords allPaa={allPaa} reportSeed={reportSeed} doExpandKeywords={doExpandKeywords} hasRunningTasks={hasRunningTasks} />
      )}
    </Fragment>
  );
};

export default ShowCurrentSection;
