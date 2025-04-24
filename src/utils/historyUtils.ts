import { HistoryItem } from '../types/qrcode';

const STORAGE_KEY = 'qrcode-history';

export const getHistoryFromStorage = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load history from localStorage:', error);
    return [];
  }
};

export const saveToHistory = (item: HistoryItem): HistoryItem[] => {
  try {
    const history = getHistoryFromStorage();
    
    // Check if the same value already exists
    const existingIndex = history.findIndex(i => i.value === item.value);
    
    if (existingIndex !== -1) {
      // Update existing item instead of creating a new one
      history[existingIndex] = item;
    } else {
      // Add new item (keeping most recent first)
      history.unshift(item);
    }
    
    // Limit history to 20 items
    const limitedHistory = history.slice(0, 20);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
    return limitedHistory;
  } catch (error) {
    console.error('Failed to save history to localStorage:', error);
    return getHistoryFromStorage();
  }
};

export const deleteFromHistory = (id: string): HistoryItem[] => {
  try {
    const history = getHistoryFromStorage();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
  } catch (error) {
    console.error('Failed to delete item from history:', error);
    return getHistoryFromStorage();
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};