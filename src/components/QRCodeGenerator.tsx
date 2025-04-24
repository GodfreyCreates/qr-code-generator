import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import QRCodeDisplay from './QRCodeDisplay';
import QRCodeForm from './QRCodeForm';
import QRCodeHistory from './QRCodeHistory';
import { QRCodeConfig, HistoryItem } from '../types/qrcode';
import { saveToHistory, getHistoryFromStorage } from '../utils/historyUtils';

const QRCodeGenerator: React.FC = () => {
  const location = useLocation();
  const [qrConfig, setQrConfig] = useState<QRCodeConfig>({
    value: 'https://example.com',
    size: 200,
    bgColor: '#FFFFFF',
    fgColor: '#000000',
    level: 'L',
    includeMargin: true,
    imageSettings: undefined
  });
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = getHistoryFromStorage();
    setHistory(savedHistory);
    
    // Check for tab query parameter
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam === 'history') {
      setActiveTab('history');
    }
  }, [location.search]);

  const handleConfigChange = (newConfig: Partial<QRCodeConfig>) => {
    setQrConfig((prevConfig) => ({
      ...prevConfig,
      ...newConfig
    }));
  };

  const handleSaveToHistory = () => {
    if (qrConfig.value.trim() === '') return;
    
    const newHistory = saveToHistory({
      ...qrConfig,
      createdAt: new Date().toISOString(),
      id: Date.now().toString()
    });
    
    setHistory(newHistory);
  };

  const handleLoadFromHistory = (item: HistoryItem) => {
    setQrConfig({
      value: item.value,
      size: item.size,
      bgColor: item.bgColor,
      fgColor: item.fgColor,
      level: item.level,
      includeMargin: item.includeMargin,
      imageSettings: item.imageSettings
    });
    setActiveTab('generator');
  };

  return (
    <div className="card animate-fade-in">
      <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-4">
          <button
            className={`pb-3 px-1 font-medium text-sm ${
              activeTab === 'generator'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            } transition`}
            onClick={() => setActiveTab('generator')}
          >
            Generator
          </button>
          <button
            className={`pb-3 px-1 font-medium text-sm ${
              activeTab === 'history'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            } transition`}
            onClick={() => setActiveTab('history')}
          >
            History
            {history.length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                {history.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === 'generator' ? (
        <div className="grid md:grid-cols-2 gap-8">
          <QRCodeForm 
            config={qrConfig} 
            onConfigChange={handleConfigChange} 
            onSave={handleSaveToHistory}
          />
          <QRCodeDisplay config={qrConfig} />
        </div>
      ) : (
        <QRCodeHistory history={history} onSelect={handleLoadFromHistory} />
      )}
    </div>
  );
};

export default QRCodeGenerator;