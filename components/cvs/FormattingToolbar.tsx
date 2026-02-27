'use client';

import { useState, useEffect } from 'react';
import {
  Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Palette, Image, Link, List, ListOrdered, Minus, Square,
  ChevronDown, ChevronUp, Copy, Trash2, Settings, GripVertical,
  MinusCircle, PlusCircle, RotateCw, RotateCcw, Eye, EyeOff,
  Layers, Grid3X3, Move, Sparkles, Download, Upload
} from 'lucide-react';

interface FormattingToolbarProps {
  selectedElement: any;
  onUpdateStyle: (style: any) => void;
  onClose: () => void;
}

export function FormattingToolbar({ selectedElement, onUpdateStyle, onClose }: FormattingToolbarProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'color' | 'layout' | 'effects'>('text');
  const [expandedSection, setExpandedSection] = useState<string | null>('font');
  
  // State للتنسيقات الحالية
  const [currentStyle, setCurrentStyle] = useState({
    fontFamily: selectedElement?.style?.fontFamily || 'Arial',
    fontSize: selectedElement?.style?.fontSize || '16px',
    fontWeight: selectedElement?.style?.fontWeight || 'normal',
    fontStyle: selectedElement?.style?.fontStyle || 'normal',
    textDecoration: selectedElement?.style?.textDecoration || 'none',
    textAlign: selectedElement?.style?.textAlign || 'right',
    color: selectedElement?.style?.color || '#000000',
    backgroundColor: selectedElement?.style?.backgroundColor || 'transparent',
    lineHeight: selectedElement?.style?.lineHeight || '1.5',
    letterSpacing: selectedElement?.style?.letterSpacing || '0px',
    padding: selectedElement?.style?.padding || '0px',
    margin: selectedElement?.style?.margin || '0px',
    borderWidth: selectedElement?.style?.borderWidth || '0px',
    borderStyle: selectedElement?.style?.borderStyle || 'none',
    borderColor: selectedElement?.style?.borderColor || '#000000',
    borderRadius: selectedElement?.style?.borderRadius || '0px',
    opacity: selectedElement?.style?.opacity || '1',
    rotate: selectedElement?.style?.rotate || '0deg',
  });

  // تحديث الـ state عند تغيير العنصر المحدد
  useEffect(() => {
    if (selectedElement?.style) {
      setCurrentStyle(prev => ({
        ...prev,
        ...selectedElement.style
      }));
    }
  }, [selectedElement]);

  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Courier New',
    'Georgia', 'Verdana', 'Tahoma', 'Trebuchet MS',
    'Impact', 'Comic Sans MS', 'Monospace', 'Cursive',
    'Segoe UI', 'Roboto', 'Open Sans', 'Lato',
    'Montserrat', 'Poppins', 'Inter', 'SF Pro Display'
  ];

  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 32, 36, 40, 48, 56, 64, 72];

  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff',
    '#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc',
    '#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd',
    '#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0',
    '#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79',
  ];

  const borders = ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // دوال تحديث التنسيق
  const updateStyle = (key: string, value: string) => {
    const newStyle = { ...currentStyle, [key]: value };
    setCurrentStyle(newStyle);
    onUpdateStyle({ [key]: value });
  };

  const handleFontChange = (font: string) => {
    updateStyle('fontFamily', font);
  };

  const handleFontSizeChange = (size: number) => {
    updateStyle('fontSize', `${size}px`);
  };

  const handleBold = () => {
    const newWeight = currentStyle.fontWeight === 'bold' ? 'normal' : 'bold';
    updateStyle('fontWeight', newWeight);
  };

  const handleItalic = () => {
    const newStyle = currentStyle.fontStyle === 'italic' ? 'normal' : 'italic';
    updateStyle('fontStyle', newStyle);
  };

  const handleUnderline = () => {
    const newDecoration = currentStyle.textDecoration === 'underline' ? 'none' : 'underline';
    updateStyle('textDecoration', newDecoration);
  };

  const handleAlign = (align: string) => {
    updateStyle('textAlign', align);
  };

  const handleColorChange = (color: string) => {
    updateStyle('color', color);
  };

  const handleBgColorChange = (color: string) => {
    updateStyle('backgroundColor', color);
  };

  const handleLineHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateStyle('lineHeight', e.target.value);
  };

  const handleLetterSpacingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateStyle('letterSpacing', `${e.target.value}px`);
  };

  const handleBorderStyleChange = (style: string) => {
    updateStyle('borderStyle', style);
  };

  const handleBorderWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateStyle('borderWidth', `${e.target.value}px`);
  };

  const handleBorderRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateStyle('borderRadius', `${e.target.value}px`);
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateStyle('opacity', (parseInt(e.target.value) / 100).toString());
  };

  const handleRotateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateStyle('rotate', `${e.target.value}deg`);
  };

  const SectionHeader = ({ title, icon, section }: { title: string; icon: React.ReactNode; section: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium text-sm">{title}</span>
      </div>
      {expandedSection === section ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );

  return (
    <div className="w-96 bg-white dark:bg-gray-900 border-l dark:border-gray-800 shadow-2xl flex flex-col h-full overflow-hidden">
      {/* Header مع معلومات العنصر المحدد */}
      <div className="p-4 border-b dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">تنسيق العنصر</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {selectedElement?.type === 'heading' ? 'عنوان' : 
               selectedElement?.type === 'paragraph' ? 'نص' : 
               selectedElement?.type === 'list' ? 'قائمة' : 'نص عادي'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <ChevronDown size={18} />
          </button>
        </div>
      </div>

      {/* Tabs منظمة */}
      <div className="flex border-b dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition flex items-center justify-center gap-2 ${
            activeTab === 'text' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-900' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Type size={16} />
          نص
        </button>
        <button
          onClick={() => setActiveTab('color')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition flex items-center justify-center gap-2 ${
            activeTab === 'color' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-900' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Palette size={16} />
          ألوان
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition flex items-center justify-center gap-2 ${
            activeTab === 'layout' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-900' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Layers size={16} />
          تخطيط
        </button>
        <button
          onClick={() => setActiveTab('effects')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition flex items-center justify-center gap-2 ${
            activeTab === 'effects' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white dark:bg-gray-900' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Sparkles size={16} />
          تأثيرات
        </button>
      </div>

      {/* Content with smooth scrolling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeTab === 'text' && (
          <div className="space-y-3">
            {/* الخط */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
              <SectionHeader title="الخط" icon={<Type size={16} />} section="font" />
              {expandedSection === 'font' && (
                <div className="p-4 space-y-4 border-t dark:border-gray-700">
                  <select 
                    value={currentStyle.fontFamily}
                    onChange={(e) => handleFontChange(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm"
                  >
                    {fonts.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const currentSize = parseInt(currentStyle.fontSize);
                        if (currentSize > 8) handleFontSizeChange(currentSize - 1);
                      }}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      <MinusCircle size={18} />
                    </button>
                    <select 
                      value={parseInt(currentStyle.fontSize)}
                      onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-center"
                    >
                      {fontSizes.map(size => (
                        <option key={size} value={size}>{size}px</option>
                      ))}
                    </select>
                    <button 
                      onClick={() => {
                        const currentSize = parseInt(currentStyle.fontSize);
                        if (currentSize < 72) handleFontSizeChange(currentSize + 1);
                      }}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      <PlusCircle size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* الأنماط */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
              <SectionHeader title="الأنماط" icon={<Bold size={16} />} section="styles" />
              {expandedSection === 'styles' && (
                <div className="p-4 space-y-4 border-t dark:border-gray-700">
                  <div className="flex gap-2">
                    <button 
                      onClick={handleBold}
                      className={`flex-1 p-3 border rounded-xl transition ${
                        currentStyle.fontWeight === 'bold' 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Bold size={18} className="mx-auto" />
                    </button>
                    <button 
                      onClick={handleItalic}
                      className={`flex-1 p-3 border rounded-xl transition ${
                        currentStyle.fontStyle === 'italic' 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Italic size={18} className="mx-auto" />
                    </button>
                    <button 
                      onClick={handleUnderline}
                      className={`flex-1 p-3 border rounded-xl transition ${
                        currentStyle.textDecoration === 'underline' 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Underline size={18} className="mx-auto" />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleAlign('right')}
                      className={`flex-1 p-3 border rounded-xl transition ${
                        currentStyle.textAlign === 'right' 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <AlignRight size={18} className="mx-auto" />
                    </button>
                    <button 
                      onClick={() => handleAlign('center')}
                      className={`flex-1 p-3 border rounded-xl transition ${
                        currentStyle.textAlign === 'center' 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <AlignCenter size={18} className="mx-auto" />
                    </button>
                    <button 
                      onClick={() => handleAlign('left')}
                      className={`flex-1 p-3 border rounded-xl transition ${
                        currentStyle.textAlign === 'left' 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <AlignLeft size={18} className="mx-auto" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* التباعد */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
              <SectionHeader title="التباعد" icon={<Move size={16} />} section="spacing" />
              {expandedSection === 'spacing' && (
                <div className="p-4 space-y-4 border-t dark:border-gray-700">
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">تباعد الأسطر</label>
                    <input 
                      type="range" 
                      min="1" 
                      max="3" 
                      step="0.1" 
                      value={parseFloat(currentStyle.lineHeight)}
                      onChange={handleLineHeightChange}
                      className="w-full" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">تباعد الأحرف</label>
                    <input 
                      type="range" 
                      min="-2" 
                      max="10" 
                      step="0.5" 
                      value={parseFloat(currentStyle.letterSpacing)}
                      onChange={handleLetterSpacingChange}
                      className="w-full" 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'color' && (
          <div className="space-y-3">
            {/* لون النص */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
              <SectionHeader title="لون النص" icon={<Palette size={16} />} section="textColor" />
              {expandedSection === 'textColor' && (
                <div className="p-4 border-t dark:border-gray-700">
                  <div className="grid grid-cols-10 gap-1">
                    {colors.slice(0, 30).map(color => (
                      <button
                        key={color}
                        onClick={() => handleColorChange(color)}
                        className={`w-6 h-6 rounded border hover:scale-110 transition shadow-sm ${
                          currentStyle.color === color ? 'ring-2 ring-blue-500 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* لون الخلفية */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
              <SectionHeader title="لون الخلفية" icon={<Layers size={16} />} section="bgColor" />
              {expandedSection === 'bgColor' && (
                <div className="p-4 border-t dark:border-gray-700">
                  <div className="grid grid-cols-10 gap-1">
                    {colors.slice(30, 60).map(color => (
                      <button
                        key={color}
                        onClick={() => handleBgColorChange(color)}
                        className={`w-6 h-6 rounded border hover:scale-110 transition shadow-sm ${
                          currentStyle.backgroundColor === color ? 'ring-2 ring-blue-500 scale-110' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* لون مخصص */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
              <SectionHeader title="لون مخصص" icon={<Sparkles size={16} />} section="customColor" />
              {expandedSection === 'customColor' && (
                <div className="p-4 border-t dark:border-gray-700">
                  <input 
                    type="color" 
                    value={currentStyle.color}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-full h-10 rounded-lg border border-gray-300" 
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'layout' && (
          <div className="space-y-3">
            {/* الحدود */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
              <SectionHeader title="الحدود" icon={<Square size={16} />} section="border" />
              {expandedSection === 'border' && (
                <div className="p-4 space-y-4 border-t dark:border-gray-700">
                  <select 
                    value={currentStyle.borderStyle}
                    onChange={(e) => handleBorderStyleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800"
                  >
                    {borders.map(border => (
                      <option key={border} value={border}>{border}</option>
                    ))}
                  </select>
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">سمك الحدود</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="10" 
                      value={parseFloat(currentStyle.borderWidth)}
                      onChange={handleBorderWidthChange}
                      className="w-full" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-2">استدارة الزوايا</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="50" 
                      value={parseFloat(currentStyle.borderRadius)}
                      onChange={handleBorderRadiusChange}
                      className="w-full" 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'effects' && (
          <div className="space-y-3">
            {/* الشفافية */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
              <SectionHeader title="الشفافية" icon={<Eye size={16} />} section="opacity" />
              {expandedSection === 'opacity' && (
                <div className="p-4 border-t dark:border-gray-700">
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={parseFloat(currentStyle.opacity) * 100}
                    onChange={handleOpacityChange}
                    className="w-full" 
                  />
                </div>
              )}
            </div>

            {/* التدوير */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
              <SectionHeader title="التدوير" icon={<RotateCw size={16} />} section="rotate" />
              {expandedSection === 'rotate' && (
                <div className="p-4 space-y-4 border-t dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        const currentRotate = parseInt(currentStyle.rotate) || 0;
                        handleRotateChange({ target: { value: (currentRotate - 5).toString() } } as any);
                      }}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      <RotateCcw size={18} />
                    </button>
                    <input 
                      type="range" 
                      min="-180" 
                      max="180" 
                      value={parseInt(currentStyle.rotate) || 0}
                      onChange={handleRotateChange}
                      className="flex-1" 
                    />
                    <button 
                      onClick={() => {
                        const currentRotate = parseInt(currentStyle.rotate) || 0;
                        handleRotateChange({ target: { value: (currentRotate + 5).toString() } } as any);
                      }}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      <RotateCw size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer with action buttons */}
      <div className="p-4 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex gap-2">
          <button 
            onClick={() => {
              // تطبيق جميع التغييرات مرة واحدة
              onUpdateStyle(currentStyle);
            }}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-medium shadow-lg hover:shadow-xl"
          >
            تطبيق
          </button>
          <button 
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm font-medium"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}