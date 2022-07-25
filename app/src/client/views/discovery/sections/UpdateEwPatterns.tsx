import Button from '../../../components/Button';
import React, { useEffect, useState } from 'react';
import Checkbox from '../../../components/Checkbox';

interface Props {
  hasRunningTasks: boolean;
  ewDefaults: boolean;
  ewPatterns: string[];
  doUpdateEwPatterns: (patterns: string[], defaults: boolean) => void;
}

const UpdateEwPatterns = ({ hasRunningTasks, ewPatterns, ewDefaults, doUpdateEwPatterns }: Props) => {
  const [error, setError] = useState('');
  const [defaults, setDefaults] = React.useState(ewDefaults);
  const [canSubmit, setCanSubmit] = useState(false);
  const [tmpDisabled, setTmpDisabled] = useState(false);
  const [patterns, setPatterns] = React.useState(ewPatterns.join('\n'));

  useEffect(() => {
    let errorMsg = '';

    if (patterns.includes(',')) {
      errorMsg = 'Patterns cannot contain commas';
    }

    setError(errorMsg);
    setCanSubmit(errorMsg === '');
  }, [patterns]);

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
        <div className="text-sky-600 flex items-center">
          <i className="ri-question-line" />
          <span className="text-slate-500 text-xs pl-2">Update your EasyWin patterns, matched in URLs</span>
        </div>
      </div>
      <div>
        <div className="px-2 pb-3">
          <div className="text-base font-medium text-slate-600 mt-3 mb-1">EW Patterns</div>
          <textarea
            rows={5}
            value={patterns}
            disabled={hasRunningTasks}
            onChange={(e) => setPatterns(e.target.value || '')}
            className={`w-full shadow-sm focus:ring-sky-500 focus:border-sky-500 sm:text-sm border border-gray-300 ${
              hasRunningTasks ? 'bg-slate-50' : ''
            } rounded-md`}
          />
          <div className="text-xs text-slate-600 mb-1.5">One pattern per line</div>
          <div className="text-base font-medium text-slate-600 mt-3 mb-1">Include SEO Ruler EW patterns</div>
          <Checkbox label="Include defaults" checked={defaults} onChange={(e) => setDefaults(e)} />
          {error && <div className="px-3 py-2 rounded bg-red-100 text-red-800 text-sm mt-2">{error}</div>}
          <Button
            className="mt-2"
            text="Update EW patterns"
            color="text-white bg-lime-600 hover:bg-lime-700"
            disabled={hasRunningTasks || !canSubmit || tmpDisabled}
            onClick={() => {
              if (!hasRunningTasks && canSubmit) {
                doUpdateEwPatterns(
                  patterns
                    .split('\n')
                    .map((c) => c.trim())
                    .filter((c) => c.length > 0),
                  defaults,
                );
                setTmpDisabled(true);
              }
            }}
          />
          <Button
            text="Reset"
            className="ml-2"
            disabled={hasRunningTasks || tmpDisabled}
            color={`text-white ${patterns ? 'bg-red-500' : 'bg-slate-400'} hover:bg-red-400 ml-2`}
            onClick={() => {
              doUpdateEwPatterns([], defaults);
              setPatterns('');
              setCanSubmit(true);
              setTmpDisabled(true);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UpdateEwPatterns;
