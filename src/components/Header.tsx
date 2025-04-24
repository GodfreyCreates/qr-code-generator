import React, { useState } from 'react';
import { QrCode, Github, LogOut, ChevronDown, User, History } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { Link, NavLink } from 'react-router-dom';
import UserAvatar from './UserAvatar';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-10 dark:bg-gray-900/90 dark:border-b dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <QrCode size={24} className="text-primary-500" />
            <Link to="/" className="font-semibold text-lg text-gray-900 dark:text-white">
              QR Generator
            </Link>
            
            {/* Navigation Links for Authenticated Users */}
            {user && (
              <nav className="hidden md:flex items-center ml-8 space-x-6">
                <NavLink 
                  to="/app" 
                  className={({ isActive }) => 
                    `text-sm font-medium ${isActive 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    } transition`
                  }
                >
                  QR Code Generator
                </NavLink>
                <NavLink 
                  to="/app?tab=history" 
                  className={({ isActive }) => 
                    `flex items-center gap-1 text-sm font-medium ${isActive 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
                    } transition`
                  }
                >
                  <History size={16} />
                  <span>History</span>
                </NavLink>
              </nav>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle variant="minimal" />
            
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition dark:text-gray-400 dark:hover:text-white"
              aria-label="View on GitHub"
            >
              <Github size={20} />
              <span className="hidden md:inline">GitHub</span>
            </a>

            {user && (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none"
                >
                  <UserAvatar 
                    userId={user.id}
                    avatarUrl={user.user_metadata.avatar_url}
                    fullName={user.user_metadata.full_name}
                    size="sm"
                    className="border-2 border-primary-100"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.user_metadata.full_name || user.email?.split('@')[0]}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                      {user.email}
                    </p>
                  </div>
                  <ChevronDown size={16} className="text-gray-500 dark:text-gray-400" />
                </button>

                {isDropdownOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-20">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700 md:hidden">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.user_metadata.full_name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>

                      {/* Mobile Navigation Links */}
                      <div className="md:hidden border-b border-gray-100 dark:border-gray-700 py-1">
                        <Link
                          to="/app"
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <QrCode size={16} />
                          <span>QR Code Generator</span>
                        </Link>
                        <Link
                          to="/app?tab=history"
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <History size={16} />
                          <span>History</span>
                        </Link>
                      </div>

                      <Link
                        to="/profile"
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User size={16} />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;