'use client';

import {
  memo,
  useRef,
  useCallback,
  useState,
  useEffect,
  useMemo,
  type CSSProperties,
  forwardRef,
  useImperativeHandle
} from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  Tablet,
  Smartphone,
  ZoomIn,
  ZoomOut,
  Eye,
  EyeOff,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Type,
  RotateCcw,
  Grid,
  Layers,
  ChevronUp,
  ChevronDown,
  X,
  Download,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import { Template, CVData } from '../types';
import { TemplateConfig } from '../types/templateConfig';
import { ExecutiveTemplate } from '@/components/templates/ExecutiveTemplate';
import {
  ExecutiveProTemplate,
  TechMasterProTemplate,
  AcademicEliteProTemplate,
  MedicalProTemplate,
  FinanceEliteTemplate,
  LegalExpertTemplate,
  MarketingGuruTemplate,
  ArchitectProTemplate,
  HrProTemplate,
  SalesStarTemplate,
  GlobalEdgeTemplate,
  AuroraPrimeTemplate
} from '@/components/templates/premium/PremiumTemplates';

interface PreviewPanelProps {
  show: boolean;
  width: number;
  zoom: number;
  device: 'desktop' | 'tablet' | 'mobile';
  orientation: 'portrait' | 'landscape';
  background: 'white' | 'gray' | 'dark' | 'mesh';
  showGrid: boolean;
  templateConfig?: TemplateConfig;
  template: Template;
  cvData: CVData;
  sections?: Array<{ id: string; title?: string; enabled: boolean; order: number }>;
  styleOverrides?: Record<string, Record<string, string | number>>;
  sectionStyleOverrides?: Record<string, Record<string, string | number>>;
  selectedElement?: { id: string; style?: Record<string, string | number> } | null;
  onUpdateSelectedStyle?: (style: Record<string, string | number>) => void;
  onSectionStyleChange?: (sectionId: string, style: Record<string, string | number>) => void;
  onSectionStyleReset?: (sectionId: string) => void;
  onClose: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onOrientationToggle: () => void;
  onBackgroundChange: () => void;
  onGridToggle: () => void;
  onDeviceChange: (device: 'desktop' | 'tablet' | 'mobile') => void;
  onResize: (width: number) => void;
  activeSectionId?: string;
  onSectionFocus?: (sectionId: string) => void;
  onSectionToggle?: (sectionId: string) => void;
  onSectionMove?: (sectionId: string, direction: 'up' | 'down') => void;
  onZoomReset?: () => void;
}

const DEMO_PROFILE_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f172a"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
    </defs>
    <rect width="220" height="220" fill="url(#bg)"/>
    <circle cx="110" cy="86" r="36" fill="#f8fafc"/>
    <path d="M34 210c7-36 35-58 76-58s69 22 76 58H34z" fill="#e2e8f0"/>
  </svg>`
)}`;

const DEMO_CV_DATA: CVData = {
  personalInfo: {
    fullName: 'Ahmed Al-Hassan',
    jobTitle: 'Senior Product Manager',
    email: 'ahmed@example.com',
    phone: '+963 944 123 456',
    address: 'Damascus, Syria',
    summary: 'Experienced product leader with a strong track record in scaling digital products and leading cross-functional teams.',
    profileImage: DEMO_PROFILE_IMAGE
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'Nexa Tech',
      position: 'Product Manager',
      location: 'Damascus',
      startDate: '2021',
      endDate: '2024',
      current: false,
      description: ['Led roadmap execution', 'Improved conversion by 28%', 'Built KPI dashboarding process']
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Damascus University',
      degree: 'B.Sc.',
      field: 'Information Systems',
      startDate: '2015',
      endDate: '2019',
      current: false
    }
  ],
  skills: [
    { id: 'skill-1', name: 'Product Strategy', level: 5, category: 'Management' },
    { id: 'skill-2', name: 'Analytics', level: 4, category: 'Data' },
    { id: 'skill-3', name: 'Leadership', level: 5, category: 'Leadership' }
  ],
  languages: [
    { id: 'lang-1', name: 'Arabic', proficiency: 'native' },
    { id: 'lang-2', name: 'English', proficiency: 'fluent' }
  ],
  certifications: [{ id: 'cert-1', name: 'PMP', issuer: 'PMI', date: '2023' }],
  projects: [
    {
      id: 'proj-1',
      name: 'Recruitment Platform',
      role: 'Product Lead',
      description: ['Designed end-to-end candidate journey', 'Reduced time-to-hire by 35%'],
      technologies: ['React', 'Next.js', 'PostgreSQL'],
      startDate: '2023',
      endDate: '',
      current: true
    }
  ]
};

