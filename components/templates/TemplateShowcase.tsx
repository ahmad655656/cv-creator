'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Star, ShoppingCart, CreditCard, Image as ImageIcon, CheckCircle, Eye, X, KeyRound } from 'lucide-react';
import { PaymentModal } from './PaymentModal';
import { SecretCvFormModal } from './SecretCvFormModal';
import { renderPremiumTemplateNode } from '@/components/templates/premium/renderTemplateNode';
import {
  TemplatePdfExporter,
  type TemplatePdfExporterHandle
} from '@/components/templates/TemplatePdfExporter';
import type { TemplateConfig } from '@/lib/types/template-config';
import type { CVData } from '@/components/cvs/types';
import { isAllowedPremiumSlug, normalizeTemplateSlug } from '@/lib/templates/allowedPremiumSlugs';

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
  purchases: number;
}

interface TemplateShowcaseProps {
  templates: Template[];
  purchasedTemplates: Set<number>;
  userId: number;
}

const PREVIEW_WIDTH = 840;
const PREVIEW_HEIGHT = 1188;
const MINIMAL_NORDIC_CARD_IMAGE = '/Minimal Nordic.jpg';
const SALES_STAR_CARD_IMAGE = '/SalesStar.jpg';
const RICHARD_CARD_IMAGE = '/richard.jpg';
const ANDREEMAAS_CARD_IMAGE = '/andree.png';
const JULIANA_SILVA_CARD_IMAGE = '/julianaSilva.png';
const PRODUCT_LEAD_CARD_IMAGE = '/ProductLead.png';
const ALIDA_PLANET_CARD_IMAGE = '/emmajames.jpg';

function normalizeSlug(slug: string) {
  return normalizeTemplateSlug(slug);
}

