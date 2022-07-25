import React from 'react';
import InputWithIcon from '../../../components/InputWithIcon';
import { formatNumber } from '../../../utils';

interface Props {
  cpc: number;
  volume: number;
  keywordsCount: number;
}

const Value = ({ cpc, volume, keywordsCount }: Props) => {
  const [ctr, setCtr] = React.useState(0.37);
  return (
    <div className="bg-white rounded shadow mb-3">
      <div className="py-3 px-3 select-none">
        <div className="text-sky-600">
          <i className="fa-solid fa-circle-question" />
          <span className="text-slate-500 text-xs pl-2">Calculate current keywords value by adjusting CTR</span>
        </div>
      </div>
      <div>
        <div className="px-3 pb-1.5 pt-1 select-none">
          <div className="text-slate-700 font-medium mb-1">CTR</div>
          <InputWithIcon
            min={1}
            step={0.01}
            value={ctr}
            type="number"
            placeholder="CTR"
            className="w-full mb-2"
            label="Search Keywords"
            onChange={(s) => setCtr(parseFloat(s))}
          />
        </div>
        <div className="px-3 pb-2 flex items-center">
          <div className="text-slate-600 text-lg font-medium flex-grow">Current Keywords</div>
          <div className="text-slate-600 text-lg font-medium ml-3">{formatNumber(keywordsCount)}</div>
        </div>
        <div className="px-3 pb-2 flex items-center">
          <div className="text-slate-600 text-lg font-medium flex-grow">Volume</div>
          <div className="text-slate-600 text-lg font-medium ml-3">{formatNumber(volume)}</div>
        </div>
        <div className="px-3 pb-2 flex items-center">
          <div className="text-slate-600 text-lg font-medium flex-grow">CPC</div>
          <div className="text-slate-600 text-lg font-medium ml-3">${formatNumber(parseFloat(cpc.toFixed(2)))}</div>
        </div>
        <div className="px-3 pb-2 flex items-center">
          <div className="text-slate-600 text-lg font-medium flex-grow">Calculation</div>
          <div className="text-lg text-sky-600 text-right">Volume * CTR * CPC</div>
        </div>
        <div className="px-3 pb-2 flex items-center">
          <div className="text-slate-700 text-lg font-bold flex-grow">$ Value</div>
          <div className="text-lime-700 text-lg font-medium ml-3">${formatNumber(parseFloat((volume * ctr * cpc).toFixed(2)))}</div>
        </div>
      </div>
    </div>
  );
};

export default Value;
