import { uniq } from 'lodash';
import TermItem from '../components/TermItem';
import React, { Fragment, useMemo } from 'react';
import { QUESTIONS } from '../../../../shared/text';
import { getWordBoundaryRegex } from '../../../../shared/regex';
import { IDiscoveryTerm } from '../../../../types/IDiscoveryTerm';
import { IDiscoveryItemOutput } from '../../../../api/discovery/input/inputGetDiscoveryItems';
import { AtomDiscoveryControl } from '../atoms/AtomDiscoveryControl';
import { useRecoilState } from 'recoil';

interface Props {
  isLoading: boolean;
  terms: IDiscoveryTerm[] | undefined;
  items: Pick<IDiscoveryItemOutput, 'keyword'>[];
}

const MODIFIERS: string[] = uniq([
  'how to',
  ...QUESTIONS,
  'with',
  'without',
  'for',
  'of',
  'tips',
  'service',
  'free',
  'buy',
  'pricing',
  'cheap',
  'price',
  'under',
  'discount',
  'cheapest',
  'affordable',
  'deals',
  'sale',
  'offers',
  'promo',
  'coupon',
  'find',
  'top',
  'best',
  'review',
  'list',
  'pros',
  'cons',
  'latest',
  'popular',
  'and',
  'like',
  'or',
  'vs',
  'versus',
  'alternative',
  'in',
  'near',
  'nearest',
  '2022',
]);

const Terms = ({ isLoading, items, terms }: Props) => {
  const [control, setControl] = useRecoilState(AtomDiscoveryControl);
  const [current, setCurrent] = React.useState('');

  const foundModifiers = useMemo(() => {
    const found: string[] = [];
    for (const mod of MODIFIERS) {
      const reg = getWordBoundaryRegex(mod);
      for (const item of items) {
        if (reg.test(item.keyword)) {
          found.push(mod);
          break;
        }
      }
    }
    return uniq(found);
  }, [items]);

  return (
    <div className="bg-white rounded shadow mb-3 select-none">
      <div className="pt-3 pb-2 px-3">
        <div className="text-sky-600 flex items-center">
          <i className="ri-circle-line" />
          <span className="text-slate-500 text-xs pl-2">Discover modifiers, then use them to expand your list.</span>
        </div>
      </div>
      {foundModifiers.length > 0 && (
        <div className="grid grid-cols-5 gap-1 items-center px-2 pb-2">
          {foundModifiers.map((mod, i) => {
            return (
              <div
                key={`${mod}-${i}`}
                className={`px-2 pt-2 pb-1.5 inline-flex items-center leading-none rounded ${
                  control.search === mod
                    ? 'bg-purple-600 hover:bg-slate-700 text-white'
                    : 'bg-purple-100 hover:bg-lime-200 hover:text-lime-700 text-purple-600'
                } text-[10px] font-semibold uppercase tracking-wide cursor-pointer`}
                onClick={() => {
                  if (control.search !== mod) {
                    setControl((prev) => ({ ...prev, search: mod, exactSearch: true, itemOffset: 0 }));
                  } else {
                    setControl((prev) => ({ ...prev, search: '', exactSearch: false, itemOffset: 0 }));
                  }
                }}
              >
                {mod}
              </div>
            );
          })}
        </div>
      )}
      <ul>
        {!terms || (terms.length === 0 && <li className="text-center text-gray-600 pb-2">No modifiers yet</li>)}
        {isLoading && (
          <li className="text-center text-gray-600 pb-2 flex items-center">
            <i className="ri-refresh-line" />
          </li>
        )}
        {!isLoading &&
          terms !== undefined &&
          terms.length > 0 &&
          terms.map((term, i) => {
            const cleanTerm = term.term.replace(/_/g, ' ');
            const isCurrent = current === cleanTerm;
            const isSearch = control.search === cleanTerm;

            return (
              <Fragment key={`${term}-${i}`}>
                <TermItem
                  term={term.term}
                  open={isCurrent}
                  count={term.count}
                  isCurrent={isSearch}
                  parent={term.children.length > 0}
                  isOther={term.term === '_others'}
                  onSearch={() => {
                    if (isSearch) {
                      setControl((prev) => ({ ...prev, search: '', exactSearch: false, itemOffset: 0 }));
                    } else {
                      setControl((prev) => ({ ...prev, search: cleanTerm, exactSearch: true, itemOffset: 0 }));
                    }
                  }}
                  onClick={() => {
                    if (isCurrent) {
                      setCurrent('');
                    } else {
                      setCurrent(cleanTerm);
                    }
                  }}
                />
                {isCurrent &&
                  term.children.map((child, j) => {
                    const cleanTerm = child.term.replace(/_/g, ' ');
                    const isSearch = control.search === cleanTerm;
                    return (
                      <TermItem
                        term={cleanTerm}
                        count={child.count}
                        isCurrent={isSearch}
                        key={`${child}-${j}`}
                        onSearch={() => {
                          if (isSearch) {
                            setControl((prev) => ({ ...prev, search: '', exactSearch: false, itemOffset: 0 }));
                          } else {
                            setControl((prev) => ({ ...prev, search: cleanTerm, exactSearch: true, itemOffset: 0 }));
                          }
                        }}
                      />
                    );
                  })}
              </Fragment>
            );
          })}
      </ul>
    </div>
  );
};

export default Terms;
