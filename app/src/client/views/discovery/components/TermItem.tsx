import React, { Fragment } from 'react';

interface TermItemProps {
  term: string;
  count: number;
  open?: boolean;
  parent?: boolean;
  isOther?: boolean;
  isCurrent: boolean;
  onClick?: () => void;
  onSearch?: () => void;
}

const TermItem = ({ isOther, term, count, parent, open, onClick, onSearch, isCurrent }: TermItemProps) => {
  return (
    <li
      className={`flex items-center select-none border-0 border-t border-slate-200 py-1.5 ${parent ? 'pl-1.5 pr-3' : 'px-3'} ${
        open ? 'bg-sky-50' : parent ? 'bg-slate-50' : ''
      } text-sm`}
    >
      <div className={`flex-grow flex ${isOther ? '' : 'pr-3'}`}>
        <div className={`flex-grow flex items-center ${isCurrent ? 'font-semibold' : ''}`}>
          {parent ? (
            <Fragment>
              <i
                className={`ri-arrow-${open ? 'down' : 'right'}-s-line ri-lg text-gray-700 pr-2 hover:text-gray-800 cursor-pointer`}
                onClick={onClick}
              />
              {isOther ? 'others' : term}
            </Fragment>
          ) : (
            <span className="text-gray-600 pl-4">{term.replace(/_/g, ' ')}</span>
          )}
        </div>
        <span className={`text-purple-500 text-xs ${isOther ? '' : 'pl-2'}`}>{count}</span>
      </div>
      {!isOther && (
        <div className="flex items-center">
          <div className={`${isCurrent ? 'text-red-500' : 'text-gray-500'} hover:text-sky-600 cursor-pointer`} onClick={onSearch}>
            <i className="ri-search-line ri-lg text-sm" />
          </div>
        </div>
      )}
    </li>
  );
};

export default TermItem;
