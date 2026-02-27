'use client';

import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface EditorSidebarProps {
  sections: Array<{ id: string; label: string; icon: string }>;
  activeSection: string;
  setActiveSection: (id: string) => void;
  collapsed: boolean;
}

export const EditorSidebar = ({ sections, activeSection, setActiveSection, collapsed }: EditorSidebarProps) => {
  return (
    <div className="h-full flex flex-col bg-white dark:bg-[#0f1117] transition-colors duration-300">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800/50">
        {!collapsed ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex items-center justify-between"
          >
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              محتوى السيرة
            </h3>
            <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <div className="h-1 w-6 bg-gray-200 dark:bg-gray-800 rounded-full" />
          </div>
        )}
      </div>
      
      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar p-3 space-y-1.5 mt-2">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="relative w-full group outline-none"
            >
              <motion.div
                className={`
                  flex items-center gap-3 p-3 rounded-xl transition-all duration-300 relative z-10
                  ${isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5'}
                `}
                whileTap={{ scale: 0.97 }}
              >
                {/* Icon Container */}
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-blue-50 dark:bg-blue-500/10 shadow-sm' 
                    : 'bg-transparent group-hover:scale-110'}
                `}>
                  <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                    {section.icon}
                  </span>
                </div>

                {/* Label */}
                {!collapsed && (
                  <span className={`text-[14px] font-semibold tracking-wide transition-colors ${isActive ? 'font-bold' : ''}`}>
                    {section.label}
                  </span>
                )}

                {/* Active Indicator Arrow */}
                {isActive && !collapsed && (
                  <motion.div 
                    layoutId="activeArrow"
                    className="mr-auto"
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <ChevronLeft size={16} className="text-blue-500" />
                  </motion.div>
                )}
              </motion.div>

              {/* Active Background Capsule */}
              {isActive && (
                <motion.div
                  layoutId="activeBackground"
                  className="absolute inset-0 bg-blue-50/50 dark:bg-blue-500/[0.03] rounded-xl border border-blue-100/50 dark:border-blue-500/10"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / Hint */}
      {!collapsed && (
        <div className="p-4 mt-auto">
          <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-4 border border-dashed border-gray-200 dark:border-gray-800">
            <p className="text-[11px] text-gray-400 dark:text-gray-500 leading-relaxed text-center">
              نصيحة: أكمل ٨٠٪ من الأقسام لزيادة فرص قبول سيرتك الذاتية.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};