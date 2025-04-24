import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'minimal' | 'buttons' | 'dropdown';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'minimal',
  className = ''
}) => {
  const { theme, setTheme, currentTheme } = useTheme();

  if (variant === 'minimal') {
    return (
      <button 
        onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${className}`}
        aria-label={`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {currentTheme === 'dark' ? (
          <Sun size={20} className="text-gray-700 dark:text-gray-300" />
        ) : (
          <Moon size={20} className="text-gray-700 dark:text-gray-300" />
        )}
      </button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative inline-block ${className}`}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-10 pr-3 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {theme === 'light' ? (
            <Sun size={16} className="text-gray-500 dark:text-gray-400" />
          ) : theme === 'dark' ? (
            <Moon size={16} className="text-gray-500 dark:text-gray-400" />
          ) : (
            <Laptop size={16} className="text-gray-500 dark:text-gray-400" />
          )}
        </div>
      </div>
    );
  }

  // Default: buttons variant
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg flex p-1 ${className}`}>
      <button
        onClick={() => setTheme('light')}
        className={`flex items-center justify-center p-2 rounded-md ${
          theme === 'light' 
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
        aria-label="Light mode"
      >
        <Sun size={16} />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex items-center justify-center p-2 rounded-md ${
          theme === 'dark' 
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
        aria-label="Dark mode"
      >
        <Moon size={16} />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={`flex items-center justify-center p-2 rounded-md ${
          theme === 'system' 
            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300' 
            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
        }`}
        aria-label="System preference"
      >
        <Laptop size={16} />
      </button>
    </div>
  );
};

export default ThemeToggle; 