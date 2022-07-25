import React, { Fragment } from 'react';
import { classNames } from '../../../utils';
import { Menu, Transition } from '@headlessui/react';
import { IDiscoverySidebarSection } from '../../../../types/IDiscoverySidebarSection';
import { AtomDiscoveryControl } from '../atoms/AtomDiscoveryControl';
import { useRecoilState } from 'recoil';

const DropdownSections = () => {
  const [control, setControl] = useRecoilState(AtomDiscoveryControl);
  const section = control.sidebarSection;
  const setSection = (section: IDiscoverySidebarSection) => {
    setControl((prev) => ({
      ...prev,
      sidebarSection: section,
    }));
  };

  let icon = '';
  let sectionName: string = section;
  if (section === 'terms') {
    sectionName = 'Modifiers';
    icon = 'ri-price-tag-3-line';
  } else if (section === 'pills') {
    sectionName = 'Ideas';
    icon = 'ri-lightbulb-line';
  } else if (section === 'clusters') {
    sectionName = 'SERP Clusters';
    icon = 'ri-mind-map';
  } else if (section === 'semantic-clusters') {
    sectionName = 'Semantic Clusters';
    icon = 'ri-mind-map';
  } else if (section === 'domains') {
    icon = 'ri-global-line';
  } else if (section === 'verbs') {
    icon = 'ri-sword-line';
  } else if (section === 'intent') {
    icon = 'ri-map-pin-user-fill';
  } else if (section === 'groups') {
    icon = 'ri-stack-line';
  } else if (section === 'value') {
    sectionName = 'Keywords $ Value';
    icon = 'ri-money-dollar-box-line';
  } else if (section === 'filters') {
    sectionName = 'Filters & Search';
    icon = 'ri-filter-line';
  } else if (section === 'ew-patterns') {
    sectionName = 'Custom EasyWins Patterns';
    icon = 'ri-flask-line';
  } else if (section === 'competitors') {
    icon = 'ri-computer-line';
  } else if (section === 'ranking') {
    sectionName = 'Ranking Check';
    icon = 'ri-line-chart-line';
  } else if (section === 'help') {
    icon = 'ri-book-line';
  } else if (section === 'add-keywords') {
    sectionName = 'Add Keywords';
    icon = 'ri-add-line';
  } else if (section === 'recipes') {
    icon = 'ri-cake-line';
  }

  return (
    <div className="w-full select-none">
      <Menu as="div" className="relative inline-block text-left z-20 w-full">
        <div>
          <Menu.Button className="flex items-center justify-left w-full rounded-md border border-sky-700 shadow-sm px-4 py-2 bg-sky-700 text-sm font-medium text-white hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
            <i className={`text-sky-100 ${icon} ri-lg mr-3`} />
            <span className="flex-grow text-left capitalize ">{sectionName}</span>
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
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'terms' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('terms')}
                >
                  <i className="ri-price-tag-3-line ri-lg text-slate-400 pr-2" />
                  Modifiers
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'filters' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('filters')}
                >
                  <i className="ri-filter-line ri-lg text-slate-400 pr-2" />
                  Filters & Search
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'groups' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('groups')}
                >
                  <i className="ri-stack-line ri-lg text-slate-400 pr-2" />
                  Groups
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'ranking' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('ranking')}
                >
                  <i className="ri-line-chart-line ri-lg text-slate-400 pr-2" />
                  Ranking Check
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'clusters' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('clusters')}
                >
                  <i className="ri-mind-map ri-lg text-slate-400 pr-2" />
                  SERP Clusters
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'semantic-clusters' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('semantic-clusters')}
                >
                  <i className="ri-mind-map ri-lg text-slate-400 pr-2" />
                  Semantic Clusters
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'domains' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('domains')}
                >
                  <i className="ri-globe-line ri-lg text-slate-400 pr-2" />
                  Domains
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'competitors' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('competitors')}
                >
                  <i className="ri-computer-line ri-lg text-slate-400 pr-2" />
                  Competitors
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'ew-patterns' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('ew-patterns')}
                >
                  <i className="ri-flask-line ri-lg text-slate-400 pr-2" />
                  Custom EasyWins Patterns
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'pills' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('pills')}
                >
                  <i className="ri-lightbulb-line ri-lg text-slate-400 pr-2" />
                  Ideas
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'verbs' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('verbs')}
                >
                  <i className="ri-sword-line ri-lg text-slate-400 pr-2" />
                  Verbs
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'intent' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('intent')}
                >
                  <i className="ri-map-pin-user-fill ri-lg text-slate-400 pr-2" />
                  Intent
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'value' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('value')}
                >
                  <i className="ri-money-dollar-box-line ri-lg text-slate-400 pr-2" />
                  Keywords $ Value
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'add-keywords' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('add-keywords')}
                >
                  <i className="ri-add-line ri-lg text-slate-400 pr-2" />
                  Add Keywords
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'recipes' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('recipes')}
                >
                  <i className="ri-cake-line ri-lg text-slate-400 pr-2" />
                  Recipes
                </div>
              </Menu.Item>
              <Menu.Item>
                <div
                  className={classNames(
                    section === 'help' ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                    'group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-blue-100',
                  )}
                  onClick={() => setSection('help')}
                >
                  <i className="ri-book-line ri-lg text-slate-400 pr-2" />
                  Help
                </div>
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default DropdownSections;