function getTemplateCardImage(slug: string) {
  const normalizedSlug = normalizeSlug(slug);
  if (normalizedSlug === 'minimalnordic') return MINIMAL_NORDIC_CARD_IMAGE;
  if (normalizedSlug === 'salesstar') return SALES_STAR_CARD_IMAGE;
  if (normalizedSlug === 'richard') return RICHARD_CARD_IMAGE;
  if (normalizedSlug === 'productlead') return PRODUCT_LEAD_CARD_IMAGE;
  if (normalizedSlug === 'andreemas') return ANDREEMAAS_CARD_IMAGE;
  if (normalizedSlug === 'julianasilva') return JULIANA_SILVA_CARD_IMAGE;
  if (normalizedSlug === 'alidaplanet') return ALIDA_PLANET_CARD_IMAGE;
  return undefined;
}

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
  staticImageSrc,
  zoom = 0.98,
  frameClassName = 'inset-[10px]',
  topOffset = 3
}: {
  slug: string;
  config?: Partial<TemplateConfig> | null;
  staticImageSrc?: string;
  zoom?: number;
  frameClassName?: string;
  topOffset?: number;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const fitScale = useAutoScale(frameRef, 16);
  const node = renderPremiumTemplateNode({ slug, config });

  if (staticImageSrc) {
    return (
      <div dir="ltr" className="h-full w-full bg-[#f3f5f7] p-0.5">
        <div className="h-full w-full overflow-hidden rounded-[12px] border border-slate-200/70 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.1)]">
          <img
            src={staticImageSrc}
            alt={`${slug} template preview`}
            className="w-full h-full object-contain object-center bg-white"
            draggable={false}
          />
        </div>
      </div>
    );
  }

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

function downloadPdfFromUrl(url: string, fileName: string) {
  const safeName = (fileName || 'template').replace(/[\\/:*?"<>|]/g, '-').trim() || 'template';
  const link = document.createElement('a');
  link.href = url;
  link.download = `${safeName}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function PdfPreviewModal({
  open,
  fileUrl,
  fileName,
  onClose
}: {
  open: boolean;
  fileUrl: string | null;
  fileName: string;
  onClose: () => void;
}) {
  if (!open || !fileUrl) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/85 p-2 sm:p-4 md:p-6">
      <div className="h-full w-full max-w-6xl mx-auto bg-white dark:bg-gray-950 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <div className="h-14 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
            معاينة PDF - {fileName}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => downloadPdfFromUrl(fileUrl, fileName)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              تحميل PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="h-[calc(100%-56px)] bg-slate-100 dark:bg-slate-900">
          <iframe title="PDF Preview" src={fileUrl} className="h-full w-full border-0" />
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
  const [secretTemplate, setSecretTemplate] = useState<Template | null>(null);
  const [templateDataOverrides, setTemplateDataOverrides] = useState<Record<string, CVData>>({});
  const [downloadedPdfUrl, setDownloadedPdfUrl] = useState<string | null>(null);
  const [downloadedPdfName, setDownloadedPdfName] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [downloadingTemplateId, setDownloadingTemplateId] = useState<number | null>(null);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    return () => {
      if (downloadedPdfUrl) URL.revokeObjectURL(downloadedPdfUrl);
    };
  }, [downloadedPdfUrl]);

  const visibleTemplates = templates.filter((template) => isAllowedPremiumSlug(template.slug));
  const categories = ['all', ...new Set(visibleTemplates.map((t) => t.category))];
  const filteredTemplates = visibleTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filter === 'all' || template.category === filter;
    return matchesSearch && matchesCategory;
  });

  const handleTemplateDownload = async (template: Template, data?: CVData, previewBeforeDownload = false) => {
    try {
      setDownloadingTemplateId(template.id);
      if (!pdfExporterRef.current) throw new Error('PDF exporter is not ready');
      const normalizedSlug = normalizeSlug(template.slug);
      const exportData = data || templateDataOverrides[normalizedSlug];
      if (previewBeforeDownload) {
        const blob = await pdfExporterRef.current.generateTemplatePdfBlob({
          id: template.id,
          name: template.name,
          slug: template.slug,
          config: template.config,
          pageTier: template.config?.pageTier || (template.category === 'Two Pages' ? 'two-page' : 'one-page'),
          data: exportData
        });
        if (downloadedPdfUrl) URL.revokeObjectURL(downloadedPdfUrl);
        const nextUrl = URL.createObjectURL(blob);
        setDownloadedPdfUrl(nextUrl);
        setDownloadedPdfName(template.name);
      } else {
        await pdfExporterRef.current.exportTemplate({
          id: template.id,
          name: template.name,
          slug: template.slug,
          config: template.config,
          pageTier: template.config?.pageTier || (template.category === 'Two Pages' ? 'two-page' : 'one-page'),
          data: exportData
        });
      }
    } catch (error) {
      console.error('Download template error:', error);
      const message = error instanceof Error ? error.message : 'تعذر تحميل ملف PDF. حاول مرة أخرى.';
      alert(message);
    } finally {
      setDownloadingTemplateId(null);
    }
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

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        {filteredTemplates.map((template) => {
          const isPurchased = purchasedTemplates.has(template.id);
          const isDownloading = downloadingTemplateId === template.id;

          return (
            <article
              key={template.id}
              className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800/90 shadow-[0_4px_16px_rgba(15,23,42,0.08)] hover:shadow-[0_10px_26px_rgba(15,23,42,0.14)] transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-[210/297] bg-[#f3f5f7] dark:bg-slate-800 overflow-hidden">
                <TemplateCardLivePreview
                  slug={template.slug}
                  config={template.config}
                  staticImageSrc={getTemplateCardImage(template.slug)}
                />

                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/28 to-transparent pointer-events-none" />

                {template.is_premium && (
                  <div className="absolute top-2 right-2 bg-amber-50/95 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                    <Crown size={12} />
                    Premium
                  </div>
                )}

                {isPurchased && (
                  <div className="absolute top-2 left-2 bg-emerald-600/95 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-sm">
                    <CheckCircle size={11} />
                    Owned
                  </div>
                )}

                {!isPurchased && (
                  <div className="absolute bottom-2 left-2 bg-blue-600/95 text-white px-2 py-0.5 rounded-full text-[11px] font-semibold shadow-sm">
                    {formatNumber(template.price)} ل.س
                  </div>
                )}
              </div>

              <div className="p-3.5">
                <div className="flex justify-between items-start mb-1.5 gap-2">
                  <h3 className="font-semibold text-[13px] sm:text-[14px] text-slate-900 dark:text-slate-100 leading-tight">{template.name}</h3>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-full shrink-0 border border-amber-100 dark:border-amber-900/40">
                    <Star size={11} className="text-amber-500 fill-amber-500" />
                    <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400">
                      {formatNumber(template.rating || 4.5)}
                    </span>
                  </div>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-[11px] mb-2.5 line-clamp-2">{template.description}</p>

                <div className="flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    {template.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                    <ShoppingCart size={12} />
                    <span>{formatNumber(template.purchases || 0)}</span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template);
                    }}
                    className="w-full py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-[11px]"
                  >
                    <Eye size={14} />
                    معاينة
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPurchased) {
                        setSecretTemplate(template);
                      } else {
                        setSelectedTemplate(template);
                        setShowPaymentModal(true);
                      }
                    }}
                    disabled={isDownloading}
                    className={`w-full py-1.5 rounded-lg font-medium transition flex items-center justify-center gap-1.5 text-[11px] ${
                      isPurchased
                        ? 'bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-60 disabled:cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isPurchased ? (
                      <>
                        <KeyRound size={14} />
                        فتح النموذج
                      </>
                    ) : (
                      <>
                        <CreditCard size={14} />
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
                  onClick={() => setPreviewTemplate(null)}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="h-[calc(100%-56px)] bg-slate-100 dark:bg-slate-900 p-2 sm:p-4">
              <TemplateCardLivePreview
                slug={previewTemplate.slug}
                config={previewTemplate.config}
                staticImageSrc={getTemplateCardImage(previewTemplate.slug)}
                zoom={1}
                frameClassName="inset-[8px] sm:inset-[14px]"
                topOffset={0}
              />
            </div>
          </div>
        </div>
      )}

      {secretTemplate && (
        <SecretCvFormModal
          template={{ id: secretTemplate.id, name: secretTemplate.name, slug: secretTemplate.slug }}
          open={Boolean(secretTemplate)}
          loading={downloadingTemplateId === secretTemplate.id}
          onClose={() => {
            if (downloadingTemplateId === secretTemplate.id) return;
            setSecretTemplate(null);
          }}
          onSubmit={async (data) => {
            const safeData = JSON.parse(JSON.stringify(data)) as CVData;
            setTemplateDataOverrides((prev) => ({ ...prev, [normalizeSlug(secretTemplate.slug)]: safeData }));
            await handleTemplateDownload(secretTemplate, safeData, true);
            setSecretTemplate(null);
          }}
        />
      )}

      <PdfPreviewModal
        open={Boolean(downloadedPdfUrl)}
        fileUrl={downloadedPdfUrl}
        fileName={downloadedPdfName}
        onClose={() => {
          if (downloadedPdfUrl) URL.revokeObjectURL(downloadedPdfUrl);
          setDownloadedPdfUrl(null);
          setDownloadedPdfName('');
        }}
      />

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
