import React from 'react';

interface ItemProps {
  url: string;
  title: string;
}

const Item = ({ title, url }: ItemProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block py-2 px-3 text-sky-700 hover:text-sky-800 font-medium hover:bg-sky-50"
    >
      <i className="ri-youtube-line mr-2" />
      {title}
    </a>
  );
};

const Help = () => {
  return (
    <div className="bg-white pt-3 pb-1 rounded shadow select-none">
      <div className="text-sky-600 pl-3">
        <i className="ri-question-line" />
        <span className="text-slate-500 text-xs pl-2">Learn how to use the KW tool</span>
      </div>
      <div className="block border-t border-slate-200 mt-2 pt-1 cursor-pointer">Nothing here yet...</div>
    </div>
  );
};

export default Help;
