import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserSettings } from '../types/user';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  currentTheme: 'light' | 'dark'; // The actual applied theme (after system preference)
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  currentTheme: 'light',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeType>('system'); // Default to system
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const { user } = useAuth();

  // Initialize theme from user preferences or localStorage
  useEffect(() => {
    const initTheme = () => {
      // Priority 1: User settings from Supabase
      if (user?.user_metadata?.settings) {
        const userSettings = user.user_metadata.settings as UserSettings;
        if (userSettings.theme) {
          setTheme(userSettings.theme);
          return userSettings.theme;
        }
      }
      
      // Priority 2: localStorage
      const savedTheme = localStorage.getItem('theme') as ThemeType | null;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setTheme(savedTheme);
        return savedTheme;
      }
      
      // Priority 3: Default to 'system'
      return 'system';
    };

    const initialTheme = initTheme();
    
    // Apply initial theme immediately
    if (initialTheme === 'system') {
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setCurrentTheme(systemPreference);
    } else {
      setCurrentTheme(initialTheme as 'light' | 'dark');
    }
  }, [user]);

  // Apply theme changes
  useEffect(() => {
    // Save to localStorage for non-authenticated users
    localStorage.setItem('theme', theme);
    
    // Calculate actual theme to apply
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setCurrentTheme(systemTheme);
    } else {
      setCurrentTheme(theme);
    }
  }, [theme]);

  // Apply dark mode to HTML element
  useEffect(() => {
    const html = document.documentElement;
    
    if (currentTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    
    // Force a repaint by temporarily adding and removing a class
    html.classList.add('theme-transitioning');
    setTimeout(() => {
      html.classList.remove('theme-transitioning');
    }, 100);
    
  }, [currentTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        setCurrentTheme(mediaQuery.matches ? 'dark' : 'light');
      }
    };
    
    // Modern approach to add event listener
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext; 