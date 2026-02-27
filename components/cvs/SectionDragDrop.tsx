'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Eye, EyeOff, Settings, Trash2, Copy, Edit } from 'lucide-react';

interface Section {
  id: string;
  type: 'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'certifications' | 'projects' | 'custom';
  title: string;
  enabled: boolean;
  order: number;
  icon?: string;
  settings?: any;
}

interface SectionDragDropProps {
  sections: Section[];
  onReorder: (sections: Section[]) => void;
  onToggleSection: (sectionId: string) => void;
  onEditSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onDuplicateSection: (sectionId: string) => void;
  onAddSection: () => void;
}

export function SectionDragDrop({
  sections,
  onReorder,
  onToggleSection,
  onEditSection,
  onDeleteSection,
  onDuplicateSection,
  onAddSection
}: SectionDragDropProps) {
  
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // تحديث ترتيب الأقسام
    const updatedSections = items.map((item, index) => ({
      ...item,
      order: index + 1
    }));

    onReorder(updatedSections);
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'personal': return '👤';
      case 'experience': return '💼';
      case 'education': return '🎓';
      case 'skills': return '⚡';
      case 'languages': return '🌐';
      case 'certifications': return '📜';
      case 'projects': return '🚀';
      default: return '📦';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          ترتيب الأقسام
        </h3>
        <button
          onClick={onAddSection}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2"
        >
          <span>+</span>
          إضافة قسم مخصص
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {sections.map((section, index) => (
                <Draggable
                  key={section.id}
                  draggableId={section.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 ${
                        snapshot.isDragging ? 'shadow-2xl ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                          >
                            <GripVertical size={18} className="text-gray-400" />
                          </div>
                          
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                            {section.icon || getSectionIcon(section.type)}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {section.title}
                              </h4>
                              {!section.enabled && (
                                <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
                                  مخفي
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {section.type === 'personal' && 'المعلومات الشخصية'}
                              {section.type === 'experience' && 'الخبرات المهنية'}
                              {section.type === 'education' && 'المؤهلات التعليمية'}
                              {section.type === 'skills' && 'المهارات'}
                              {section.type === 'languages' && 'اللغات'}
                              {section.type === 'certifications' && 'الشهادات'}
                              {section.type === 'projects' && 'المشاريع'}
                              {section.type === 'custom' && 'قسم مخصص'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEditSection(section.id)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                            title="تعديل القسم"
                          >
                            <Edit size={16} className="text-gray-600 dark:text-gray-400" />
                          </button>

                          <button
                            onClick={() => onDuplicateSection(section.id)}
                            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
                            title="نسخ القسم"
                          >
                            <Copy size={16} className="text-gray-600 dark:text-gray-400" />
                          </button>

                          <button
                            onClick={() => onToggleSection(section.id)}
                            className={`p-2 rounded-lg transition ${
                              section.enabled
                                ? 'hover:bg-gray-200 dark:hover:bg-gray-700 text-green-600'
                                : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400'
                            }`}
                            title={section.enabled ? 'إخفاء القسم' : 'إظهار القسم'}
                          >
                            {section.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>

                          {section.type !== 'personal' && (
                            <button
                              onClick={() => onDeleteSection(section.id)}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
                              title="حذف القسم"
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}