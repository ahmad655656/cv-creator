'use client';

import { SECTIONS } from '../constants';

interface EditorSidebarProps {
  sections: typeof SECTIONS;
  activeSection: string;
  setActiveSection: (section: string) => void;
  collapsed?: boolean; // إضافة خاصية التصغير
}

export function EditorSidebar({ sections, activeSection, setActiveSection, collapsed }: EditorSidebarProps) {
  return (
    <div className={`bg-white dark:bg-gray-900 border-l dark:border-gray-800 flex flex-col items-center py-6 shadow-lg h-full ${
      collapsed ? 'w-14' : 'w-20'
    }`}>
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;

        return (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`relative w-12 h-12 rounded-xl mb-4 flex flex-col items-center justify-center transition-all group
              ${isActive 
                ? `bg-${section.color}-100 dark:bg-${section.color}-900/30 text-${section.color}-600 dark:text-${section.color}-400 shadow-md` 
                : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            title={section.name}
          >
            <Icon size={collapsed ? 18 : 22} />
            {!collapsed && (
              <span className="absolute left-16 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50">
                {section.name}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}