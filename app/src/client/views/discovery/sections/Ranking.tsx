import { useRecoilState } from 'recoil';
import React, { useState } from 'react';
import Button from '../../../components/Button';
import InputWithIcon from '../../../components/InputWithIcon';
import { AtomDiscoveryControl } from '../atoms/AtomDiscoveryControl';

const Ranking = () => {
  const [control, setControl] = useRecoilState(AtomDiscoveryControl);
  const [localRanking, setLocalRanking] = useState(control.ranking);

  return (
    <div className="bg-white pt-3 px-3 pb-1 rounded shadow select-none">
      <div className="text-sky-600 flex items-center">
        <i className="ri-question-line" />
        <span className="text-slate-500 text-xs pl-2">Quickly check your rankings</span>
      </div>
      <div className="py-2">
        <InputWithIcon
          value={localRanking}
          label="Ranking Check"
          className="w-full mb-3"
          icon="fa-chart-line-up"
          placeholder="Ranking Check"
          onChange={(e) => setLocalRanking(e)}
        />
        <Button
          text="Apply"
          className="mr-2"
          color="text-white bg-sky-600 hover:bg-sky-500"
          onClick={() => {
            setControl((prev) => ({ ...prev, ranking: localRanking, sort: 'ranking', itemOffset: 0 }));
          }}
        />
        <Button
          text="Clear"
          color={`text-white ${control.ranking !== '' ? 'bg-red-400' : 'bg-slate-400'} hover:bg-red-400`}
          onClick={() => {
            setLocalRanking('');
            setControl((prev) => ({ ...prev, ranking: '', sort: 'ew', itemOffset: 0 }));
          }}
        />
      </div>
    </div>
  );
};

export default Ranking;
