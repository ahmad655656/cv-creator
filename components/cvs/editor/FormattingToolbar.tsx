// components/editor/FormattingToolbar.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Type, Minus, Plus, Palette, X, Copy, Trash2
} from 'lucide-react';

interface FormattingToolbarProps {
  selectedElement: any;
  onUpdateStyle: (style: any) => void;
  onClose: () => void;
  elements: any[];
  onElementsUpdate: (elements: any[]) => void;
}

export const FormattingToolbar = ({
  selectedElement,
  onUpdateStyle,
  onClose,
  elements,
  onElementsUpdate
}: FormattingToolbarProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);

  const updateStyle = (updates: Record<string, any>) => {
    onUpdateStyle(updates);
  };

  const duplicateElement = () => {
    const newElement = {
      ...selectedElement,
      id: `${selectedElement.id}-copy-${Date.now()}`,
      content: `${selectedElement.content} (نسخة)`
    };
    onElementsUpdate([...elements, newElement]);
  };

  const deleteElement = () => {
    onElementsUpdate(elements.filter(el => el.id !== selectedElement.id));
    onClose();
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border dark:border-gray-800 p-2 flex items-center gap-1"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
    >
      {/* Font size controls */}
      <div className="flex items-center gap-1 px-2 border-l dark:border-gray-700">
        <button
          onClick={() => {
            const currentSize = parseInt(selectedElement.style?.fontSize || '16');
            updateStyle({ fontSize: `${Math.max(8, currentSize - 2)}px` });
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <Minus size={16} />
        </button>
        <span className="w-12 text-center text-sm">
          {selectedElement.style?.fontSize || '16px'}
        </span>
        <button
          onClick={() => {
            const currentSize = parseInt(selectedElement.style?.fontSize || '16');
            updateStyle({ fontSize: `${Math.min(72, currentSize + 2)}px` });
          }}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Text formatting */}
      <div className="flex items-center gap-1 px-2 border-l dark:border-gray-700">
        <button
          onClick={() => updateStyle({ fontWeight: selectedElement.style?.fontWeight === 'bold' ? 'normal' : 'bold' })}
          className={`p-2 rounded-lg ${selectedElement.style?.fontWeight === 'bold' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => updateStyle({ fontStyle: selectedElement.style?.fontStyle === 'italic' ? 'normal' : 'italic' })}
          className={`p-2 rounded-lg ${selectedElement.style?.fontStyle === 'italic' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => updateStyle({ textDecoration: selectedElement.style?.textDecoration === 'underline' ? 'none' : 'underline' })}
          className={`p-2 rounded-lg ${selectedElement.style?.textDecoration === 'underline' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <Underline size={16} />
        </button>
      </div>

      {/* Alignment */}
      <div className="flex items-center gap-1 px-2 border-l dark:border-gray-700">
        <button
          onClick={() => updateStyle({ textAlign: 'left' })}
          className={`p-2 rounded-lg ${selectedElement.style?.textAlign === 'left' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={() => updateStyle({ textAlign: 'center' })}
          className={`p-2 rounded-lg ${selectedElement.style?.textAlign === 'center' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={() => updateStyle({ textAlign: 'right' })}
          className={`p-2 rounded-lg ${selectedElement.style?.textAlign === 'right' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
        >
          <AlignRight size={16} />
        </button>
      </div>

      {/* Color picker */}
      <div className="relative">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <Palette size={16} />
        </button>
        
        {showColorPicker && (
          <div className="absolute bottom-full left-0 mb-2 p-3 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border dark:border-gray-800 grid grid-cols-5 gap-2">
            {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#808080', '#FFFFFF', '#C0C0C0'].map(color => (
              <button
                key={color}
                onClick={() => {
                  updateStyle({ color });
                  setShowColorPicker(false);
                }}
                className="w-8 h-8 rounded-lg border-2 border-transparent hover:scale-110 transition"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Element actions */}
      <div className="flex items-center gap-1 px-2 border-l dark:border-gray-700">
        <button
          onClick={duplicateElement}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <Copy size={16} />
        </button>
        <button
          onClick={deleteElement}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};