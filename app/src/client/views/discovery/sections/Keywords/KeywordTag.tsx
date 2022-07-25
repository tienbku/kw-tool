import React from 'react';

const KeywordTag = ({ children, title, className }: React.PropsWithChildren & { title?: string; className?: string }) => {
  return (
    <div className={`select-none text-xs px-1.5 py-1 rounded ${className || ''}`} title={title}>
      {children}
    </div>
  );
};

export default KeywordTag;
