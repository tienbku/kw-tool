import React, { Fragment } from 'react';
import Checkbox from '../../../components/Checkbox';
import { Menu, Transition } from '@headlessui/react';
import { IDiscoveryKeywordsSort } from '../../../../types/IDiscoveryKeywordsSort';

interface Props {
  sort: IDiscoveryKeywordsSort;
  setSort: (sort: IDiscoveryKeywordsSort) => void;
}

interface ItemProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

const Item = ({ active, onClick, label }: ItemProps) => {
  return (
    <Menu.Item>
      <div className="text-slate-800 group flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100" onClick={onClick}>
        <Checkbox checked={active} label={label} />
      </div>
    </Menu.Item>
  );
};

const DropdownSort = ({ sort, setSort }: Props) => {
  let label = '';
  if (sort === 'ew') {
    label = 'Easy Win Score';
  } else if (sort === 'volume') {
    label = 'Volume';
  } else if (sort === 'ranking') {
    label = 'Ranking';
  }

  return (
    <div className="mr-3 w-56">
      <Menu as="div" className="relative inline-block text-left z-10 w-full">
        <div>
          <Menu.Button className="flex items-center justify-left w-full rounded-md border border-slate-200 shadow-sm px-4 pb-1 pt-1.5 bg-white text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
            <div className="flex-grow text-left">
              <i className={`text-slate-400 fa-solid fa-arrow-down-wide-short fa-lg mr-3`} />
              Sort {label}
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
              <Item label="Sort by Volume" active={sort === 'volume'} onClick={() => setSort('volume')} />
              <Item label="Sort by Easy Win Score" active={sort === 'ew'} onClick={() => setSort('ew')} />
              <Item label="Sort by Ranking" active={sort === 'ranking'} onClick={() => setSort('ranking')} />
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
};

export default DropdownSort;
