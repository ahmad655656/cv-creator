'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, User, LogOut, Settings, CreditCard, FileText, 
  ChevronDown, Moon, Sun, LayoutDashboard
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { NotificationBell } from '@/components/layout/NotificationBell';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  // تحديد إذا كان المستخدم أدمن
  const isAdmin = session?.user?.role === 'admin';

  // روابط القائمة
  const navLinks = [
    { href: '/templates', label: 'القوالب', icon: FileText },
    { href: '/study-questions', label: 'أسئلة من النص', icon: FileText },
    { href: '/pricing', label: 'الأسعار', icon: CreditCard },
    { href: '/about', label: 'عن الموقع', icon: FileText },
    { href: '/contact', label: 'اتصل بنا', icon: FileText },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
          : 'bg-white dark:bg-gray-900'
      }`}
    >
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg transform group-hover:rotate-6 transition">
              CV
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              CV Creator
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
              aria-label="Toggle dark mode"
            >
              <Moon size={20} className="block dark:hidden" />
              <Sun size={20} className="hidden dark:block" />
            </button>

            <NotificationBell />

            {/* User Menu */}
            {status === 'authenticated' ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pr-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {session.user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {session.user.name?.split(' ')[0]}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-500 transition-transform duration-200 ${
                      showUserMenu ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border dark:border-gray-800 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b dark:border-gray-800">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {session.user.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {session.user.email}
                      </p>
                      {isAdmin && (
                        <span className="mt-2 inline-block bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-1 rounded-full">
                          مدير النظام
                        </span>
                      )}
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {/* Dashboard Link - حسب نوع المستخدم */}
                      <Link
                        href={isAdmin ? '/admin' : '/dashboard'}
                        className="w-full px-4 py-2 text-right hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 text-gray-700 dark:text-gray-300"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard size={18} />
                        {isAdmin ? 'لوحة التحكم' : 'لوحة التحكم'}
                      </Link>

                      {/* Admin Links - تظهر فقط للأدمن */}
                      {isAdmin && (
                        <>
                          <Link
                            href="/admin/users"
                            className="w-full px-4 py-2 text-right hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 text-gray-700 dark:text-gray-300"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <User size={18} />
                            إدارة المستخدمين
                          </Link>
                          <Link
                            href="/admin/payments"
                            className="w-full px-4 py-2 text-right hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 text-gray-700 dark:text-gray-300"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <CreditCard size={18} />
                            إدارة المدفوعات
                          </Link>
                        </>
                      )}

                      {/* روابط عامة للمستخدمين المسجلين */}
                      <Link
                        href="/profile"
                        className="w-full px-4 py-2 text-right hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 text-gray-700 dark:text-gray-300"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User size={18} />
                        الملف الشخصي
                      </Link>

                      <Link
                        href="/my-cvs"
                        className="w-full px-4 py-2 text-right hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 text-gray-700 dark:text-gray-300"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FileText size={18} />
                        سيري الذاتية
                      </Link>

                      <Link
                        href="/settings"
                        className="w-full px-4 py-2 text-right hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 text-gray-700 dark:text-gray-300"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings size={18} />
                        الإعدادات
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="border-t dark:border-gray-800 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-right hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3 text-red-600 dark:text-red-400"
                      >
                        <LogOut size={18} />
                        تسجيل الخروج
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // روابط للزوار
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition"
                >
                  إنشاء حساب
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t dark:border-gray-800">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Overlay لإغلاق القائمة المنسدلة عند الضغط خارجها */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}
