'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Star, Download, CreditCard, Image as ImageIcon, CheckCircle, Eye, X } from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { renderPremiumTemplateNode } from '@/components/templates/premium/renderTemplateNode';
import {
  TemplatePdfExporter,
  type TemplatePdfExporterHandle
} from '@/components/templates/TemplatePdfExporter';
import type { TemplateConfig } from '@/components/cvs/editor/types/templateConfig';

interface Template {
  id: number;
  name: string;
  slug: string;
  config?: (Partial<TemplateConfig> & { pageTier?: 'one-page' | 'two-page' }) | null;
  description: string;
  category: string;
  thumbnail: string;
  is_premium: boolean;
  price: number;
  rating: number;
  downloads: number;
}

interface TemplateShowcaseProps {
  templates: Template[];
  purchasedTemplates: Set<number>;
  userId: number;
}

function TemplateCardLivePreview({
  slug,
  config,
  scale = 0.42,
  frameClassName = 'inset-[10px]',
  topOffset = 3
}: {
  slug: string;
  config?: Partial<TemplateConfig> | null;
  scale?: number;
  frameClassName?: string;
  topOffset?: number;
}) {
  const node = renderPremiumTemplateNode({ slug, config });

  if (!node) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        <ImageIcon size={48} className="text-gray-400" />
      </div>
    );
  }

  return (
    <div
      dir="ltr"
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#dbeafe_45%,_#cbd5e1_100%)] dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900"
    >
      <div className={`absolute ${frameClassName} rounded-2xl border border-slate-300/70 dark:border-slate-700/80 shadow-[0_20px_40px_rgba(15,23,42,0.16)] bg-white/85 dark:bg-slate-900/50 backdrop-blur-sm`} />
      <div className={`absolute ${frameClassName} overflow-hidden rounded-2xl`}>
        <div className="absolute left-1/2 origin-top pointer-events-none" style={{ transform: 'translateX(-50%)', top: `${topOffset}px` }}>
          <div
            style={{
              width: 840,
              minHeight: 1188,
              transform: `scale(${scale})`,
              transformOrigin: 'top center',
              direction: 'ltr'
            }}
          >
            {node}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplateShowcase({ templates, purchasedTemplates, userId }: TemplateShowcaseProps) {
  void userId;
  const router = useRouter();
  const pdfExporterRef = useRef<TemplatePdfExporterHandle>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [downloadingTemplateId, setDownloadingTemplateId] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const categories = ['all', ...new Set(templates.map((t) => t.category))];
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filter === 'all' || template.category === filter;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateDownload = async (template: Template) => {
    try {
      setDownloadingTemplateId(template.id);
      if (!pdfExporterRef.current) throw new Error('PDF exporter is not ready');
      await pdfExporterRef.current.exportTemplate({
        id: template.id,
        name: template.name,
        slug: template.slug,
        config: template.config,
        pageTier: template.config?.pageTier || (template.category === 'Two Pages' ? 'two-page' : 'one-page')
      });
    } catch (error) {
      console.error('Download template error:', error);
      alert('تعذر تحميل ملف PDF. حاول مرة أخرى.');
    } finally {
      setDownloadingTemplateId(null);
    }
  };

  const handleTemplateClick = (template: Template) => {
    if (purchasedTemplates.has(template.id)) {
      void handleTemplateDownload(template);
      return;
    }
    setSelectedTemplate(template);
    setShowPaymentModal(true);
  };

  const formatNumber = (num: number) => num.toLocaleString('en-US');

  return (
    <>
      <div className="mb-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="ابحث عن قالب..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'جميع الفئات' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => {
          const isPurchased = purchasedTemplates.has(template.id);
          const isDownloading = downloadingTemplateId === template.id;

          return (
            <div
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className="group bg-white dark:bg-gray-900 rounded-2xl shadow-[0_16px_45px_rgba(15,23,42,0.14)] overflow-hidden hover:shadow-[0_26px_55px_rgba(15,23,42,0.2)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative aspect-[210/297] bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <TemplateCardLivePreview slug={template.slug} config={template.config} />

                <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

                {template.is_premium && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Crown size={12} />
                    مميز
                  </div>
                )}

                {isPurchased && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                    <CheckCircle size={12} />
                    مملوك
                  </div>
                )}

                {!isPurchased && (
                  <div className="absolute bottom-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {formatNumber(template.price)} ل.س
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2 gap-3">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{template.name}</h3>
                  <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full shrink-0">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                      {formatNumber(template.rating || 4.5)}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">{template.description}</p>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    {template.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Download size={14} />
                    <span>{formatNumber(template.downloads || 0)}</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template);
                    }}
                    className="w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Eye size={16} />
                    معاينة
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPurchased) {
                        void handleTemplateDownload(template);
                      } else {
                        setSelectedTemplate(template);
                        setShowPaymentModal(true);
                      }
                    }}
                    disabled={isDownloading}
                    className={`w-full py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                      isPurchased
                        ? 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isPurchased ? (
                      <>
                        <Download size={16} />
                        {isDownloading ? 'جاري التحميل...' : 'تحميل PDF'}
                      </>
                    ) : (
                      <>
                        <CreditCard size={16} />
                        شراء القالب
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {previewTemplate && (
        <div className="fixed inset-0 z-[60] bg-black/70 p-3 md:p-8">
          <div className="h-full w-full max-w-6xl mx-auto bg-white dark:bg-gray-950 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="h-14 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-slate-100">
                معاينة القالب - {previewTemplate.name}
              </h3>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                <X size={18} />
              </button>
            </div>
            <div className="h-[calc(100%-56px)] bg-slate-100 dark:bg-slate-900 p-4 md:p-6 overflow-auto">
              <div className="relative mx-auto w-full max-w-[860px] aspect-[210/297] rounded-2xl overflow-hidden border border-slate-300/80 dark:border-slate-700/80 shadow-[0_22px_50px_rgba(15,23,42,0.24)]">
                <TemplateCardLivePreview
                  slug={previewTemplate.slug}
                  config={previewTemplate.config}
                  scale={0.9}
                  frameClassName="inset-[14px]"
                  topOffset={10}
                />
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-semibold bg-black/55 text-white backdrop-blur-sm">
                  Preview only
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && selectedTemplate && (
        <PaymentModal
          template={selectedTemplate}
          userId={userId}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedTemplate(null);
          }}
          onSuccess={() => {
            router.refresh();
          }}
        />
      )}
      <TemplatePdfExporter ref={pdfExporterRef} />
    </>
  );
}
