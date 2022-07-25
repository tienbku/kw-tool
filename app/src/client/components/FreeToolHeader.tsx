import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import logo from '../../assets/logo.png';

interface Props {
  title: string;
}

const FreeToolHeader = ({ title }: Props) => {
  return (
    <div className="pt-10 mb-5 flex items-center justify-center select-none">
      <a href="/" title="SEO Ruler Tools" className="flex items-center justify-center">
        <img className="w-10" src={logo} alt="SEO Ruler Tools" />
        <span className="text-2xl text-slate-700 font-bold ml-2">
          {title} <span className="text-sm text-slate-500 font-medium">By SEO Ruler</span>
        </span>
      </a>
    </div>
  );
};

export default FreeToolHeader;
