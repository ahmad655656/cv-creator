'use client';

import { Project } from '@/lib/types/template.types';
import { Plus, Trash2, Link as LinkIcon, Github } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export function ProjectsForm({ projects, onChange }: ProjectsFormProps) {
  const addProject = () => {
    const newProject: Project = {
      id: uuidv4(),
      name: '',
      description: [''],
      technologies: [],
      startDate: '',
      endDate: '',
      current: false,
      projectUrl: '',
      githubUrl: '',
    };
    onChange([...projects, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    const updated = projects.map(project =>
      project.id === id ? { ...project, [field]: value } : project
    );
    onChange(updated);
  };

  const updateDescription = (projectId: string, index: number, value: string) => {
    const updated = projects.map(project => {
      if (project.id === projectId) {
        const newDesc = [...project.description];
        newDesc[index] = value;
        return { ...project, description: newDesc };
      }
      return project;
    });
    onChange(updated);
  };

  const addDescription = (projectId: string) => {
    const updated = projects.map(project => {
      if (project.id === projectId) {
        return { ...project, description: [...project.description, ''] };
      }
      return project;
    });
    onChange(updated);
  };

  const removeDescription = (projectId: string, index: number) => {
    const updated = projects.map(project => {
      if (project.id === projectId) {
        const newDesc = project.description.filter((_, i) => i !== index);
        return { ...project, description: newDesc };
      }
      return project;
    });
    onChange(updated);
  };

  const updateTechnologies = (projectId: string, technologies: string) => {
    const techArray = technologies.split(',').map(tech => tech.trim()).filter(tech => tech !== '');
    updateProject(projectId, 'technologies', techArray);
  };

  const removeProject = (id: string) => {
    onChange(projects.filter(project => project.id !== id));
  };

  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <div key={project.id} className="border rounded-lg p-4 space-y-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium">مشروع</h3>
            <button
              onClick={() => removeProject(project.id)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">اسم المشروع</label>
              <input
                type="text"
                value={project.name}
                onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="اسم المشروع"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">التقنيات المستخدمة</label>
              <input
                type="text"
                value={project.technologies?.join(', ') || ''}
                onChange={(e) => updateTechnologies(project.id, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="React, Node.js, MongoDB (مفصولة بفواصل)"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">تاريخ البداية</label>
              <input
                type="month"
                value={project.startDate}
                onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">تاريخ النهاية</label>
              <input
                type="month"
                value={project.endDate}
                onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                disabled={project.current}
                className="w-full px-3 py-2 border rounded-lg disabled:bg-gray-100"
              />
            </div>
            <div className="flex items-center gap-2 mt-7">
              <input
                type="checkbox"
                checked={project.current}
                onChange={(e) => updateProject(project.id, 'current', e.target.checked)}
                id={`current-${project.id}`}
                className="rounded border-gray-300"
              />
              <label htmlFor={`current-${project.id}`} className="text-sm text-gray-600">
                جاري العمل عليه
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1">رابط المشروع</label>
              <div className="relative">
                <LinkIcon size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={project.projectUrl || ''}
                  onChange={(e) => updateProject(project.id, 'projectUrl', e.target.value)}
                  className="w-full pr-10 px-3 py-2 border rounded-lg"
                  placeholder="https://myproject.com"
                />
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm text-gray-600 mb-1">رابط GitHub</label>
              <div className="relative">
                <Github size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="url"
                  value={project.githubUrl || ''}
                  onChange={(e) => updateProject(project.id, 'githubUrl', e.target.value)}
                  className="w-full pr-10 px-3 py-2 border rounded-lg"
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">وصف المشروع</label>
            {project.description.map((desc, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => updateDescription(project.id, idx, e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg"
                  placeholder={`وصف المشروع - النقطة ${idx + 1}`}
                />
                <button
                  onClick={() => removeDescription(project.id, idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addDescription(project.id)}
              className="text-blue-600 text-sm flex items-center gap-1 mt-2"
            >
              <Plus size={16} />
              إضافة نقطة وصف
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addProject}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        إضافة مشروع جديد
      </button>
    </div>
  );
}