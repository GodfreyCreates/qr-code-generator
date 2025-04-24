import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Trash2, Clock, ExternalLink } from 'lucide-react';
import { HistoryItem } from '../types/qrcode';
import { deleteFromHistory, clearHistory } from '../utils/historyUtils';
import toast from 'react-hot-toast';

interface QRCodeHistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const QRCodeHistory: React.FC<QRCodeHistoryProps> = ({ history, onSelect }) => {
  const [items, setItems] = React.useState<HistoryItem[]>(history);

  const handleDelete = (id: string) => {
    const updatedHistory = deleteFromHistory(id);
    setItems(updatedHistory);
    toast.success('QR code removed from history');
  };

  const handleClearAll = () => {
    clearHistory();
    setItems([]);
    toast.success('History cleared');
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
          <Clock size={24} className="text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No history yet</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
          Your saved QR codes will appear here. Generate and save a QR code to see it in your history.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Your QR Code History
        </h3>
        <button
          onClick={handleClearAll}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-error-600 dark:hover:text-error-400 transition"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div 
            key={item.id} 
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition group"
          >
            <div 
              className="p-4 flex justify-center items-center"
              style={{ backgroundColor: item.bgColor }}
            >
              <QRCodeCanvas
                value={item.value}
                size={120}
                bgColor={item.bgColor}
                fgColor={item.fgColor}
                level={item.level as 'L' | 'M' | 'Q' | 'H'}
                includeMargin={item.includeMargin}
                imageSettings={item.imageSettings}
              />
            </div>
            
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="mb-2 flex-1 overflow-hidden">
                <div className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onSelect(item)}
                  className="flex-1 px-3 py-1.5 text-xs font-medium bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded hover:bg-primary-100 dark:hover:bg-primary-800 transition"
                >
                  Load
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-error-600 dark:hover:text-error-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  aria-label="Delete QR code"
                >
                  <Trash2 size={16} />
                </button>
                {item.value.startsWith('http') && (
                  <a
                    href={item.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    aria-label="Open URL"
                  >
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QRCodeHistory;