import { ISerpFeature } from '../../../../types/ISerpFeature';
import { atom, selector } from 'recoil';
import { IDiscoverySidebarSection } from '../../../../types/IDiscoverySidebarSection';
import { IDiscoveryKeywordsSort } from '../../../../types/IDiscoveryKeywordsSort';

export interface IAtomDiscoveryControl {
  // Items
  itemOffset: number;
  sort: IDiscoveryKeywordsSort;

  // Selection
  selected: string[];

  // Search
  search: string;
  ignore: string;
  orSearch: boolean;
  exactSearch: boolean;

  // Extra Search
  lemma: string[];
  ranking: string;

  // Show Data
  showEwScore: boolean;
  showClusters: boolean;
  showEwMatches: boolean;
  showTitleMatches: boolean;
  showSerpFeatures: boolean;
  showSemanticClusters: boolean;
  showCompetitorDomains: boolean;

  // Filter
  withoutSerpData: boolean;
  minVol: number | undefined;
  maxVol: number | undefined;
  serpFeaturesFilter: ISerpFeature[];

  // Section filters
  sidebarSection: IDiscoverySidebarSection;
  group: string;
  intent: string;
  domain: string[];
  cluster: string[];
  ewPattern: string[];
  competitor: string[];
  semanticCluster: string[];
  semanticSuperCluster: string[];
}

export const AtomDiscoveryControl = atom<IAtomDiscoveryControl>({
  key: 'AtomDiscoveryControl',
  default: {
    lemma: [],
    group: '',
    search: '',
    ignore: '',
    intent: '',
    domain: [],
    ranking: '',
    cluster: [],
    selected: [],
    ewPattern: [],
    itemOffset: 0,
    sort: 'volume',
    competitor: [],
    orSearch: false,
    minVol: undefined,
    maxVol: undefined,
    showEwScore: false,
    exactSearch: false,
    showClusters: false,
    semanticCluster: [],
    showEwMatches: false,
    serpFeaturesFilter: [],
    withoutSerpData: false,
    showSerpFeatures: false,
    showTitleMatches: false,
    sidebarSection: 'terms',
    semanticSuperCluster: [],
    showSemanticClusters: false,
    showCompetitorDomains: false,
  },
});

export const ControlHasFilters = selector({
  key: 'hasFilters',
  get: ({ get }) => {
    const control = get(AtomDiscoveryControl);
    const filterKeys: Array<keyof IAtomDiscoveryControl> = ['minVol', 'maxVol', 'group', 'ignore', 'search', 'intent'];
    return (
      filterKeys.some((key) => {
        return control[key] !== undefined && control[key] !== '';
      }) ||
      control.withoutSerpData ||
      control.lemma.length > 0 ||
      control.domain.length > 0 ||
      control.cluster.length > 0 ||
      control.ewPattern.length > 0 ||
      control.competitor.length > 0 ||
      control.semanticCluster.length > 0 ||
      control.serpFeaturesFilter.length > 0
    );
  },
});
