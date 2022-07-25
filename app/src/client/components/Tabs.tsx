import React from 'react';
import { classNames } from '../utils';

interface Props {
  tabs: Array<{
    key: string;
    name: string;
    current: boolean;
    onClick: () => void;
  }>;
  currentTab: string;
}

const Tabs = ({ tabs, currentTab }: Props) => {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          value={currentTab}
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm rounded-md"
          onChange={(e) => {
            const selectedTab = tabs.find((tab) => tab.name === e.target.value);
            selectedTab?.onClick();
          }}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <div
                key={tab.key}
                onClick={tab.current ? undefined : tab.onClick}
                className={classNames(
                  tab.current
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer',
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm select-none',
                )}
                aria-current={tab.current ? 'page' : undefined}
              >
                {tab.name}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Tabs;
