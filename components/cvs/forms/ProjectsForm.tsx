'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Project } from '../types';

interface ProjectsFormProps {
  projects: Project[];
  addProject: () => void;
  updateProject: (id: string, field: keyof Project, value: any) => void;
  updateProjectDescription: (id: string, index: number, value: string) => void;
  addProjectDescription: (id: string) => void;
  removeProjectDescription: (id: string, index: number) => void;
  removeProject: (id: string) => void;
}

export function ProjectsForm({
  projects,
  addProject,
  updateProject,
  updateProjectDescription,
  addProjectDescription,
  removeProjectDescription,
  removeProject
}: ProjectsFormProps) {
  return (
    <div className="space-y-6">
      {projects.map((project, index) => (
        <div key={project.id} className="relative group">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                مشروع {index + 1}
              </h3>
              <button
                onClick={() => removeProject(project.id)}
                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">اسم المشروع</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                  placeholder="اسم المشروع"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">التقنيات</label>
                <input
                  type="text"
                  value={project.technologies.join(', ')}
                  onChange={(e) => {
                    const techs = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                    updateProject(project.id, 'technologies', techs);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">تاريخ البداية</label>
                <input
                  type="month"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">تاريخ النهاية</label>
                <input
                  type="month"
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                  disabled={project.current}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
              </div>
              <div className="flex items-center gap-2 mt-7">
                <input
                  type="checkbox"
                  checked={project.current}
                  onChange={(e) => updateProject(project.id, 'current', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label className="text-sm text-gray-600 dark:text-gray-400">
                  جاري العمل عليه
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">رابط المشروع</label>
                <input
                  type="url"
                  value={project.projectUrl || ''}
                  onChange={(e) => updateProject(project.id, 'projectUrl', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                  placeholder="https://myproject.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">رابط GitHub</label>
                <input
                  type="url"
                  value={project.githubUrl || ''}
                  onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                  placeholder="https://github.com/user/project"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">وصف المشروع</label>
              {project.description.map((desc, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={desc}
                    onChange={(e) => updateProjectDescription(project.id, idx, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:text-white"
                    placeholder={`وصف المشروع - النقطة ${idx + 1}`}
                  />
                  <button
                    onClick={() => removeProjectDescription(project.id, idx)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addProjectDescription(project.id)}
                className="text-blue-600 text-sm flex items-center gap-1 mt-2"
              >
                <Plus size={16} />
                إضافة نقطة وصف
              </button>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={addProject}
        className="w-full py-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة مشروع جديد
      </button>
    </div>
  );
}