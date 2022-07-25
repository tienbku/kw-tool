import React from 'react';

interface CheckProps {
  label: string;
}

const Radio = ({ label }: CheckProps) => {
  return (
    <div className="flex items-center">
      <input type="radio" className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300" />
      <label htmlFor="push-everything" className="ml-3 block text-sm font-medium text-gray-700">
        {label}
      </label>
    </div>
  );
};

export default Radio;
