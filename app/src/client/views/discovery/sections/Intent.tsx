import React from 'react';
import { useRecoilState } from 'recoil';
import { AtomDiscoveryControl } from '../atoms/AtomDiscoveryControl';

const Intent = () => {
  const [control, setControl] = useRecoilState(AtomDiscoveryControl);
  const current = control.intent;
  const setSearch = (s: string) => {
    if (current === s) {
      setControl((prev) => ({ ...prev, intent: '' }));
    } else {
      setControl((prev) => ({ ...prev, intent: s }));
    }
  };

  return (
    <div className="bg-white rounded shadow mb-3 select-none">
      <div className="py-3 px-3 select-none">
        <div className="text-sky-600">
          <i className="fa-solid fa-circle-question" />
          <span className="text-slate-500 text-xs pl-2">Filter by search intent</span>
        </div>
      </div>
      <div>
        <div
          onClick={() => setSearch('informational')}
          className={`border-0 border-t border-slate-200 py-1 ${
            current === 'informational' ? 'bg-lime-50 font-semibold hover:bg-red-50' : 'hover:bg-slate-50'
          } cursor-pointer`}
        >
          <div className="flex items-center px-3">
            <div className="flex-grow flex items-center">Informational</div>
            <div className="text-xs text-slate-500">Looking for information</div>
          </div>
        </div>
        <div
          onClick={() => setSearch('transactional')}
          className={`border-0 border-t border-slate-200 py-1 ${
            current === 'transactional' ? 'bg-lime-50 font-semibold hover:bg-red-50' : 'hover:bg-slate-50'
          } cursor-pointer`}
        >
          <div className="flex items-center px-3">
            <div className="flex-grow flex items-center">Transactional</div>
            <div className="text-xs text-slate-500">Ready to purchase</div>
          </div>
        </div>
        <div
          onClick={() => setSearch('commercial')}
          className={`border-0 border-t border-slate-200 py-1 ${
            current === 'commercial' ? 'bg-lime-50 font-semibold hover:bg-red-50' : 'hover:bg-slate-50'
          } cursor-pointer`}
        >
          <div className="flex items-center px-3">
            <div className="flex-grow flex items-center">Commercial</div>
            <div className="text-xs text-slate-500">Considering a purchase</div>
          </div>
        </div>
        <div
          onClick={() => setSearch('navigational')}
          className={`border-0 border-t border-slate-200 py-1 ${
            current === 'navigational' ? 'bg-lime-50 font-semibold hover:bg-red-50' : 'hover:bg-slate-50'
          } cursor-pointer`}
        >
          <div className="flex items-center px-3">
            <div className="flex-grow flex items-center">Navigational</div>
            <div className="text-xs text-slate-500">Searching for a brand, page, etc.</div>
          </div>
        </div>
        <div
          onClick={() => setSearch('unknown')}
          className={`border-0 border-t border-slate-200 py-1 ${
            current === 'unknown' ? 'bg-lime-50 font-semibold hover:bg-red-50' : 'hover:bg-slate-50'
          } cursor-pointer`}
        >
          <div className="flex items-center px-3">
            <div className="flex-grow flex items-center">Unknown</div>
            <div className="text-xs text-slate-500">Not detected</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intent;
