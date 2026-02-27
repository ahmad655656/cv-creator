'use client';

import { CVData } from '@/lib/types/template.types';
import { ExecutiveTemplate } from '@/components/templates/professional/Executive';
import { MinimalTemplate } from '@/components/templates/modern/Minimal';
import { CreativeTemplate } from '@/components/templates/modern/Creative';
import { DeveloperTemplate } from '@/components/templates/technical/Developer';
import { Save, Download, Eye } from 'lucide-react';

interface PreviewPanelProps {
  data: CVData;
  template: any;
  onSave: () => void;
  saving: boolean;
}

export function PreviewPanel({ data, template, onSave, saving }: PreviewPanelProps) {
  const renderTemplate = () => {
    switch (template.slug) {
      case 'professional':
        return <ExecutiveTemplate data={data} />;
      case 'modern':
        return <MinimalTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'technical':
        return <DeveloperTemplate data={data} />;
      default:
        return <ExecutiveTemplate data={data} />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Preview Header */}
      <div className="p-4 border-b">
        <h3 className="font-bold text-lg mb-4">معاينة السيرة الذاتية</h3>
        
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'جاري الحفظ...' : 'حفظ'}
          </button>
          
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Download size={18} />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
            <span className="text-sm text-gray-600">معاينة حية</span>
            <Eye size={16} className="text-gray-400" />
          </div>
          
          {/* Template Preview */}
          <div className="transform scale-75 origin-top p-4">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
}