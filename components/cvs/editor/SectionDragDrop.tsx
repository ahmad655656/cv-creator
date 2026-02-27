// components/editor/SectionDragDrop.tsx
'use client';

import { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, Eye, EyeOff, Edit2, Copy, Trash2, Plus } from 'lucide-react';

interface Section {
  id: string;
  title: string;
  enabled: boolean;
  icon?: string;
}

interface SectionDragDropProps {
  sections: Section[];
  onReorder: (sections: Section[]) => void;
  onToggleSection: (id: string) => void;
  onEditSection: (id: string) => void;
  onDeleteSection: (id: string) => void;
  onDuplicateSection: (id: string) => void;
  onAddSection: () => void;
}

export const SectionDragDrop = ({
  sections,
  onReorder,
  onToggleSection,
  onEditSection,
  onDeleteSection,
  onDuplicateSection,
  onAddSection
}: SectionDragDropProps) => {
  return (
    <div className="space-y-4">
      <Reorder.Group axis="y" values={sections} onReorder={onReorder} className="space-y-2">
        {sections.map((section) => (
          <Reorder.Item
            key={section.id}
            value={section}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 cursor-move"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical size={20} className="text-gray-400" />
                <span className="text-2xl">{section.icon || '📄'}</span>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{section.title}</h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleSection(section.id)}
                  className={`p-2 rounded-lg transition ${
                    section.enabled 
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                >
                  {section.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                
                <button
                  onClick={() => onEditSection(section.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Edit2 size={16} />
                </button>
                
                <button
                  onClick={() => onDuplicateSection(section.id)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <Copy size={16} />
                </button>
                
                {section.id !== 'personal' && (
                  <button
                    onClick={() => onDeleteSection(section.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      <button
        onClick={onAddSection}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة قسم مخصص
      </button>
    </div>
  );
};