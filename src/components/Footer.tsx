import React from 'react';
import ThemeToggle from './ThemeToggle';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-6 border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm dark:text-gray-400">
            © {new Date().getFullYear()} Modern QR Generator. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <ThemeToggle variant="dropdown" />
            <div className="flex gap-6">
              <a 
                href="#" 
                className="text-gray-600 hover:text-gray-900 text-sm transition dark:text-gray-400 dark:hover:text-white"
              >
                Privacy Policy
              </a>
              <a 
                href="#" 
                className="text-gray-600 hover:text-gray-900 text-sm transition dark:text-gray-400 dark:hover:text-white"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;