'use client';

import { CVData, TemplateConfig, EditableElement } from '../types';
import { useRef, useState, useEffect } from 'react';
import { Maximize2, Minimize2, Eye, Download } from 'lucide-react';

interface LivePreviewProps {
  cvData: CVData;
  templateConfig: TemplateConfig;
  elements?: EditableElement[];
}

export function LivePreview({ cvData, templateConfig, elements }: LivePreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel] = useState(1);
  const [pan] = useState({ x: 0, y: 0 });
  const [renderKey, setRenderKey] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    setRenderKey((prev) => prev + 1);
  }, [elements]);

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);

      const response = await fetch('/api/cvs/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData,
          templateSlug: 'executive',
          templateConfig
        })
      });

      if (!response.ok) {
        throw new Error('فشل إنشاء ملف PDF');
      }

      const blob = await response.blob();
      const safeName =
        (cvData.personalInfo.fullName || 'CV').replace(/[\\/:*?"<>|]/g, '-').trim() || 'CV';
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safeName}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const renderCVDataPreview = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: templateConfig.spacing.sectionGap }}>
        <h1 style={{ fontFamily: templateConfig.fonts.heading, color: templateConfig.colors.heading }}>
          {cvData.personalInfo.fullName}
        </h1>
        <p style={{ color: templateConfig.colors.secondary }}>{cvData.personalInfo.jobTitle}</p>
      </div>
    </div>
  );

  const renderElementsPreview = () => {
    if (!elements || elements.length === 0) return null;

    return (
      <div style={{ fontFamily: templateConfig.fonts.body }}>
        {elements.map((el) => (
          <div key={el.id} style={el.style} className="mb-2">
            {el.type === 'heading' && <h2>{el.content}</h2>}
            {el.type === 'paragraph' && <p>{el.content}</p>}
            {el.type === 'text' && <span>{el.content}</span>}
            {el.type === 'image' && (
              <img src={el.content} alt="" style={{ maxWidth: '100%', height: 'auto' }} />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      key={renderKey}
      className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md flex flex-col ${
        isFullscreen ? 'fixed inset-0 z-50 m-4' : 'w-96'
      }`}
    >
      <div className="p-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Eye size={16} className="text-blue-600" />
          معاينة حية
        </h3>

        <div className="flex items-center gap-1">
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className={`flex items-center gap-1 px-3 py-1 text-sm rounded-md transition ${
              isExporting
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            title="تصدير السيرة الذاتية كـ PDF"
          >
            <Download size={14} />
            <span>{isExporting ? 'جاري...' : 'تصدير'}</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            title={isFullscreen ? 'تصغير' : 'تكبير'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 bg-gray-100 dark:bg-gray-950">
        <div
          ref={containerRef}
          style={{
            transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: '0 0',
            transition: 'transform 0.2s ease',
            height: '100%',
            width: '100%'
          }}
        >
          <div
            ref={printRef}
            style={{
              fontFamily: templateConfig.fonts.body,
              color: templateConfig.colors.text,
              backgroundColor: templateConfig.colors.background,
              padding: templateConfig.spacing.padding,
              borderRadius: '8px',
              width: isFullscreen ? '960px' : '100%',
              margin: '0 auto',
              minHeight: '100%',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
          >
            {elements && elements.length > 0 ? renderElementsPreview() : renderCVDataPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}