const PreviewPanel = forwardRef<HTMLDivElement, PreviewPanelProps>((props, ref) => {
  const {
    zoom,
    device,
    background,
    showGrid,
    templateConfig,
    template,
    cvData,
    sections,
    styleOverrides,
    sectionStyleOverrides,
    selectedElement,
    onUpdateSelectedStyle,
    onSectionStyleChange,
    onSectionStyleReset,
    onClose,
    onZoomIn,
    onZoomOut,
    onOrientationToggle,
    onBackgroundChange,
    onGridToggle,
    onDeviceChange,
    activeSectionId,
    onSectionFocus,
    onSectionToggle,
    onSectionMove,
    onZoomReset
  } = props;

  const contentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<string>('personal');

  useImperativeHandle(ref, () => contentRef.current as HTMLDivElement);

  const previewData = useMemo<CVData>(() => {
    const sectionVisibility = {
      personal: sections?.find((s) => s.id === 'personal')?.enabled ?? true,
      experience: sections?.find((s) => s.id === 'experience')?.enabled ?? true,
      education: sections?.find((s) => s.id === 'education')?.enabled ?? true,
      skills: sections?.find((s) => s.id === 'skills')?.enabled ?? true,
      languages: sections?.find((s) => s.id === 'languages')?.enabled ?? true,
      certifications: sections?.find((s) => s.id === 'certifications')?.enabled ?? true,
      projects: sections?.find((s) => s.id === 'projects')?.enabled ?? true
    };

    const personal = cvData.personalInfo || ({} as CVData['personalInfo']);
    const hiddenPersonal = {
      fullName: '',
      jobTitle: '',
      email: '',
      phone: '',
      address: '',
      summary: '',
      profileImage: ''
    };

    return {
      personalInfo: sectionVisibility.personal
        ? {
            ...DEMO_CV_DATA.personalInfo,
            ...personal,
            fullName: personal.fullName?.trim() || DEMO_CV_DATA.personalInfo.fullName,
            jobTitle: personal.jobTitle?.trim() || DEMO_CV_DATA.personalInfo.jobTitle,
            email: personal.email?.trim() || DEMO_CV_DATA.personalInfo.email,
            phone: personal.phone?.trim() || DEMO_CV_DATA.personalInfo.phone,
            address: personal.address?.trim() || DEMO_CV_DATA.personalInfo.address,
            summary: personal.summary?.trim() || DEMO_CV_DATA.personalInfo.summary,
            profileImage: personal.profileImage?.trim() || DEMO_CV_DATA.personalInfo.profileImage
          }
        : hiddenPersonal,
      experiences: sectionVisibility.experience
        ? cvData.experiences?.length
          ? cvData.experiences
          : DEMO_CV_DATA.experiences
        : [],
      education: sectionVisibility.education
        ? cvData.education?.length
          ? cvData.education
          : DEMO_CV_DATA.education
        : [],
      skills: sectionVisibility.skills ? (cvData.skills?.length ? cvData.skills : DEMO_CV_DATA.skills) : [],
      languages: sectionVisibility.languages
        ? cvData.languages?.length
          ? cvData.languages
          : DEMO_CV_DATA.languages
        : [],
      certifications: sectionVisibility.certifications
        ? cvData.certifications?.length
          ? cvData.certifications
          : DEMO_CV_DATA.certifications
        : [],
      projects: sectionVisibility.projects
        ? cvData.projects?.length
          ? cvData.projects
          : DEMO_CV_DATA.projects
        : []
    };
  }, [cvData, sections]);
  const sectionOrder = useMemo(
    () =>
      (sections || [])
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((s) => s.id),
    [sections]
  );

  const sectionVisibility = useMemo(
    () => ({
      personal: sections?.find((s) => s.id === 'personal')?.enabled ?? true,
      experience: sections?.find((s) => s.id === 'experience')?.enabled ?? true,
      education: sections?.find((s) => s.id === 'education')?.enabled ?? true,
      skills: sections?.find((s) => s.id === 'skills')?.enabled ?? true,
      languages: sections?.find((s) => s.id === 'languages')?.enabled ?? true,
      certifications: sections?.find((s) => s.id === 'certifications')?.enabled ?? true,
      projects: sections?.find((s) => s.id === 'projects')?.enabled ?? true
    }),
    [sections]
  );

  const renderTemplate = useCallback(() => {
    const normalizedSlug = template.slug.toLowerCase().replace(/[-_\s]/g, '');
    const templateProps = { data: previewData, config: templateConfig, styleOverrides };
    const premiumProps: any = {
      ...templateProps,
      sectionVisibility,
      sectionStyles: sectionStyleOverrides,
      sectionOrder
    };
    const fallbackProps: any = { data: previewData, config: templateConfig };

    switch (normalizedSlug) {
      case 'executive':
      case 'boardroomelite':
        return <ExecutiveProTemplate {...premiumProps} />;
      case 'techmaster':
      case 'startupone':
        return <TechMasterProTemplate {...premiumProps} />;
      case 'academicelite':
        return <AcademicEliteProTemplate {...premiumProps} />;
      case 'medicalpro':
        return <MedicalProTemplate {...premiumProps} />;
      case 'financeelite':
      case 'financequant':
        return <FinanceEliteTemplate {...premiumProps} />;
      case 'legalexpert':
      case 'legalmodern':
        return <LegalExpertTemplate {...premiumProps} />;
      case 'marketingguru':
        return <MarketingGuruTemplate {...premiumProps} />;
      case 'architectpro':
      case 'minimalnordic':
        return <ArchitectProTemplate {...premiumProps} />;
      case 'hrpro':
        return <HrProTemplate {...premiumProps} />;
      case 'salesstar':
        return <SalesStarTemplate {...premiumProps} />;
      case 'globaledge':
      case 'consultingprime':
        return <GlobalEdgeTemplate {...premiumProps} />;
      case 'auroraprime':
      case 'productlead':
        return <AuroraPrimeTemplate {...premiumProps} />;
      default:
        return <ExecutiveTemplate {...fallbackProps} />;
    }
  }, [template.slug, previewData, templateConfig, styleOverrides, sectionVisibility, sectionStyleOverrides, sectionOrder]);

  const previewRootStyle = {
    fontFamily: templateConfig?.fontFamily || 'Cairo',
    fontSize: templateConfig?.fontSize === 'small' ? '12px' : templateConfig?.fontSize === 'large' ? '16px' : '14px',
    lineHeight: templateConfig?.lineHeight || 1.5,
    backgroundColor: templateConfig?.pageColor || '#ffffff',
    borderRadius: templateConfig?.roundedCorners === false ? '0px' : `${templateConfig?.radiusSize || 16}px`,
    border: templateConfig?.showBorders === false ? 'none' : `${templateConfig?.borderWidth || 1}px solid ${(templateConfig?.primaryColor || '#3B82F6')}20`,
    boxShadow: templateConfig?.showShadows === false ? 'none' : '0 10px 30px rgba(0,0,0,0.10)',
    color: templateConfig?.textColor || '#334155'
  } as const;

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const sourceElement = contentRef.current;
      if (!sourceElement) {
        throw new Error('Preview content is not available');
      }

      const safeName = (previewData.personalInfo.fullName || 'CV').replace(/[\\/:*?"<>|]/g, '-').trim() || 'CV';
      const styleTags = Array.from(document.querySelectorAll('style'))
        .map((style) => style.outerHTML)
        .join('\n');
      const linkTags = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .map((link) => link.outerHTML)
        .join('\n');

      const html = `
        <!doctype html>
        <html lang="ar" dir="rtl">
          <head>
            <meta charset="utf-8" />
            <title>${safeName}</title>
            ${linkTags}
            ${styleTags}
            <style>
              @page { size: A4; margin: 0; }
              html, body {
                margin: 0;
                padding: 0;
                background: #ffffff !important;
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
              .pdf-root {
                width: 210mm;
                min-height: 297mm;
                margin: 0 auto;
                background: #ffffff !important;
                overflow: hidden;
              }
              .pdf-root * {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
            </style>
          </head>
          <body>
            <div class="pdf-root">${sourceElement.innerHTML}</div>
          </body>
        </html>
      `;

      const waitForAssets = async (doc: Document) => {
        const images = Array.from(doc.images || []);
        await Promise.all(
          images.map(
            (img) =>
              new Promise<void>((resolve) => {
                if (img.complete) {
                  resolve();
                  return;
                }
                img.onload = () => resolve();
                img.onerror = () => resolve();
              })
          )
        );
        if (doc.fonts) {
          await doc.fonts.ready;
        }
      };

      const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=1200,height=900');

      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        await waitForAssets(printWindow.document);
        printWindow.focus();
        printWindow.print();

        const closeWindow = () => {
          try {
            printWindow.close();
          } catch {
            // no-op
          }
        };
        printWindow.addEventListener('afterprint', closeWindow, { once: true });
        setTimeout(closeWindow, 2000);
      } else {
        // Fallback for browsers that block window.open popups
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.setAttribute('aria-hidden', 'true');
        document.body.appendChild(iframe);

        const frameDoc = iframe.contentDocument;
        const frameWindow = iframe.contentWindow;
        if (!frameDoc || !frameWindow) {
          document.body.removeChild(iframe);
          throw new Error('Print iframe is not available');
        }

        frameDoc.open();
        frameDoc.write(html);
        frameDoc.close();
        await waitForAssets(frameDoc);

        frameWindow.focus();
        frameWindow.print();

        const cleanup = () => {
          try {
            document.body.removeChild(iframe);
          } catch {
            // no-op
          }
        };
        frameWindow.addEventListener('afterprint', cleanup, { once: true });
        setTimeout(cleanup, 2500);
      }
    } catch (error) {
      console.error('خطأ في تصدير PDF:', error);
      alert('فشل التصدير. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsExporting(false);
    }
  };

  const canStyleSelected = Boolean(selectedElement && onUpdateSelectedStyle);
  const selectedStyle = selectedElement?.style || {};
  const selectedFontSize = Number.parseInt(String(selectedStyle.fontSize || '16'), 10) || 16;
  
  const applySelectedStyle = (updates: Record<string, string | number>) => {
    if (!canStyleSelected || !onUpdateSelectedStyle) return;
    onUpdateSelectedStyle(updates);
  };

  const viewportBaseScale = device === 'mobile' ? 0.74 : device === 'tablet' ? 0.82 : 0.9;
  const effectivePreviewScale = zoom * viewportBaseScale;
  
  const sectionMeta = useMemo(() => {
    const fallbackNames: Record<string, string> = {
      personal: 'Personal',
      experience: 'Experience',
      education: 'Education',
      skills: 'Skills',
      languages: 'Languages',
      certifications: 'Certifications',
      projects: 'Projects'
    };
    return (sections || [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((section) => ({
        ...section,
        name: section.title || fallbackNames[section.id] || section.id
      }));
  }, [sections]);
  
  useEffect(() => {
    if (activeSectionId) {
      setEditingSectionId(activeSectionId);
      return;
    }
    if (!editingSectionId && sectionMeta[0]) {
      setEditingSectionId(sectionMeta[0].id);
    }
  }, [activeSectionId, editingSectionId, sectionMeta]);
  
  const currentSectionStyle = sectionStyleOverrides?.[editingSectionId] || {};
  
  const parsePx = (value: unknown, fallback: number) => {
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    const parsed = Number.parseInt(String(value || ''), 10);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  
  const sanitizeColor = (value: unknown, fallback: string) => {
    const raw = String(value || '').trim();
    return /^#[0-9a-fA-F]{6}$/.test(raw) ? raw : fallback;
  };
  
  const applySectionStyle = (updates: Record<string, string | number>) => {
    if (!editingSectionId || !onSectionStyleChange) return;
    onSectionStyleChange(editingSectionId, updates);
  };

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      className="relative h-full w-full bg-[#f8fafc] dark:bg-[#09090b] border-r border-gray-200 dark:border-white/5 flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.1)] z-40"
      style={{ width: '100%' }}
    >
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
            <Maximize2 size={18} className="text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold dark:text-white uppercase tracking-tight">Live Preview</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">Live</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
            <button onClick={onZoomOut} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg transition text-gray-500">
              <ZoomOut size={15} />
            </button>
            <span className="text-[11px] font-bold w-12 text-center text-gray-600 dark:text-gray-400">{Math.round(zoom * 100)}%</span>
            <button
              onClick={onZoomReset}
              className="px-2 py-1 text-[11px] font-bold text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 rounded-md transition"
            >
              100%
            </button>
            <button onClick={onZoomIn} className="p-1.5 hover:bg-white dark:hover:bg-white/10 rounded-lg transition text-gray-500">
              <ZoomIn size={15} />
            </button>
          </div>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white dark:text-black text-white rounded-xl text-xs font-bold hover:scale-105 transition-all shadow-xl"
            disabled={isExporting}
          >
            {isExporting ? <RefreshCw size={14} className="animate-spin" /> : <Download size={14} />}
            تصدير
          </button>

          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-500 transition">
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="px-4 pb-2 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 overflow-x-auto">
        <div className="min-w-max flex items-center gap-1.5 rounded-xl bg-gray-100/80 dark:bg-white/5 px-2 py-1.5 border border-gray-200 dark:border-white/10">
          <span className="text-[10px] px-2 py-1 rounded-md bg-blue-600 text-white font-bold tracking-wide">PDF PRO</span>
          <span className="text-[11px] text-gray-500 px-2">
            {canStyleSelected ? `تعديل: ${selectedElement?.id}` : 'تخصيص العناصر والمقاطع عبر الأزرار أعلاه'}
          </span>

          <div className="w-px h-6 bg-gray-300 dark:bg-white/15 mx-1" />

          <button
            onClick={() => applySelectedStyle({ direction: 'ltr', textAlign: 'left' })}
            disabled={!canStyleSelected}
            className="px-2 py-1 text-[11px] rounded-md hover:bg-white dark:hover:bg-white/10 disabled:opacity-40"
          >
            LTR
          </button>
          <button
            onClick={() => applySelectedStyle({ direction: 'rtl', textAlign: 'right' })}
            disabled={!canStyleSelected}
            className="px-2 py-1 text-[11px] rounded-md hover:bg-white dark:hover:bg-white/10 disabled:opacity-40"
          >
            RTL
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-white/15 mx-1" />

          <button
            onClick={() => applySelectedStyle({ fontWeight: selectedStyle.fontWeight === 'bold' ? 'normal' : 'bold' })}
            disabled={!canStyleSelected}
            className={`p-2 rounded-md disabled:opacity-40 ${
              selectedStyle.fontWeight === 'bold'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                : 'hover:bg-white dark:hover:bg-white/10'
            }`}
          >
            <Bold size={14} />
          </button>
          <button
            onClick={() => applySelectedStyle({ fontStyle: selectedStyle.fontStyle === 'italic' ? 'normal' : 'italic' })}
            disabled={!canStyleSelected}
            className={`p-2 rounded-md disabled:opacity-40 ${
              selectedStyle.fontStyle === 'italic'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                : 'hover:bg-white dark:hover:bg-white/10'
            }`}
          >
            <Italic size={14} />
          </button>
          <button
            onClick={() =>
              applySelectedStyle({
                textDecoration: selectedStyle.textDecoration === 'underline' ? 'none' : 'underline'
              })
            }
            disabled={!canStyleSelected}
            className={`p-2 rounded-md disabled:opacity-40 ${
              selectedStyle.textDecoration === 'underline'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                : 'hover:bg-white dark:hover:bg-white/10'
            }`}
          >
            <Underline size={14} />
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-white/15 mx-1" />

          <button
            onClick={() => applySelectedStyle({ textAlign: 'left' })}
            disabled={!canStyleSelected}
            className={`p-2 rounded-md disabled:opacity-40 ${
              selectedStyle.textAlign === 'left'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                : 'hover:bg-white dark:hover:bg-white/10'
            }`}
          >
            <AlignLeft size={14} />
          </button>
          <button
            onClick={() => applySelectedStyle({ textAlign: 'center' })}
            disabled={!canStyleSelected}
            className={`p-2 rounded-md disabled:opacity-40 ${
              selectedStyle.textAlign === 'center'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                : 'hover:bg-white dark:hover:bg-white/10'
            }`}
          >
            <AlignCenter size={14} />
          </button>
          <button
            onClick={() => applySelectedStyle({ textAlign: 'right' })}
            disabled={!canStyleSelected}
            className={`p-2 rounded-md disabled:opacity-40 ${
              selectedStyle.textAlign === 'right'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                : 'hover:bg-white dark:hover:bg-white/10'
            }`}
          >
            <AlignRight size={14} />
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-white/15 mx-1" />

          <button
            onClick={() => applySelectedStyle({ fontSize: `${Math.max(8, selectedFontSize - 2)}px` })}
            disabled={!canStyleSelected}
            className="p-2 rounded-md hover:bg-white dark:hover:bg-white/10 disabled:opacity-40"
          >
            <ZoomOut size={14} />
          </button>
          <div className="flex items-center gap-1 px-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
            <Type size={13} />
            <span>{selectedFontSize}px</span>
          </div>
          <button
            onClick={() => applySelectedStyle({ fontSize: `${Math.min(72, selectedFontSize + 2)}px` })}
            disabled={!canStyleSelected}
            className="p-2 rounded-md hover:bg-white dark:hover:bg-white/10 disabled:opacity-40"
          >
            <ZoomIn size={14} />
          </button>

          <div className="w-px h-6 bg-gray-300 dark:bg-white/15 mx-1" />

          <input
            type="color"
            value={String(selectedStyle.color || '#111827')}
            onChange={(e) => applySelectedStyle({ color: e.target.value })}
            disabled={!canStyleSelected}
            className="h-8 w-9 rounded-md border border-gray-300 dark:border-white/20 bg-transparent disabled:opacity-40"
          />
        </div>
      </div>

      {sectionMeta.length > 0 && (
        <div className="px-4 pb-3 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 overflow-x-auto">
          <div className="min-w-max flex items-center gap-2 rounded-xl bg-gray-100/80 dark:bg-white/5 px-2 py-1.5 border border-gray-200 dark:border-white/10">
            <span className="text-[10px] px-2 py-1 rounded-md bg-gray-900 text-white dark:bg-white dark:text-black font-bold tracking-wide">
              المقاطع
            </span>
            {sectionMeta.map((section) => {
              const isActive = (activeSectionId || editingSectionId) === section.id;
              return (
                <div
                  key={section.id}
                  className={`inline-flex items-center rounded-lg border transition ${
                    isActive
                      ? 'border-blue-300 bg-blue-50 dark:border-blue-500/40 dark:bg-blue-500/10'
                      : 'border-gray-200 dark:border-white/10 bg-white/90 dark:bg-white/5'
                  }`}
                >
                  <button
                    onClick={() => {
                      setEditingSectionId(section.id);
                      onSectionFocus?.(section.id);
                    }}
                    className={`px-3 py-1.5 text-[11px] font-semibold rounded-l-lg transition ${
                      isActive
                        ? 'text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/10'
                    }`}
                  >
                    {section.name}
                  </button>
                  <div className="flex items-center border-l border-gray-200 dark:border-white/10">
                    <button
                      onClick={() => onSectionMove?.(section.id, 'up')}
                      className="px-1.5 py-1.5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10"
                      title="تحريك لأعلى"
                    >
                      <ChevronUp size={12} />
                    </button>
                    <button
                      onClick={() => onSectionMove?.(section.id, 'down')}
                      className="px-1.5 py-1.5 text-gray-500 hover:bg-gray-50 dark:hover:bg-white/10"
                      title="تحريك لأسفل"
                    >
                      <ChevronDown size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => onSectionToggle?.(section.id)}
                    className={`px-2 py-1.5 rounded-r-lg border-l border-gray-200 dark:border-white/10 transition ${
                      section.enabled
                        ? 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10'
                        : 'text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'
                    }`}
                    title={section.enabled ? 'إخفاء المقطع' : 'إظهار المقطع'}
                  >
                    {section.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {sectionMeta.length > 0 && (
        <div className="px-4 pb-3 bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-xl bg-gray-100/80 dark:bg-white/5 px-2 py-2 border border-gray-200 dark:border-white/10">
            <label className="text-[10px] text-gray-500 px-1">
              المقطع
              <select
                value={editingSectionId}
                onChange={(e) => {
                  setEditingSectionId(e.target.value);
                  onSectionFocus?.(e.target.value);
                }}
                className="mt-1 w-full rounded-md bg-white dark:bg-black/30 border border-gray-300 dark:border-white/15 text-xs px-2 py-1"
              >
                {sectionMeta.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-[10px] text-gray-500 px-1">
              لون النص
              <input
                type="color"
                value={sanitizeColor(currentSectionStyle.color, '#0f172a')}
                onChange={(e) => applySectionStyle({ color: e.target.value })}
                className="mt-1 h-8 w-full rounded-md border border-gray-300 dark:border-white/20 bg-transparent"
              />
            </label>
            <label className="text-[10px] text-gray-500 px-1">
              لون الخلفية
              <input
                type="color"
                value={sanitizeColor(currentSectionStyle.backgroundColor, '#ffffff')}
                onChange={(e) => applySectionStyle({ backgroundColor: e.target.value })}
                className="mt-1 h-8 w-full rounded-md border border-gray-300 dark:border-white/20 bg-transparent"
              />
            </label>
            <label className="text-[10px] text-gray-500 px-1">
              لون الحدود
              <input
                type="color"
                value={sanitizeColor(currentSectionStyle.borderColor, '#cbd5e1')}
                onChange={(e) => applySectionStyle({ borderColor: e.target.value })}
                className="mt-1 h-8 w-full rounded-md border border-gray-300 dark:border-white/20 bg-transparent"
              />
            </label>
            <label className="text-[10px] text-gray-500 px-1 col-span-1 md:col-span-2">
              حجم الخط {parsePx(currentSectionStyle.fontSize, 14)}px
              <input
                type="range"
                min={11}
                max={24}
                value={parsePx(currentSectionStyle.fontSize, 14)}
                onChange={(e) => applySectionStyle({ fontSize: `${e.target.value}px` })}
                className="mt-1 w-full"
              />
            </label>
            <label className="text-[10px] text-gray-500 px-1 col-span-1">
              الحشو {parsePx(currentSectionStyle.padding, 0)}px
              <input
                type="range"
                min={0}
                max={36}
                value={parsePx(currentSectionStyle.padding, 0)}
                onChange={(e) => applySectionStyle({ padding: `${e.target.value}px` })}
                className="mt-1 w-full"
              />
            </label>
            <label className="text-[10px] text-gray-500 px-1 col-span-1">
              نصف القطر {parsePx(currentSectionStyle.borderRadius, 0)}px
              <input
                type="range"
                min={0}
                max={30}
                value={parsePx(currentSectionStyle.borderRadius, 0)}
                onChange={(e) => applySectionStyle({ borderRadius: `${e.target.value}px` })}
                className="mt-1 w-full"
              />
            </label>
            <label className="text-[10px] text-gray-500 px-1 col-span-1">
              عرض الحدود {parsePx(currentSectionStyle.borderWidth, 0)}px
              <input
                type="range"
                min={0}
                max={4}
                value={parsePx(currentSectionStyle.borderWidth, 0)}
                onChange={(e) => applySectionStyle({ borderWidth: `${e.target.value}px`, borderStyle: 'solid' })}
                className="mt-1 w-full"
              />
            </label>
            <div className="col-span-1 flex items-end">
              <button
                onClick={() =>
                  applySectionStyle({
                    boxShadow:
                      String(currentSectionStyle.boxShadow || 'none') === 'none'
                        ? '0 8px 24px rgba(15,23,42,0.16)'
                        : 'none'
                  })
                }
                className="w-full h-8 rounded-md border border-gray-300 dark:border-white/15 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-white/10"
              >
                ظل
              </button>
            </div>
            <div className="col-span-2 md:col-span-1 flex items-end">
              <button
                onClick={() => onSectionStyleReset?.(editingSectionId)}
                className="w-full h-8 rounded-md border border-rose-300 text-rose-600 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-900/20"
              >
                إعادة تعيين
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-xl p-1.5 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 z-50">
        {[
          { id: 'desktop', icon: Monitor },
          { id: 'tablet', icon: Tablet },
          { id: 'mobile', icon: Smartphone }
        ].map((d) => (
          <button
            key={d.id}
            onClick={() => onDeviceChange(d.id as 'desktop' | 'tablet' | 'mobile')}
            className={`p-2.5 rounded-xl transition-all ${device === d.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
          >
            <d.icon size={18} />
          </button>
        ))}
        <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1" />
        <button onClick={onOrientationToggle} className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition">
          <RotateCcw size={18} />
        </button>
        <button onClick={onGridToggle} className={`p-2.5 rounded-xl transition ${showGrid ? 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'text-gray-400'}`}>
          <Grid size={18} />
        </button>
        <button onClick={onBackgroundChange} className="p-2.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition">
          <Layers size={18} />
        </button>
      </div>

      <div
        className={`flex-1 overflow-auto relative custom-scrollbar p-0 flex justify-center items-center transition-colors duration-500 ${
          background === 'mesh'
            ? 'bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#ffffff10_1px,transparent_1px)]'
            : background === 'dark'
              ? 'bg-[#09090b]'
              : 'bg-[#f8fafc] dark:bg-[#121214]'
        }`}
      >
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent [background-image:linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] [background-size:40px_40px]" />
        )}

        <motion.div
          animate={{
            width: '100%',
            height: '100%',
            scale: effectivePreviewScale
          }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          style={{ transformOrigin: 'center center' }}
          className="relative group w-full h-full max-w-full max-h-full"
        >
          <div className="absolute inset-0 bg-black/5 blur-[40px] rounded-2xl -z-10 translate-y-8" />

          <div ref={contentRef} className="w-full h-full overflow-auto" style={previewRootStyle}>
            <div
              style={
                {
                  width: '100%',
                  minHeight: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 0,
                  margin: 0,
                  '--cv-primary': templateConfig?.primaryColor || '#3B82F6',
                  '--cv-secondary': templateConfig?.secondaryColor || '#6366F1'
                } as CSSProperties
              }
            >
              {renderTemplate()}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
});

PreviewPanel.displayName = 'PreviewPanel';
export default memo(PreviewPanel);
