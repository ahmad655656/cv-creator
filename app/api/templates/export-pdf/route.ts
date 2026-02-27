import { NextResponse } from 'next/server';
import { existsSync } from 'node:fs';
import { chromium } from 'playwright-core';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type ExportRequestBody = {
  html?: string;
  fileName?: string;
  slug?: string;
  pageTier?: 'one-page' | 'two-page';
};

const WINDOWS_CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
];

const LINUX_CHROME_PATHS = [
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  '/snap/bin/chromium'
];

const MAC_CHROME_PATHS = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/Applications/Chromium.app/Contents/MacOS/Chromium'
];

function resolveChromiumExecutablePath() {
  const fromEnv = process.env.CHROME_PATH || process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  if (fromEnv && existsSync(fromEnv)) {
    return fromEnv;
  }

  const platform = process.platform;
  const candidates =
    platform === 'win32'
      ? WINDOWS_CHROME_PATHS
      : platform === 'darwin'
        ? MAC_CHROME_PATHS
        : LINUX_CHROME_PATHS;

  return candidates.find((candidate) => existsSync(candidate));
}

function sanitizeFileName(raw?: string) {
  return (raw || 'template').replace(/[\\/:*?"<>|]/g, '-').trim() || 'template';
}

export async function POST(req: Request) {
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;

  try {
    const body = (await req.json()) as ExportRequestBody;
    const html = body?.html;
    const pageTier = body?.pageTier || 'one-page';
    const slug = (body?.slug || '').toLowerCase();

    if (!html || typeof html !== 'string') {
      return NextResponse.json({ error: 'Missing template HTML' }, { status: 400 });
    }

    const executablePath = resolveChromiumExecutablePath();
    if (!executablePath) {
      return NextResponse.json(
        {
          error:
            'No Chromium/Chrome executable found on server. Set CHROME_PATH in .env.local to your browser executable path.'
        },
        { status: 500 }
      );
    }

    browser = await chromium.launch({
      executablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
    });

    const page = await browser.newPage({
      viewport: { width: 1440, height: 2200 },
      deviceScaleFactor: 1
    });
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });

    await page.evaluate(({ tier, slugValue }) => {
      const MM_TO_PX = 3.7795275591;
      const pageHeightPx = (297 - 4 - 5) * MM_TO_PX;
      const targetPages = tier === 'two-page' ? 2 : 1;
      const content = document.querySelector<HTMLElement>('.pdf-content');
      if (!content) return;

      const naturalHeight = Math.max(content.scrollHeight, content.getBoundingClientRect().height);
      if (naturalHeight <= 0) return;

      const requiredScale = Math.min(1, (targetPages * pageHeightPx) / naturalHeight);
      const isMedicalPro = slugValue === 'medicalpro';
      const minScale = tier === 'two-page' ? (isMedicalPro ? 0.26 : 0.4) : 0.52;
      const appliedScale = Math.max(minScale, requiredScale);

      content.style.transformOrigin = 'top center';
      content.style.transform = `scale(${appliedScale})`;
      content.style.width = `${100 / appliedScale}%`;

      if (tier !== 'two-page') return;

      const blockSelectors = [
        '.pdf-content main > section',
        '.pdf-content aside > section',
        '.pdf-content > section',
        '.pdf-content section > article'
      ];
      const blocks = Array.from(
        document.querySelectorAll<HTMLElement>(blockSelectors.join(','))
      ).filter((el) => el.offsetHeight > 24);

      if (blocks.length < 3) return;

      const contentTop = content.getBoundingClientRect().top;
      const pageIndexFor = (el: HTMLElement) =>
        Math.floor(Math.max(0, el.getBoundingClientRect().top - contentTop) / pageHeightPx);

      const pageMap = new Map<number, HTMLElement[]>();
      for (const block of blocks) {
        const idx = pageIndexFor(block);
        const items = pageMap.get(idx) || [];
        items.push(block);
        pageMap.set(idx, items);
      }

      const indexes = Array.from(pageMap.keys()).sort((a, b) => a - b);
      if (indexes.length !== 2) return;

      const firstItems = pageMap.get(indexes[0]) || [];
      const secondItems = pageMap.get(indexes[1]) || [];
      if (secondItems.length >= 2 || firstItems.length < 2) return;

      const moveCandidate = firstItems[firstItems.length - 1];
      if (!moveCandidate) return;
      moveCandidate.style.breakBefore = 'page';
      moveCandidate.style.pageBreakBefore = 'always';
    }, { tier: pageTier, slugValue: slug });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      scale: 1,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    });

    const safeName = sanitizeFileName(body?.fileName);
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${safeName}.pdf"`
      }
    });
  } catch (error) {
    console.error('Template PDF Export Error:', error);
    return NextResponse.json({ error: 'Template PDF export failed' }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
