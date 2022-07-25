import Button from '../../../components/Button';
import React, { useEffect, useState } from 'react';

interface Props {
  hasRunningTasks: boolean;
  competitorPatterns: string[];
  doUpdateCompetitors: (competitors: string[]) => void;
}

const UpdateCompetitors = ({ hasRunningTasks, competitorPatterns, doUpdateCompetitors }: Props) => {
  const [error, setError] = useState('');
  const [canSubmit, setCanSubmit] = useState(false);
  const [tmpDisabled, setTmpDisabled] = useState(false);
  const [competitors, setCompetitors] = React.useState(competitorPatterns.join('\n'));

  useEffect(() => {
    let errorMsg = '';

    if (competitors.includes(',')) {
      errorMsg = 'Competitors cannot contain commas';
    }

    setError(errorMsg);
    setCanSubmit(errorMsg === '');
  }, [competitors]);

  useEffect(() => {
    if (tmpDisabled) {
      setTimeout(() => {
        setTmpDisabled(false);
      }, 5000);
    }
  }, [tmpDisabled]);

  return (
    <div className="bg-white rounded shadow mb-3 select-none">
      <div className="pt-3 px-3">
        <div className="text-sky-600">
          <i className="fa-solid fa-circle-question" />
          <span className="text-slate-500 text-xs pl-2">Update your competitors list</span>
        </div>
      </div>
      <div>
        <div className="px-2 pb-3">
          <div className="text-base font-medium text-slate-600 mt-3 mb-1">Competitors</div>
          <textarea
            rows={5}
            value={competitors}
            disabled={hasRunningTasks}
            onChange={(e) => setCompetitors(e.target.value || '')}
            className={`w-full shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm border border-gray-300 ${
              hasRunningTasks ? 'bg-slate-50' : ''
            } rounded-md`}
          />
          <div className="text-xs text-slate-600 mb-1.5">One domain or pattern per line</div>
          {error && <div className="px-3 py-2 rounded bg-red-100 text-red-800 text-sm mt-2">{error}</div>}
          <Button
            className="mt-2"
            text="Update Competitors"
            color="text-white bg-lime-600 hover:bg-lime-700"
            disabled={hasRunningTasks || !canSubmit || tmpDisabled}
            onClick={() => {
              if (!hasRunningTasks && canSubmit) {
                doUpdateCompetitors(
                  competitors
                    .split('\n')
                    .map((c) => c.trim())
                    .filter((c) => c.length > 0),
                );
                setTmpDisabled(true);
              }
            }}
          />
          <Button
            text="Reset"
            className="ml-2"
            disabled={hasRunningTasks || tmpDisabled}
            color={`text-white ${competitors ? 'bg-red-500' : 'bg-slate-400'} hover:bg-red-400`}
            onClick={() => {
              doUpdateCompetitors([]);
              setCompetitors('');
              setCanSubmit(true);
              setTmpDisabled(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateCompetitors;
