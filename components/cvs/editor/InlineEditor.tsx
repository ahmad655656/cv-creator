'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface EditableInlineElement {
  id: string;
  type: string;
  content: string;
  style?: Record<string, string | number>;
}

interface InlineEditorProps {
  elements: EditableInlineElement[];
  onSelect: (element: EditableInlineElement) => void;
  selectedId?: string;
  onContentUpdate: (id: string, content: string) => void;
}

export const InlineEditor = ({
  elements,
  onSelect,
  selectedId,
  onContentUpdate
}: InlineEditorProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const editRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editRef.current) {
      editRef.current.focus();
    }
  }, [editingId]);

  const handleDoubleClick = (element: EditableInlineElement) => {
    setEditingId(element.id);
    setEditValue(element.content);
    onSelect(element);
  };

  const handleBlur = () => {
    if (editingId) {
      onContentUpdate(editingId, editValue);
    }
    setEditingId(null);
  };

  const handleEditingChange = (value: string) => {
    setEditValue(value);
    if (editingId) {
      onContentUpdate(editingId, value);
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

  const renderElement = (element: EditableInlineElement) => {
    if (editingId === element.id) {
      const className =
        'w-full p-2 border-2 border-blue-500 rounded-lg focus:outline-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white';
      const sharedProps = {
        value: editValue,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown,
        className,
        style: element.style
      };

      if (element.type === 'heading' || element.type === 'paragraph') {
        return (
          <textarea
            ref={editRef as React.RefObject<HTMLTextAreaElement>}
            {...sharedProps}
            rows={3}
            onChange={(e) => handleEditingChange(e.target.value)}
          />
        );
      }

      return (
        <input
          ref={editRef as React.RefObject<HTMLInputElement>}
          type="text"
          {...sharedProps}
          onChange={(e) => handleEditingChange(e.target.value)}
        />
      );
    }

    const ElementTag = element.type === 'heading' ? 'h3' : element.type === 'paragraph' ? 'p' : 'div';

    return (
      <ElementTag
        onDoubleClick={() => handleDoubleClick(element)}
        onClick={() => onSelect(element)}
        className={`cursor-pointer transition-all duration-200 ${
          selectedId === element.id ? 'ring-2 ring-blue-500 ring-offset-2 rounded' : ''
        }`}
        style={element.style}
      >
        {element.content}
      </ElementTag>
    );
  };

  return (
    <div className="space-y-4">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative group"
        >
          {renderElement(element)}
          <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
      ))}
    </div>
  );
};
