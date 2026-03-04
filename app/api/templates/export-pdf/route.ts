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
  pageFormat?: 'A4' | 'Letter';
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

type ChromiumLaunchConfig = {
  executablePath: string;
  args: string[];
  headless: boolean;
};

async function resolveChromiumLaunchConfig(): Promise<ChromiumLaunchConfig> {
  const localExecutablePath = resolveChromiumExecutablePath();
  if (localExecutablePath) {
    return {
      executablePath: localExecutablePath,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none']
    };
  }

  // Vercel/serverless fallback: packaged Chromium binary.
  try {
    const chromiumPackage = await import('@sparticuz/chromium');
    const executablePath = await chromiumPackage.default.executablePath();
    if (executablePath && existsSync(executablePath)) {
      return {
        executablePath,
        headless: true,
        args: [...chromiumPackage.default.args, '--font-render-hinting=none']
      };
    }
  } catch (error) {
    console.error('Sparticuz Chromium load error:', error);
  }

  throw new Error(
    'No Chromium executable found. Configure CHROME_PATH or install @sparticuz/chromium for serverless runtime.'
  );
}

export async function POST(req: Request) {
  let browser: Awaited<ReturnType<typeof chromium.launch>> | null = null;

  try {
    const body = (await req.json()) as ExportRequestBody;
    const html = body?.html;
    const pageTier = body?.pageTier || 'one-page';
    const pageFormat = body?.pageFormat === 'Letter' ? 'Letter' : 'A4';
    const slug = (body?.slug || '').toLowerCase();

    if (!html || typeof html !== 'string') {
      return NextResponse.json({ error: 'Missing template HTML' }, { status: 400 });
    }

    const launchConfig = await resolveChromiumLaunchConfig();

    browser = await chromium.launch({
      executablePath: launchConfig.executablePath,
      headless: launchConfig.headless,
      args: launchConfig.args
    });

    const page = await browser.newPage({
      viewport: { width: 1440, height: 2200 },
      deviceScaleFactor: 1
    });
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      const images = Array.from(document.images || []);
      await Promise.all(
        images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.onload = () => resolve();
            img.onerror = () => resolve();
          });
        })
      );
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }
    });
    await page.waitForTimeout(80);
    await page.emulateMedia({ media: 'print' });

    // Avoid transform-based auto-scaling because it breaks document flow and can
    // push page-2 content into the middle of the page in some templates.
    void pageTier;
    const normalizedSlug = slug.replace(/[-_\s]/g, '');
    const useZeroMargins =
      normalizedSlug === 'minimalnordic' ||
      normalizedSlug === 'salesstar' ||
      normalizedSlug === 'productlead' ||
      normalizedSlug === 'julianasilva' ||
      normalizedSlug === 'alidaplanet';

    const pdfBuffer = await page.pdf({
      format: pageFormat.toLowerCase() as 'a4' | 'letter',
      scale: 1,
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: false,
      margin: useZeroMargins
        ? { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
        : { top: '16mm', right: '16mm', bottom: '16mm', left: '16mm' }
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
    return NextResponse.json(
      {
        error: 'Template PDF export failed',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
