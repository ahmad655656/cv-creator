'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  CreditCard,
  FileText,
  ChevronDown,
  Moon,
  Sun,
  LayoutDashboard,
  Type,
  Mail,
  Sparkles
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { NotificationBell } from '@/components/layout/NotificationBell';
import { isAdminRole } from '@/lib/auth/isAdminRole';

type NavLink = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
};

const NAV_LINKS: NavLink[] = [
  { href: '/templates', label: 'القوالب', icon: FileText },
  { href: '/text-studio', label: 'النص المزخرف', icon: Type },
  { href: '/pricing', label: 'الأسعار', icon: CreditCard },
  { href: '/about', label: 'عن الموقع', icon: Sparkles },
  { href: '/contact', label: 'اتصل بنا', icon: Mail }
];

function isPathActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { toggleTheme } = useTheme();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isAdmin = isAdminRole(session?.user?.role);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-[0_6px_24px_rgba(15,23,42,0.08)]'
          : 'bg-white/98 dark:bg-slate-950/98'
      }`}
    >
      <nav className="container mx-auto px-3 sm:px-4 lg:px-6" dir="rtl">
        <div className="h-16 lg:h-[72px] flex items-center justify-between gap-2">
          <Link href="/" className="group flex items-center gap-2 shrink-0">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-black text-sm flex items-center justify-center shadow-sm">
              CV
            </span>
            <span className="hidden sm:block text-[15px] lg:text-[17px] font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              CV Creator
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 px-1.5 py-1.5">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const active = isPathActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-[13px] font-semibold transition ${
                    active
                      ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <Icon size={15} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="تبديل الوضع"
            >
              <Moon size={18} className="block dark:hidden" />
              <Sun size={18} className="hidden dark:block" />
            </button>

            <NotificationBell />

            {status === 'authenticated' ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 px-1.5 sm:px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-500 text-white font-bold text-sm flex items-center justify-center">
                    {session.user.name?.charAt(0) || 'U'}
                  </span>
                  <span className="hidden md:block text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[110px] truncate">
                    {session.user.name || 'المستخدم'}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute left-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl z-[70] overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{session.user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{session.user.email}</p>
                      {isAdmin && (
                        <span className="inline-flex mt-2 px-2 py-0.5 text-xs rounded-full bg-purple-100 dark:bg-purple-900/25 text-purple-700 dark:text-purple-300">
                          مدير النظام
                        </span>
                      )}
                    </div>

                    <div className="p-2">
                      <Link
                        href={isAdmin ? '/admin' : '/dashboard'}
                        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <LayoutDashboard size={16} />
                        لوحة التحكم
                      </Link>
                      {isAdmin && (
                        <>
                          <Link
                            href="/admin/users"
                            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <User size={16} />
                            إدارة المستخدمين
                          </Link>
                          <Link
                            href="/admin/payments"
                            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                          >
                            <CreditCard size={16} />
                            إدارة المدفوعات
                          </Link>
                        </>
                      )}
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <User size={16} />
                        الملف الشخصي
                      </Link>                      <Link
                        href="/settings"
                        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Settings size={16} />
                        الإعدادات
                      </Link>
                    </div>

                    <div className="p-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <LogOut size={16} />
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="px-3 py-2 text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-2 text-sm font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="القائمة"
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {isMobileOpen && (
          <div className="lg:hidden pb-3">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-sm">
              <div className="grid grid-cols-1 gap-1.5">
                {NAV_LINKS.map((link) => {
                  const Icon = link.icon;
                  const active = isPathActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                        active
                          ? 'bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-900/40'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon size={16} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {status !== 'authenticated' && (
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  <Link
                    href="/login"
                    className="text-center px-3 py-2.5 rounded-xl text-sm font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
                  >
                    تسجيل الدخول
                  </Link>
                  <Link
                    href="/register"
                    className="text-center px-3 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white"
                  >
                    إنشاء حساب
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {isUserMenuOpen && <div className="fixed inset-0 z-[60]" onClick={() => setIsUserMenuOpen(false)} />}
    </header>
  );
}



