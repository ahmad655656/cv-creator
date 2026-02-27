'use client';

import { Move, Eye, EyeOff } from 'lucide-react';

interface Section {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

interface SectionsManagerProps {
  sections: Section[];
  onToggleSection: (sectionId: string) => void;
  onMoveSection: (sectionId: string, direction: 'up' | 'down') => void;
}

export function SectionsManager({ sections, onToggleSection, onMoveSection }: SectionsManagerProps) {
  return (
    <div className="space-y-2">
      {sections.map((section, index) => (
        <div
          key={section.id}
          className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
        >
          <span className="text-sm text-gray-700 dark:text-gray-300">{section.name}</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onMoveSection(section.id, 'up')}
              disabled={index === 0}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
            >
              ↑
            </button>
            <button
              onClick={() => onMoveSection(section.id, 'down')}
              disabled={index === sections.length - 1}
              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
            >
              ↓
            </button>
            <button
              onClick={() => onToggleSection(section.id)}
              className={`p-1 rounded ${
                section.enabled 
                  ? 'text-green-600' 
                  : 'text-gray-400'
              }`}
            >
              {section.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}