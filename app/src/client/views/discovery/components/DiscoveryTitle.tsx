import React from 'react';

interface Props {
  name: string;
  loading: boolean;
}

const DiscoveryTitle = ({ name, loading }: Props) => {
  return (
    <div className="flex items-center justify-start mb-2">
      <h1 className={`text-2xl ${loading ? 'text-orange-700' : 'text-slate-600'} inter font-semibold select-none my-0`}>
        {name}
        {loading ? (
          <span className="text-orange-700 pl-3">
            <i className="ri-refresh-line ri-lg" />
          </span>
        ) : undefined}
      </h1>
    </div>
  );
};

export default DiscoveryTitle;
