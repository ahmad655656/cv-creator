import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CV Creator - شراء قوالب سيرة ذاتية احترافية',
  description: 'منصة مخصصة لشراء قوالب سيرة ذاتية احترافية مع معاينة دقيقة قبل التحميل.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var saved = localStorage.getItem('theme');
                  var legacy = localStorage.getItem('darkMode');
                  var mode = (saved === 'light' || saved === 'dark' || saved === 'system')
                    ? saved
                    : (legacy === 'true' ? 'dark' : 'system');
                  var dark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  document.documentElement.classList.toggle('dark', dark);
                  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
                } catch (e) {}
              })();
            `,
          }}
        />
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
