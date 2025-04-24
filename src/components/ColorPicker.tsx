import React from 'react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  return (
    <div className="flex gap-2">
      <div className="relative w-10 h-10 overflow-hidden rounded-md border border-gray-300 dark:border-gray-600">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0 w-full h-full"
        />
        <div 
          className="w-full h-full" 
          style={{ backgroundColor: color }}
        />
      </div>
      <input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="input-field flex-1"
        pattern="^#[0-9A-Fa-f]{6}$"
        placeholder="#000000"
      />
    </div>
  );
};