import React from 'react';

interface Props {
  min?: number;
  step?: number;
  label: string;
  icon?: string;
  small?: boolean;
  className?: string;
  placeholder: string;
  defaultValue?: string;
  value?: string | number;
  type?: 'number' | 'text';
  onChange: (s: string) => void;
}

const InputWithIcon = ({ type, small, step, min, defaultValue, value, className, label, placeholder, onChange, icon }: Props) => {
  return (
    <div
      className={`w-full bg-white relative border border-gray-300 rounded-md ${
        small ? 'px-2 py-1' : 'px-3 py-2'
      } shadow-sm focus-within:ring-1 focus-within:ring-sky-600 focus-within:border-sky-600 ${className}`}
    >
      <label className="sr-only">{label}</label>
      <div className="relative flex items-center">
        <input
          value={value}
          placeholder={placeholder}
          defaultValue={defaultValue}
          type={type ? type : 'text'}
          min={min !== undefined ? min : undefined}
          step={step !== undefined ? step : undefined}
          className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
          onChange={(e) => {
            if (!e.target.value) {
              onChange('');
            } else {
              onChange(e.target.value);
            }
          }}
        />
        {icon ? (
          <div className="absolute inset-y-0 right-0 flex pr-1">
            <div className="inline-flex items-center text-sm font-sans font-medium text-gray-300">
              <i className={icon} />
            </div>
          </div>
        ) : undefined}
      </div>
    </div>
  );
};

export default InputWithIcon;
