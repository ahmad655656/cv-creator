'use client';

import { useState } from 'react';
import { Download, Eye, Printer, Share2, ChevronRight, ChevronLeft } from 'lucide-react';
import { ExecutiveTemplate } from '@/components/templates/professional/Executive';
import { MinimalTemplate } from '@/components/templates/modern/Minimal';
import { CreativeTemplate } from '@/components/templates/modern/Creative';
import { DeveloperTemplate } from '@/components/templates/technical/Developer';

interface SharedCVViewProps {
  cv: any;
  template: any;
}

export function SharedCVView({ cv, template }: SharedCVViewProps) {
  const [showSidebar, setShowSidebar] = useState(true);

  const renderTemplate = () => {
    switch (template.slug) {
      case 'professional':
        return <ExecutiveTemplate data={cv.content} />;
      case 'modern':
        return <MinimalTemplate data={cv.content} />;
      case 'creative':
        return <CreativeTemplate data={cv.content} />;
      case 'technical':
        return <DeveloperTemplate data={cv.content} />;
      default:
        return <ExecutiveTemplate data={cv.content} />;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    // هنا يمكن إضافة منطق تحميل PDF
    console.log('Download CV');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // يمكن إضافة إشعار نجاح
  };

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Header - Hidden in print */}
      <div className="bg-white border-b print:hidden sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">السيرة الذاتية</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Eye size={16} />
                <span>{cv.views || 0} مشاهدة</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
              >
                <Printer size={18} />
                طباعة
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Download size={18} />
                تحميل PDF
              </button>
              <button
                onClick={copyLink}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="نسخ رابط المشاركة"
              >
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 print:py-0">
        <div className="flex gap-6 print:block">
          {/* Sidebar Toggle - Hidden in print */}
          {showSidebar && (
            <div className="w-64 print:hidden">
              <div className="bg-white rounded-lg shadow-lg p-4 sticky top-20">
                <h3 className="font-bold mb-4">معلومات السيرة</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">القالب:</span>
                    <span className="mr-2 font-medium">{template.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">تاريخ الإنشاء:</span>
                    <span className="mr-2 font-medium">
                      {new Date(cv.created_at).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">آخر تحديث:</span>
                    <span className="mr-2 font-medium">
                      {new Date(cv.updated_at).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>

                <hr className="my-4" />

                <h3 className="font-bold mb-4">ملخص سريع</h3>
                <div className="space-y-2">
                  {cv.content?.personalInfo?.fullName && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">الاسم:</span>
                      <span>{cv.content.personalInfo.fullName}</span>
                    </div>
                  )}
                  {cv.content?.personalInfo?.jobTitle && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">الوظيفة:</span>
                      <span>{cv.content.personalInfo.jobTitle}</span>
                    </div>
                  )}
                  {cv.content?.experiences?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">الخبرات:</span>
                      <span>{cv.content.experiences.length} خبرة</span>
                    </div>
                  )}
                  {cv.content?.skills?.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">المهارات:</span>
                      <span>{cv.content.skills.length} مهارة</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Toggle Sidebar Button - Hidden in print */}
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-r-lg shadow-lg p-2 border border-gray-200 print:hidden"
          >
            {showSidebar ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

          {/* CV Content */}
          <div className={`flex-1 ${!showSidebar ? 'mr-0' : ''}`}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none">
              {renderTemplate()}
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body { background: white; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-white { background: white !important; }
          .print\\:shadow-none { box-shadow: none !important; }
          .print\\:py-0 { padding-top: 0 !important; padding-bottom: 0 !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
}