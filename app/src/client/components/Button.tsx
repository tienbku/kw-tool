import React from 'react';

interface Props {
  text: string;
  icon?: string;
  color?: string;
  small?: boolean;
  smaller?: boolean;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
}

const Button = ({ text, disabled, className, onClick, icon, color, small, smaller }: Props) => {
  let col = color ? color : 'text-white bg-indigo-600 hover:bg-indigo-700';
  if (disabled) {
    col = 'text-slate-400 bg-slate-300 hover:bg-slate-300';
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      className={`inline-flex items-center select-none shadow ${
        small ? 'px-3 py-1 text-sm' : smaller ? 'px-2 py-1 uppercase text-xs' : 'px-4 py-2 text-sm'
      } border border-transparent font-medium rounded-md shadow-sm ${col} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
    >
      {icon && <i className={`${icon} pr-2`} />} {text}
    </button>
  );
};

export default Button;
