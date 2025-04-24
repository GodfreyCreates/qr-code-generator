import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorLevelSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const ErrorLevelSelect: React.FC<ErrorLevelSelectProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label htmlFor="errorLevel" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Error Correction Level
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <AlertTriangle size={18} className="text-gray-400 dark:text-gray-500" />
        </div>
        <select
          id="errorLevel"
          value={value}
          onChange={handleChange}
          className="select-field pl-10 pr-10 py-2"
        >
          <option value="L">Low (7%)</option>
          <option value="M">Medium (15%)</option>
          <option value="Q">Quartile (25%)</option>
          <option value="H">High (30%)</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Higher correction levels make QR codes more reliable but increase complexity.
      </p>
    </div>
  );
};