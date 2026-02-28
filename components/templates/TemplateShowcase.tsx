'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Star, Download, CreditCard, Image as ImageIcon, CheckCircle, Eye, X, Plus, Minus } from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { renderPremiumTemplateNode } from '@/components/templates/premium/renderTemplateNode';
import {
  TemplatePdfExporter,
  type TemplatePdfExporterHandle
} from '@/components/templates/TemplatePdfExporter';
import type { TemplateConfig } from '@/lib/types/template-config';

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

const PREVIEW_WIDTH = 840;
const PREVIEW_HEIGHT = 1188;

function useAutoScale(ref: React.RefObject<HTMLElement | null>, padding = 16) {
  const [scale, setScale] = useState(0.35);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const updateScale = () => {
      const width = Math.max(element.clientWidth - padding, 0);
      const height = Math.max(element.clientHeight - padding, 0);
      const nextScale = Math.min(width / PREVIEW_WIDTH, height / PREVIEW_HEIGHT);
      setScale(Number.isFinite(nextScale) ? Math.max(0.2, nextScale) : 0.35);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(element);
    return () => observer.disconnect();
  }, [padding, ref]);

  return scale;
}

function TemplateCardLivePreview({
  slug,
  config,
  zoom = 0.98,
  frameClassName = 'inset-[10px]',
  topOffset = 3
}: {
  slug: string;
  config?: Partial<TemplateConfig> | null;
  zoom?: number;
  frameClassName?: string;
  topOffset?: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const fitScale = useAutoScale(frameRef, 16);
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
      ref={frameRef}
      dir="ltr"
      className="absolute inset-0 overflow-hidden bg-[radial-gradient(circle_at_top,_#f8fafc_0%,_#dbeafe_45%,_#cbd5e1_100%)] dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900"
    >
      <div className={`absolute ${frameClassName} rounded-2xl border border-slate-300/70 dark:border-slate-700/80 shadow-[0_20px_40px_rgba(15,23,42,0.16)] bg-white/85 dark:bg-slate-900/50 backdrop-blur-sm`} />
      <div className={`absolute ${frameClassName} overflow-hidden rounded-2xl`}>
        <div
          className="absolute left-1/2 origin-top pointer-events-none"
          style={{ transform: `translateX(-50%) scale(${fitScale * zoom})`, top: `${topOffset}px`, transformOrigin: 'top center' }}
        >
          <div style={{ width: PREVIEW_WIDTH, minHeight: PREVIEW_HEIGHT, direction: 'ltr' }}>{node}</div>
        </div>
      </div>
    </div>
  );
}

function TemplatePreviewViewport({
  slug,
  config,
  zoom
}: {
  slug: string;
  config?: Partial<TemplateConfig> | null;
  zoom: number;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const fitScale = useAutoScale(viewportRef, 24);
  const node = renderPremiumTemplateNode({ slug, config });

  if (!node) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-500 dark:text-slate-400">
        <ImageIcon size={40} />
      </div>
    );
  }

  return (
    <div ref={viewportRef} className="h-full w-full overflow-auto bg-grid-pattern rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="relative h-full min-h-[720px]">
        <div
          className="absolute left-1/2 top-3 sm:top-5 origin-top"
          style={{ transform: `translateX(-50%) scale(${fitScale * zoom})`, transformOrigin: 'top center' }}
        >
          <div className="bg-white rounded-lg overflow-hidden shadow-[0_30px_75px_rgba(15,23,42,0.25)]" style={{ width: PREVIEW_WIDTH, minHeight: PREVIEW_HEIGHT }}>
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
  const [previewZoom, setPreviewZoom] = useState(1);

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
      <div className="mb-6 sm:mb-8 bg-white/85 dark:bg-gray-900/85 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="ابحث عن قالب..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white min-w-[200px]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'جميع الفئات' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
        {filteredTemplates.map((template) => {
          const isPurchased = purchasedTemplates.has(template.id);
          const isDownloading = downloadingTemplateId === template.id;

          return (
            <article
              key={template.id}
              onClick={() => handleTemplateClick(template)}
              className="group bg-white dark:bg-gray-900 rounded-2xl shadow-[0_16px_45px_rgba(15,23,42,0.14)] overflow-hidden hover:shadow-[0_26px_55px_rgba(15,23,42,0.2)] transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-slate-200 dark:border-slate-800"
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
                  <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white leading-tight">{template.name}</h3>
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
                      setPreviewZoom(1);
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
            </article>
          );
        })}
      </div>

      {previewTemplate && (
        <div className="fixed inset-0 z-[60] bg-slate-950/80 p-2 sm:p-4 md:p-8">
          <div className="h-full w-full max-w-7xl mx-auto bg-white dark:bg-gray-950 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
            <div className="h-14 px-3 sm:px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
              <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                معاينة القالب - {previewTemplate.name}
              </h3>

              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setPreviewZoom((z) => Math.max(0.7, Number((z - 0.1).toFixed(2))))}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  aria-label="Zoom out"
                >
                  <Minus size={16} />
                </button>
                <span className="text-xs w-14 text-center text-slate-600 dark:text-slate-300">{Math.round(previewZoom * 100)}%</span>
                <button
                  onClick={() => setPreviewZoom((z) => Math.min(1.35, Number((z + 0.1).toFixed(2))))}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  aria-label="Zoom in"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="h-[calc(100%-56px)] bg-slate-100 dark:bg-slate-900 p-2 sm:p-4">
              <TemplatePreviewViewport slug={previewTemplate.slug} config={previewTemplate.config} zoom={previewZoom} />
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

