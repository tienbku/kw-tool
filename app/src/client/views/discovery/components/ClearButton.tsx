import React from 'react';

const ClearButton = ({ onClear, label }: { onClear: () => void; label: string }) => {
  return (
    <div
      onClick={onClear}
      className="text-white bg-red-600 hover:bg-red-700 px-2 py-1.5 rounded font-semibold text-xs uppercase flex items-center leading-none cursor-pointer"
    >
      <i className="ri-close-line ri-lg" />
      <span className="pl-2">Clear {label}</span>
    </div>
  );
};

export default ClearButton;
