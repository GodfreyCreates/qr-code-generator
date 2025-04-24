import React from 'react';
import { Link2, Save, Settings2 } from 'lucide-react';
import { QRCodeConfig } from '../types/qrcode';
import { ErrorLevelSelect } from './ErrorLevelSelect';
import { ColorPicker } from './ColorPicker';

interface QRCodeFormProps {
  config: QRCodeConfig;
  onConfigChange: (newConfig: Partial<QRCodeConfig>) => void;
  onSave: () => void;
}

const QRCodeForm: React.FC<QRCodeFormProps> = ({ 
  config, 
  onConfigChange,
  onSave
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number | boolean = value;
    
    if (type === 'number') {
      parsedValue = parseInt(value, 10);
    } else if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    }
    
    onConfigChange({ [name]: parsedValue });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Content
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Link2 size={18} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              name="value"
              id="value"
              value={config.value}
              onChange={handleInputChange}
              placeholder="Enter URL or text"
              className="input-field pl-10"
              required
            />
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enter the URL, text, or data you want to encode in the QR code.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Size
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400">{config.size}px</span>
          </div>
          <input
            type="range"
            name="size"
            id="size"
            min="100"
            max="400"
            step="10"
            value={config.size}
            onChange={handleInputChange}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Foreground Color
            </label>
            <ColorPicker
              color={config.fgColor}
              onChange={(color) => onConfigChange({ fgColor: color })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Background Color
            </label>
            <ColorPicker
              color={config.bgColor}
              onChange={(color) => onConfigChange({ bgColor: color })}
            />
          </div>
        </div>

        <ErrorLevelSelect
          value={config.level}
          onChange={(level) => onConfigChange({ level })}
        />

        <div className="flex items-center">
          <input
            type="checkbox"
            name="includeMargin"
            id="includeMargin"
            checked={config.includeMargin}
            onChange={handleInputChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
          />
          <label htmlFor="includeMargin" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
            Include margin around QR code
          </label>
        </div>
      </div>

      <div className="pt-4 flex gap-3">
        <button
          type="submit"
          className="btn-primary flex items-center gap-2"
        >
          <Save size={18} />
          <span>Save QR Code</span>
        </button>
        <button
          type="button"
          className="btn-outline flex items-center gap-2"
          onClick={() => onConfigChange({
            size: 200,
            bgColor: '#FFFFFF',
            fgColor: '#000000',
            level: 'L',
            includeMargin: true
          })}
        >
          <Settings2 size={18} />
          <span>Reset</span>
        </button>
      </div>
    </form>
  );
};

export default QRCodeForm;