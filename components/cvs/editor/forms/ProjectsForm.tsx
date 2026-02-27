// components/editor/forms/ProjectsForm.tsx
'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectsFormProps {
  projects: Project[];
  addProject: () => void;
  updateProject: (id: string, field: string, value: any) => void;
  updateProjectDescription: (id: string, index: number, value: string) => void;
  addProjectDescription: (id: string) => void;
  removeProjectDescription: (id: string, index: number) => void;
  removeProject: (id: string) => void;
}

export const ProjectsForm = ({
  projects,
  addProject,
  updateProject,
  updateProjectDescription,
  addProjectDescription,
  removeProjectDescription,
  removeProject
}: ProjectsFormProps) => {
  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 dark:text-white">
              {project.name || 'مشروع جديد'}
            </h3>
            <button
              onClick={() => removeProject(project.id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                اسم المشروع
              </label>
              <input
                type="text"
                value={project.name || ''}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="نظام إدارة المحتوى"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                دورك في المشروع
              </label>
              <input
                type="text"
                value={project.role || ''}
                onChange={(e) => updateProject(project.id, 'role', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="مطور رئيسي"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                التقنيات المستخدمة
              </label>
              <input
                type="text"
                value={project.technologies?.join(', ') || ''}
                onChange={(e) => updateProject(project.id, 'technologies', e.target.value.split(',').map(t => t.trim()))}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                تاريخ البداية
              </label>
              <input
                type="month"
                value={project.startDate || ''}
                onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>

            {!project.current && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  تاريخ النهاية
                </label>
                <input
                  type="month"
                  value={project.endDate || ''}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                />
              </div>
            )}

            <div className="col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                checked={project.current || false}
                onChange={(e) => updateProject(project.id, 'current', e.target.checked)}
                className="rounded border-gray-300 text-blue-600"
                id={`current-${project.id}`}
              />
              <label htmlFor={`current-${project.id}`} className="text-sm text-gray-700 dark:text-gray-300">
                مشروع حالياً
              </label>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                وصف المشروع
              </label>
              <div className="space-y-3">
                {project.description?.map((desc, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={desc || ''}
                      onChange={(e) => updateProjectDescription(project.id, index, e.target.value)}
                      className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                      placeholder="وصف المشروع..."
                    />
                    <button
                      onClick={() => removeProjectDescription(project.id, index)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addProjectDescription(project.id)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus size={16} />
                  إضافة وصف
                </button>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                رابط المشروع (اختياري)
              </label>
              <input
                type="url"
                value={project.url || ''}
                onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl"
                placeholder="https://github.com/..."
              />
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addProject}
        className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة مشروع
      </button>
    </div>
  );
};