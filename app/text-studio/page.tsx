'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type CollectionKey =
  | 'royal_imperial'
  | 'gothic_dark_luxury'
  | 'arabic_luxury'
  | 'modern_fashion'
  | 'cyber_futuristic'
  | 'cinematic_branding'
  | 'ultra_minimal_luxury'
  | 'signature_branding';
type Rarity = 'elite' | 'legendary' | 'imperial';
type FilterCollection = CollectionKey | 'all';
type FilterRarity = Rarity | 'all';
type المشروعPreset = 'brand_logo' | 'signature' | 'social' | 'cinematic' | 'arabic_identity';
type PreviewTheme = 'ivory_gold' | 'obsidian';
type TemplateMeta = { id: string; name: string; category: string; collection: CollectionKey; rarity: Rarity };
type ApplyResult = { templateId: string; originalText: string; decoratedText: string; category: string; collection: CollectionKey; rarity: Rarity };
type LogoShape = { symbol: string; x: number; y: number; size: number; opacity: number };

const COLLECTION_ORDER: CollectionKey[] = [
  'royal_imperial',
  'gothic_dark_luxury',
  'arabic_luxury',
  'modern_fashion',
  'cyber_futuristic',
  'cinematic_branding',
  'ultra_minimal_luxury',
  'signature_branding'
];

const COLLECTION_LABELS: Record<CollectionKey, string> = {
  royal_imperial: 'ملكي / إمبراطوري',
  gothic_dark_luxury: 'قوطي / فخامة داكنة',
  arabic_luxury: 'فخامة عربية',
  modern_fashion: 'حديث / أزياء',
  cyber_futuristic: 'سيبراني / مستقبلي',
  cinematic_branding: 'هوية سينمائية',
  ultra_minimal_luxury: 'فخامة مينيمال',
  signature_branding: 'توقيع / هوية شخصية'
};

const PRESET_LABELS: Record<المشروعPreset, string> = {
  brand_logo: 'شعار علامة',
  signature: 'توقيع شخصي',
  social: 'اسم مستخدم اجتماعي',
  cinematic: 'عنوان سينمائي',
  arabic_identity: 'هوية عربية'
};

function toCssUrl(raw: string): string {
  const cleaned = raw.trim();
  if (!cleaned) return '';
  try {
    const u = new URL(cleaned);
    if (u.hostname.includes('fonts.google.com') && u.pathname.includes('/specimen/')) {
      const family = (u.pathname.split('/specimen/')[1] || '').split('/')[0];
      if (family) return `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;700;900&display=swap`;
    }
    return cleaned;
  } catch {
    return cleaned;
  }
}

