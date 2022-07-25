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
    icon = 'fa-tag';
  } else if (section === 'pills') {
    sectionName = 'Ideas';
    icon = 'fa-lightbulb';
  } else if (section === 'clusters') {
    sectionName = 'SERP Clusters';
    icon = 'fa-sitemap';
  } else if (section === 'semantic-clusters') {
    sectionName = 'Semantic Clusters';
    icon = 'fa-signal-bars-good';
  } else if (section === 'domains') {
    icon = 'fa-globe';
  } else if (section === 'verbs') {
    icon = 'fa-bolt';
  } else if (section === 'intent') {
    icon = 'fa-bolt';
  } else if (section === 'groups') {
    icon = 'fa-layer-group';
  } else if (section === 'value') {
    sectionName = 'Keywords $ Value';
    icon = 'fa-dollar';
  } else if (section === 'filters') {
    sectionName = 'Filters & Search';
    icon = 'fa-filter';
  } else if (section === 'ew-patterns') {
    sectionName = 'Custom EasyWins Patterns';
    icon = 'fa-magic';
  } else if (section === 'competitors') {
    icon = 'fa-chart-bar';
  } else if (section === 'ranking') {
    sectionName = 'Ranking Check';
    icon = 'fa-chart-line-up';
  } else if (section === 'help') {
    icon = 'fa-book';
  } else if (section === 'add-keywords') {
    sectionName = 'Add Keywords';
    icon = 'fa-plus';
  } else if (section === 'recipes') {
    icon = 'fa-utensils';
  }

  return (
    <div className="w-full select-none">
      <Menu as="div" className="relative inline-block text-left z-20 w-full">
        <div>
          <Menu.Button className="flex items-center justify-left w-full rounded-md border border-sky-700 shadow-sm px-4 py-2 bg-sky-700 text-sm font-medium text-white hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
            <div className="flex-grow text-left capitalize">
              <i className={`text-sky-100 fa-solid ${icon} fa-lg mr-3`} />
              {sectionName}
            </div>
            <div>
              <i className="fa-solid fa-chevron-down" />
            </div>
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
                  <i className="fa-solid fa-tag text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-filter text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-layer-group text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-chart-line-up text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-sitemap text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-signal-bars-good text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-globe text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-chart-bar text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-magic text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-lightbulb text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-bolt text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-bolt text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-dollar text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-plus text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-utensils text-slate-400 pr-2" />
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
                  <i className="fa-solid fa-book text-slate-400 pr-2" />
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
