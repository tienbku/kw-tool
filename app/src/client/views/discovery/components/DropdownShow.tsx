import React, { Fragment } from 'react';
import Checkbox from '../../../components/Checkbox';
import { Menu, Transition } from '@headlessui/react';
import { IAtomDiscoveryControl } from '../atoms/AtomDiscoveryControl';

interface Props {
  filters: IAtomDiscoveryControl;
  setFilters: (filters: IAtomDiscoveryControl) => void;
}

interface ItemProps {
  label: string;
  color: string;
  active: boolean;
  onClick: () => void;
}

const Item = ({ color, active, onClick, label }: ItemProps) => {
  return (
    <Menu.Item>
      <div className={`group flex items-center px-4 py-2 text-sm cursor-pointer ${active ? 'font-medium' : ''} ${color}`} onClick={onClick}>
        <Checkbox checked={active} label={label} />
      </div>
    </Menu.Item>
  );
};

const DropdownShow = ({ filters, setFilters }: Props) => {
  return (
    <div className="w-56">
      <Menu as="div" className="relative inline-block text-left z-20 w-full">
        <div>
          <Menu.Button className="flex items-center justify-left w-full rounded-md border border-slate-200 shadow-sm px-4 pb-1 pt-1.5 bg-sky-700 text-white hover:bg-sky-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-sky-500">
            <i className={`text-white ri-eye-line ri-lg mr-3`} />
            <div className="flex-grow text-left capitalize">Show Keyword Data</div>
            <i className="ri-arrow-down-s-line ri-lg" />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="origin-top-left absolute left-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
            <div className="py-1">
              <Item
                label="Show EasyWins score"
                color="bg-white text-slate-800 hover:bg-slate-50 hover:text-slate-900"
                active={filters.showEwScore}
                onClick={() => {
                  setFilters({
                    ...filters,
                    showEwScore: !filters.showEwScore,
                  });
                }}
              />
              <Item
                label="Show Serp Features"
                active={filters.showSerpFeatures}
                color="bg-purple-100 text-purple-800 hover:bg-purple-200 hover:text-purple-900"
                onClick={() => {
                  setFilters({
                    ...filters,
                    showSerpFeatures: !filters.showSerpFeatures,
                  });
                }}
              />
              <Item
                label="Show SERP Clusters"
                active={filters.showClusters}
                color="bg-sky-100 text-sky-800 hover:bg-sky-200 hover:text-sky-900"
                onClick={() => {
                  setFilters({
                    ...filters,
                    showClusters: !filters.showClusters,
                  });
                }}
              />
              <Item
                label="Show Semantic Clusters"
                active={filters.showSemanticClusters}
                color="bg-cyan-100 text-cyan-800 hover:bg-cyan-200 hover:text-cyan-900"
                onClick={() => {
                  setFilters({
                    ...filters,
                    showSemanticClusters: !filters.showSemanticClusters,
                  });
                }}
              />
              <Item
                label="Show Title Match"
                active={filters.showTitleMatches}
                color="bg-teal-100 text-teal-800 hover:bg-teal-200 hover:text-teal-900"
                onClick={() => {
                  setFilters({
                    ...filters,
                    showTitleMatches: !filters.showTitleMatches,
                  });
                }}
              />
              <Item
                label="Show Easy Win Matches"
                active={filters.showEwMatches}
                color="bg-lime-100 text-lime-800 hover:bg-lime-200 hover:text-lime-900"
                onClick={() => {
                  setFilters({
                    ...filters,
                    showEwMatches: !filters.showEwMatches,
                  });
                }}
              />
              <Item
                label="Show Competitors"
                color="bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
                active={filters.showCompetitorDomains}
                onClick={() => {
                  setFilters({
                    ...filters,
                    showCompetitorDomains: !filters.showCompetitorDomains,
                  });
                }}
              />
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default DropdownShow;