function esc(v: string): string {
  return v.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

export default function TextStudioPage() {
  const [text, setText] = useState('حيدرة');
  const [templates, setTemplates] = useState<TemplateMeta[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState('');
  const [selectedTemplateIds, setSelectedTemplateIds] = useState<string[]>([]);
  const [result, setResult] = useState<ApplyResult | null>(null);
  const [variants, setVariants] = useState<ApplyResult[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [collectionFilter, setCollectionFilter] = useState<FilterCollection>('all');
  const [rarityFilter, setRarityFilter] = useState<FilterRarity>('all');
  const [preset, setPreset] = useState<المشروعPreset>('brand_logo');
  const [previewTheme, setPreviewTheme] = useState<PreviewTheme>('ivory_gold');
  const [error, setError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const [fontFamily, setFontFamily] = useState('"Cairo", "Noto Sans Arabic", sans-serif');
  const [fontName, setFontName] = useState('');
  const [fontUrl, setFontUrl] = useState('');
  const [fontSize, setFontSize] = useState(48);
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [stroke, setStroke] = useState(0);
  const [strokeColor, setStrokeColor] = useState('#f59e0b');
  const [textColor, setTextColor] = useState('#0f172a');
  const [shadow, setShadow] = useState(8);

  const [prefix, setPrefix] = useState('✦');
  const [suffix, setSuffix] = useState('✦');
  const [innerL, setInnerL] = useState('❮');
  const [innerR, setInnerR] = useState('❯');
  const [lineGlyph, setLineGlyph] = useState('═');
  const [withLines, setWithLines] = useState(true);

  const [shapeA, setShapeA] = useState<LogoShape>({ symbol: '♛', x: -180, y: -42, size: 44, opacity: 0.75 });
  const [shapeB, setShapeB] = useState<LogoShape>({ symbol: '✶', x: 180, y: 38, size: 40, opacity: 0.75 });

  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      if (collectionFilter !== 'all' && t.collection !== collectionFilter) return false;
      if (rarityFilter !== 'all' && t.rarity !== rarityFilter) return false;
      if (!q) return true;
      return t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
    });
  }, [templates, query, collectionFilter, rarityFilter]);

  const groupedTemplates = useMemo(() => {
    const g = new Map<CollectionKey, TemplateMeta[]>();
    for (const c of COLLECTION_ORDER) g.set(c, []);
    for (const t of filteredTemplates) g.get(t.collection)?.push(t);
    return g;
  }, [filteredTemplates]);

  const coreText = result?.decoratedText || text || 'لا يوجد ناتج';
  const logoText = useMemo(() => {
    const middle = `${prefix} ${innerL} ${coreText} ${innerR} ${suffix}`;
    if (!withLines) return middle;
    const lineLength = Math.max(8, Math.min(26, Math.floor((coreText.length + 8) / 2)));
    const line = lineGlyph.repeat(lineLength);
    return `${line}\n${middle}\n${line}`;
  }, [prefix, innerL, coreText, innerR, suffix, withLines, lineGlyph]);

  const previewStyle = useMemo(
    () =>
      ({
        fontFamily,
        fontSize: `${fontSize}px`,
        letterSpacing: `${letterSpacing}px`,
        color: textColor,
        textShadow: `0 4px ${shadow}px rgba(0,0,0,0.25)`,
        WebkitTextStroke: `${stroke}px ${strokeColor}`
      }) as React.CSSProperties,
    [fontFamily, fontSize, letterSpacing, textColor, shadow, stroke, strokeColor]
  );

  useEffect(() => {
    const id = 'ornament-font-pack';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@400;700;900&family=Cinzel:wght@400;700&family=Noto+Kufi+Arabic:wght@400;700;900&family=Noto+Naskh+Arabic:wght@400;700&family=Orbitron:wght@400;700&display=swap';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const run = async () => {
      setLoadingTemplates(true);
      try {
        const res = await fetch('/api/text/generate');
        const data = (await res.json()) as { templates?: TemplateMeta[]; error?: string };
        if (!res.ok || data.error) return setError(data.error || 'تعذر تحميل القوالب.');
        const list = data.templates || [];
        setTemplates(list);
        if (list.length > 0) {
          setActiveTemplateId(list[0].id);
          setSelectedTemplateIds(list.slice(0, 8).map((x) => x.id));
        }
      } catch {
        setError('تعذر تحميل القوالب.');
      } finally {
        setLoadingTemplates(false);
      }
    };
    void run();
  }, []);

  const applySingle = async () => {
    if (!text.trim() || !activeTemplateId) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/text/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, templateId: activeTemplateId }) });
      const data = (await res.json()) as ApplyResult & { error?: string };
      if (!res.ok || data.error) return setError(data.error || 'تعذر تطبيق القالب.');
      setResult(data);
    } catch {
      setError('تعذر تطبيق القالب.');
    } finally {
      setLoading(false);
    }
  };

  const applyBatch = async () => {
    if (!text.trim() || selectedTemplateIds.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const calls = selectedTemplateIds.slice(0, 20).map(async (templateId) => {
        const res = await fetch('/api/text/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, templateId }) });
        const data = (await res.json()) as ApplyResult & { error?: string };
        return !res.ok || data.error ? null : data;
      });
      const out = (await Promise.all(calls)).filter((x): x is ApplyResult => x !== null);
      setVariants(out);
      if (out.length > 0) setResult(out[0]);
    } catch {
      setError('تعذر إنشاء نتائج الدفعة.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = async (value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  const applyFont = async () => {
    if (!fontName.trim()) return;
    const url = toCssUrl(fontUrl);
    if (url) {
      const id = 'custom-font-link';
      const old = document.getElementById(id);
      if (old) old.remove();
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }
    setFontFamily(`"${fontName.replace(/"/g, '')}", "Noto Sans Arabic", sans-serif`);
  };
  const ensureFontsReady = async () => {
    if (typeof document === 'undefined' || !('fonts' in document)) return;
    try {
      await document.fonts.ready;
      await document.fonts.load(`700 ${Math.max(20, fontSize)}px ${fontFamily}`);
    } catch {
      // Best-effort font sync for export.
    }
  };

  const getExportDimensions = () => {
    const node = previewRef.current;
    const previewWidth = node?.clientWidth || 960;
    const previewHeight = node?.clientHeight || 540;
    const ratio = Math.max(0.4, Math.min(3, previewWidth / Math.max(1, previewHeight)));
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const dprBoost = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 1.5) : 1;
    const longestSide = Math.round((isMobile ? 2200 : 3200) * dprBoost);

    if (ratio >= 1) {
      const width = longestSide;
      const height = Math.max(1200, Math.round(width / ratio));
      return { width, height };
    }

    const height = longestSide;
    const width = Math.max(1200, Math.round(height * ratio));
    return { width, height };
  };
  const buildSvgMarkup = (width = 1600, height = 900) => {
    const bg = previewTheme === 'obsidian' ? '#0f172a' : '#fffdf5';
    const fg = previewTheme === 'obsidian' ? '#e2e8f0' : textColor;
    const lines = logoText.split('\n');
    const lineStep = Math.max(fontSize * lineHeight, fontSize + 12);
    const startY = height / 2 - ((lines.length - 1) * lineStep) / 2;
    const tspans = lines
      .map((line, index) => `<tspan x="${width / 2}" y="${startY + index * lineStep}">${esc(line)}</tspan>`)
      .join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <filter id="logoShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="${Math.max(1, shadow / 2)}" flood-opacity="0.35"/>
    </filter>
  </defs>
  <rect width="${width}" height="${height}" fill="${bg}"/>
  <text x="${width / 2 + shapeA.x}" y="${height / 2 + shapeA.y}" text-anchor="middle" font-size="${shapeA.size}" opacity="${shapeA.opacity}" fill="${fg}">${esc(shapeA.symbol)}</text>
  <text x="${width / 2 + shapeB.x}" y="${height / 2 + shapeB.y}" text-anchor="middle" font-size="${shapeB.size}" opacity="${shapeB.opacity}" fill="${fg}">${esc(shapeB.symbol)}</text>
  <text text-anchor="middle" style="font-family:${esc(fontFamily)};font-size:${fontSize}px;letter-spacing:${letterSpacing}px;fill:${fg};stroke:${strokeColor};stroke-width:${stroke};" filter="url(#logoShadow)">${tspans}</text>
</svg>`;
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  const exportSvg = async () => {
    await ensureFontsReady();
    const svg = buildSvgMarkup();
    downloadBlob(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }), `logo-editable-${Date.now()}.svg`);
  };

  const exportSvgSource = () => {
    const svg = buildSvgMarkup();
    downloadBlob(new Blob([svg], { type: 'text/plain;charset=utf-8' }), `logo-svg-source-${Date.now()}.txt`);
  };
  const exportPng = async () => {
    if (isExporting) return;
    setIsExporting(true);
    setError('');
    try {
      await ensureFontsReady();
      const { width, height } = getExportDimensions();
      const svg = buildSvgMarkup(width, height);
      const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const image = new Image();
      image.decoding = 'sync';
      image.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error('png_render_failed'));
        image.src = svgUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(svgUrl);
        throw new Error('canvas_context_unavailable');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(svgUrl);

      await new Promise<void>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('png_blob_failed'));
          downloadBlob(blob, `logo-${width}x${height}-${Date.now()}.png`);
          resolve();
        }, 'image/png');
      });
    } catch {
      setError('Failed to export high-quality PNG. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportDesignPackage = () => {
    const payload = {
      text,
      generatedText: logoText,
      activeTemplateId,
      fontFamily,
      fontSize,
      letterSpacing,
      stroke,
      strokeColor,
      textColor,
      shadow,
      ornament: { prefix, suffix, innerL, innerR, lineGlyph, withLines },
      shapes: { shapeA, shapeB },
      previewTheme,
      exportedAt: new Date().toISOString()
    };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), `logo-design-package-${Date.now()}.json`);
  };

  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-[radial-gradient(900px_360px_at_90%_-10%,#dbeafe_0%,transparent_55%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_50%,#ffffff_100%)] dark:bg-[radial-gradient(900px_360px_at_90%_-10%,#1e3a8a_0%,transparent_55%),linear-gradient(180deg,#0b1220_0%,#0f172a_50%,#020617_100%)] px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">استوديو الزخرفة والشعارات</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">أداة إنتاج شعار نصّي متكاملة: قوالب + محرر زخرفة يدوي + تأثيرات + عناصر شكلية + تصدير SVG.</p>
        </header>

        <div className="grid gap-5 xl:grid-cols-[390px_1fr]">
          <aside className="space-y-4">
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h2 className="text-sm font-black">المشروع</h2>
              <select value={preset} onChange={(e) => setPreset(e.target.value as المشروعPreset)} className="mt-3 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100">
                {Object.entries(PRESET_LABELS).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
              <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className="mt-3 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-right text-sm text-slate-900 dark:text-slate-100" />
              <div className="mt-3 grid gap-2">
                <button onClick={() => void applySingle()} disabled={loading} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800">تطبيق القالب النشط</button>
                <button onClick={() => void applyBatch()} disabled={loading} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2 text-sm text-slate-700 dark:text-slate-200">توليد دفعة</button>
                <button onClick={() => void exportSvg()} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2 text-sm text-slate-700 dark:text-slate-200">تصدير SVG قابل للتعديل</button>
                <button onClick={exportSvgSource} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2 text-sm text-slate-700 dark:text-slate-200">تصدير مصدر SVG</button>
                <button onClick={() => void exportPng()} disabled={isExporting} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 disabled:opacity-60">تصدير PNG 4K</button>
                <button onClick={exportDesignPackage} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2 text-sm text-slate-700 dark:text-slate-200">تصدير حزمة التصميم</button>
              </div>
              {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
            </section>

            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h2 className="text-sm font-black">الخطوط والتأثيرات</h2>
              <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="mt-3 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100">
                <option value='"Cairo", "Noto Sans Arabic", sans-serif'>Cairo</option>
                <option value='"Noto Kufi Arabic", "Noto Sans Arabic", sans-serif'>Noto Kufi Arabic</option>
                <option value='"Noto Naskh Arabic", serif'>Noto Naskh Arabic</option>
                <option value='"Amiri", serif'>Amiri</option>
                <option value='"Cinzel", serif'>Cinzel</option>
                <option value='"Orbitron", sans-serif'>Orbitron</option>
              </select>
              <input value={fontName} onChange={(e) => setFontName(e.target.value)} placeholder="اسم خط مخصص" className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100" />
              <input value={fontUrl} onChange={(e) => setFontUrl(e.target.value)} placeholder="رابط CSS أو Google Fonts" className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100" />
              <button onClick={() => void applyFont()} className="mt-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-200">تطبيق الخط</button>
              <div className="mt-3 space-y-1 text-xs">
                <label>الحجم {fontSize}<input type="range" min={20} max={90} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full" /></label>
                <label>التباعد {letterSpacing}<input type="range" min={-1} max={10} value={letterSpacing} onChange={(e) => setLetterSpacing(Number(e.target.value))} className="w-full" /></label>
                <label>ارتفاع السطر {lineHeight.toFixed(1)}<input type="range" min={1} max={2.4} step={0.1} value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} className="w-full" /></label>
                <label>سماكة الحد {stroke}<input type="range" min={0} max={6} value={stroke} onChange={(e) => setStroke(Number(e.target.value))} className="w-full" /></label>
                <label>الظل {shadow}<input type="range" min={0} max={30} value={shadow} onChange={(e) => setShadow(Number(e.target.value))} className="w-full" /></label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 w-full rounded border border-slate-300 dark:border-slate-700" />
                  <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="h-8 w-full rounded border border-slate-300 dark:border-slate-700" />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h2 className="text-sm font-black">الزخرفة اليدوية</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <input value={prefix} onChange={(e) => setPrefix(e.target.value)} placeholder="بادئة" className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-2 text-sm text-slate-900 dark:text-slate-100" />
                <input value={suffix} onChange={(e) => setSuffix(e.target.value)} placeholder="لاحقة" className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-2 text-sm text-slate-900 dark:text-slate-100" />
                <input value={innerL} onChange={(e) => setInnerL(e.target.value)} placeholder="رمز داخلي يمين" className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-2 text-sm text-slate-900 dark:text-slate-100" />
                <input value={innerR} onChange={(e) => setInnerR(e.target.value)} placeholder="رمز داخلي يسار" className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-2 text-sm text-slate-900 dark:text-slate-100" />
              </div>
              <input value={lineGlyph} onChange={(e) => setLineGlyph(e.target.value || '═')} placeholder="رمز خط الزخرفة" className="mt-2 w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-2 text-sm text-slate-900 dark:text-slate-100" />
              <label className="mt-2 flex items-center gap-2 text-xs"><input type="checkbox" checked={withLines} onChange={(e) => setWithLines(e.target.checked)} /> استخدام خطوط أعلى/أسفل</label>
            </section>
          </aside>

          <main className="space-y-4">
            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h2 className="text-sm font-black">مكتبة القوالب</h2>
              <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن قالب" className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100" />
                <select value={collectionFilter} onChange={(e) => setCollectionFilter(e.target.value as FilterCollection)} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100">
                  <option value="all">كل المجموعات</option>
                  {COLLECTION_ORDER.map((c) => (
                    <option key={c} value={c}>
                      {COLLECTION_LABELS[c]}
                    </option>
                  ))}
                </select>
                <select value={rarityFilter} onChange={(e) => setRarityFilter(e.target.value as FilterRarity)} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-900 dark:text-slate-100">
                  <option value="all">كل المستويات</option>
                  <option value="elite">نخبوي</option>
                  <option value="legendary">أسطوري</option>
                  <option value="imperial">إمبراطوري</option>
                </select>
              </div>
              {loadingTemplates ? (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">جارٍ التحميل...</p>
              ) : (
                <div className="mt-3 max-h-[46vh] overflow-y-auto pr-1 scrollbar-thin">
                  {COLLECTION_ORDER.map((collection) => {
                    const items = groupedTemplates.get(collection) || [];
                    if (items.length === 0) return null;
                    return (
                      <div key={collection} className="mb-3">
                        <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300">{COLLECTION_LABELS[collection]}</h3>
                        <div className="mt-1 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                          {items.map((tpl) => (
                            <label key={tpl.id} className={`rounded-xl border p-2 ${tpl.id === activeTemplateId ? 'border-slate-900 bg-slate-900 text-white dark:bg-blue-900/40' : 'border-slate-200 dark:border-slate-700'}`}>
                              <button type="button" onClick={() => setActiveTemplateId(tpl.id)} className="w-full text-right text-xs font-bold">
                                {tpl.name}
                              </button>
                              <div className="mt-1 flex items-center gap-2 text-[11px]">
                                <input type="checkbox" checked={selectedTemplateIds.includes(tpl.id)} onChange={() => setSelectedTemplateIds((prev) => (prev.includes(tpl.id) ? prev.filter((x) => x !== tpl.id) : [...prev, tpl.id]))} />
                                دفعة
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h2 className="text-sm font-black">مُركّب الشعار</h2>
              <div ref={previewRef} className={`relative mt-3 min-h-[280px] overflow-hidden rounded-2xl border p-6 ${previewTheme === 'obsidian' ? 'bg-slate-900 text-white dark:bg-blue-900/40' : 'bg-gradient-to-br from-amber-50 via-white to-amber-100'}`}>
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(calc(-50% + ${shapeA.x}px), calc(-50% + ${shapeA.y}px))`, fontSize: shapeA.size, opacity: shapeA.opacity }}>{shapeA.symbol}</div>
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: `translate(calc(-50% + ${shapeB.x}px), calc(-50% + ${shapeB.y}px))`, fontSize: shapeB.size, opacity: shapeB.opacity }}>{shapeB.symbol}</div>
                <div dir="auto" style={previewStyle} className="relative z-10 max-w-full overflow-hidden whitespace-pre-wrap break-all text-center [overflow-wrap:anywhere]">
                  {logoText}
                </div>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-xs">
                  <div className="font-bold">الشكل A</div>
                  <input value={shapeA.symbol} onChange={(e) => setShapeA((s) => ({ ...s, symbol: e.target.value }))} className="mt-1 w-full rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-sm" />
                  <label>X<input type="range" min={-260} max={260} value={shapeA.x} onChange={(e) => setShapeA((s) => ({ ...s, x: Number(e.target.value) }))} className="w-full" /></label>
                  <label>Y<input type="range" min={-140} max={140} value={shapeA.y} onChange={(e) => setShapeA((s) => ({ ...s, y: Number(e.target.value) }))} className="w-full" /></label>
                </div>
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-xs">
                  <div className="font-bold">الشكل B</div>
                  <input value={shapeB.symbol} onChange={(e) => setShapeB((s) => ({ ...s, symbol: e.target.value }))} className="mt-1 w-full rounded border border-slate-300 dark:border-slate-700 px-2 py-1 text-sm" />
                  <label>X<input type="range" min={-260} max={260} value={shapeB.x} onChange={(e) => setShapeB((s) => ({ ...s, x: Number(e.target.value) }))} className="w-full" /></label>
                  <label>Y<input type="range" min={-140} max={140} value={shapeB.y} onChange={(e) => setShapeB((s) => ({ ...s, y: Number(e.target.value) }))} className="w-full" /></label>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => void copyText(logoText)} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-700 dark:text-slate-200">نسخ النص النهائي</button>
                <button onClick={() => void exportSvg()} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-700 dark:text-slate-200">SVG</button>
                <button onClick={exportSvgSource} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-700 dark:text-slate-200">مصدر SVG</button>
                <button onClick={() => void exportPng()} disabled={isExporting} className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs text-slate-700 dark:text-slate-200 disabled:opacity-60">PNG</button>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h2 className="text-sm font-black">مخرجات الدفعة</h2>
              {variants.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">لا توجد نتائج دفعة بعد.</p>
              ) : (
                <div className="mt-2 grid gap-2 md:grid-cols-2">
                  {variants.map((v) => (
                    <div key={`${v.templateId}-${v.decoratedText.slice(0, 12)}`} className="rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-800/40 p-3">
                      <div className="text-xs font-bold">{v.templateId}</div>
                      <div style={previewStyle} className="mt-1 max-w-full overflow-hidden whitespace-pre-wrap break-all text-center text-sm [overflow-wrap:anywhere]">{v.decoratedText}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}




