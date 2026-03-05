import Link from 'next/link';
import type { ReactNode } from 'react';
import { BarChart3, CreditCard, FileText, LayoutTemplate, Settings, Users } from 'lucide-react';

const adminLinks = [
  { href: '/admin', label: 'لوحة الإدارة', icon: BarChart3 },
  { href: '/admin/payments', label: 'المدفوعات', icon: CreditCard },
  { href: '/admin/users', label: 'المستخدمون', icon: Users },
  { href: '/admin/templates', label: 'القوالب', icon: LayoutTemplate },
  { href: '/admin/cvs', label: 'السير', icon: FileText },
  { href: '/admin/analytics', label: 'التحليلات', icon: BarChart3 },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

interface AdminPageShellProps {
  title: string;
  description: string;
  currentPath: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AdminPageShell({ title, description, currentPath, actions, children }: AdminPageShellProps) {
  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">{title}</h1>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300">{description}</p>
            </div>
            {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
          </div>
        </section>

        <nav className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2">
          <div className="flex gap-2 overflow-x-auto">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const active = currentPath === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold whitespace-nowrap transition ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {children}
      </div>
    </div>
  );
}
