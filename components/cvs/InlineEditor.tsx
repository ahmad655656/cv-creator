'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Palette, Copy, Trash2, GripVertical, Layers
} from 'lucide-react';
import { EditableElement } from './types';

interface InlineEditorProps {
  elements: EditableElement[];
  onUpdate: (elements: EditableElement[]) => void;
  onSelect: (element: EditableElement) => void;
  selectedId: string | null;
  onContentUpdate?: (elementId: string, content: string) => void;
}

export function InlineEditor({ 
  elements, 
  onUpdate, 
  onSelect, 
  selectedId,
  onContentUpdate 
}: InlineEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const editRef = useRef<HTMLDivElement>(null);
  const elementRefs = useRef<{ [key: string]: HTMLDivElement }>({});

  // التركيز على العنصر عند بدء التحرير
  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
    }
  }, [editingId]);

  const handleDoubleClick = (element: EditableElement) => {
    if (element.type === 'image') return;
    setEditingId(element.id);
    setEditValue(element.content);
  };

  const handleBlur = () => {
    if (editingId) {
      const updatedElements = elements.map(el =>
        el.id === editingId ? { ...el, content: editValue } : el
      );
      onUpdate(updatedElements);
      
      // إبلاغ المكون الأب بتحديث المحتوى
      if (onContentUpdate) {
        onContentUpdate(editingId, editValue);
      }
      
      setEditingId(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, element: EditableElement) => {
    e.dataTransfer.setData('elementId', element.id);
  };

  const handleDrop = (e: React.DragEvent, targetElement: EditableElement) => {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData('elementId');
    if (!sourceId) return;

    const sourceIndex = elements.findIndex(el => el.id === sourceId);
    const targetIndex = elements.findIndex(el => el.id === targetElement.id);
    
    if (sourceIndex !== -1 && targetIndex !== -1 && sourceIndex !== targetIndex) {
      const newElements = [...elements];
      const [removed] = newElements.splice(sourceIndex, 1);
      newElements.splice(targetIndex, 0, removed);
      onUpdate(newElements);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCopy = (element: EditableElement) => {
    const newElement = {
      ...element,
      id: `${element.id}-copy-${Date.now()}`,
      content: element.content
    };
    onUpdate([...elements, newElement]);
  };

  const handleDelete = (elementId: string) => {
    if (elementId.includes('fullName') || elementId.includes('jobTitle')) {
      alert('لا يمكن حذف العناصر الأساسية');
      return;
    }
    onUpdate(elements.filter(el => el.id !== elementId));
  };

  const renderElement = (element: EditableElement) => {
    const isSelected = selectedId === element.id;
    const isEditing = editingId === element.id;

    const baseStyle: React.CSSProperties = {
      ...element.style,
      cursor: isSelected ? 'move' : 'default',
      outline: isSelected ? '2px solid #3b82f6' : 'none',
      outlineOffset: '2px',
      position: 'relative',
      transition: 'all 0.2s ease',
    };

    if (isEditing) {
      return (
        <div
          key={element.id}
          ref={editRef}
          contentEditable
          suppressContentEditableWarning
          className="outline-none ring-2 ring-blue-500 rounded p-1 min-w-[50px]"
          style={baseStyle}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
        >
          {editValue}
        </div>
      );
    }

    return (
      <div
        key={element.id}
        ref={(el) => { if (el) elementRefs.current[element.id] = el; }}
        style={baseStyle}
        onDoubleClick={() => handleDoubleClick(element)}
        onClick={() => onSelect(element)}
        draggable
        onDragStart={(e) => handleDragStart(e, element)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, element)}
        className="hover:ring-2 hover:ring-blue-300 hover:ring-offset-2 transition-all rounded select-none group"
      >
        {element.type === 'heading' && <h2>{element.content}</h2>}
        {element.type === 'paragraph' && <p>{element.content}</p>}
        {element.type === 'text' && <span>{element.content}</span>}
        {element.type === 'list' && (
          <ul>
            {Array.isArray(element.content) ? element.content.map((item, i) => (
              <li key={i}>{item}</li>
            )) : <li>{element.content}</li>}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {elements.map(element => {
        const isSelected = selectedId === element.id;
        
        return (
          <div key={element.id} className="relative group">
            {renderElement(element)}
            
            {/* شريط الأدوات السريع - يظهر فقط عند التحديد */}
            {isSelected && (
              <div className="absolute -top-10 left-0 bg-white dark:bg-gray-900 rounded-lg shadow-xl border dark:border-gray-800 p-1 flex items-center gap-1 z-10 animate-slide-down">
                <button
                  onClick={() => handleCopy(element)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                  title="نسخ"
                >
                  <Copy size={14} />
                </button>
                <button
                  onClick={() => handleDelete(element.id)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
                  title="حذف"
                >
                  <Trash2 size={14} />
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition" title="عريض">
                  <Bold size={14} />
                </button>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition" title="مائل">
                  <Italic size={14} />
                </button>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition" title="تسطير">
                  <Underline size={14} />
                </button>
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition" title="لون">
                  <Palette size={14} />
                </button>
                <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition" title="تخطيط">
                  <Layers size={14} />
                </button>
              </div>
            )}

            {/* مقبض السحب - يظهر عند التحويم */}
            <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
              <GripVertical size={16} className="text-gray-400 cursor-move" />
            </div>
          </div>
        );
      })}
    </div>
  );
}