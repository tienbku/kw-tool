import React from 'react';

interface Props {
  label: string;
  checked?: boolean;
  className?: string;
  onChange?: (b: boolean) => void;
}

const Checkbox = ({ label, className, onChange, checked }: Props) => {
  return (
    <div className="flex items-center">
      <div className={`${className} flex items-center h-5`}>
        <input
          type="checkbox"
          checked={checked || false}
          className="focus:ring-indigo-200 h-4 w-4 text-indigo-600 border-gray-300 rounded cursor-pointer"
          onChange={(e) => {
            if (onChange) {
              onChange(e.target.checked);
            }
          }}
        />
      </div>
      <div className="pl-2">{label}</div>
    </div>
  );
};

export default Checkbox;
