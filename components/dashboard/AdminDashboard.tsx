'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
  CreditCard,
  DollarSign,
  FileText,
  LayoutTemplate,
  ShoppingCart,
  Shield,
  Users,
} from 'lucide-react';

type PaymentStatus = 'approved' | 'pending' | 'rejected' | string;

interface RecentPayment {
  id: number;
  user_name: string;
  template_name: string | null;
  amount: number;
  status: PaymentStatus;
  created_at: string;
}

interface PopularTemplate {
  name: string;
  usage_count: number;
}

type RecentPaymentLike = Partial<RecentPayment> & Record<string, any>;
type PopularTemplateLike = Partial<PopularTemplate> & Record<string, any>;

interface AdminStats {
  totalUsers: number;
  totalTemplates: number;
  totalPayments: number;
  totalRevenue: number;
  pendingPayments: number;
  totalCVs: number;
  recentPayments: RecentPaymentLike[];
  popularTemplates: PopularTemplateLike[];
  bundlePayments?: number;
}

interface AdminDashboardProps {
  stats: AdminStats;
  user: {
    name?: string | null;
  };
}

export function AdminDashboard({ stats, user }: AdminDashboardProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const conversionRate = useMemo(() => {
    if (stats.totalUsers <= 0) return 0;
    return Math.round((stats.totalPayments / stats.totalUsers) * 100);
  }, [stats.totalPayments, stats.totalUsers]);

  const averageOrder = useMemo(() => {
    if (stats.totalPayments <= 0) return 0;
    return Math.round(stats.totalRevenue / stats.totalPayments);
  }, [stats.totalPayments, stats.totalRevenue]);

  const topUsage = useMemo(() => {
    return Math.max(...stats.popularTemplates.map((t) => Number(t.usage_count || 0)), 1);
  }, [stats.popularTemplates]);

  const formatCurrency = (amount: number) => `${amount.toLocaleString('ar-SY')} ل.س`;

  const formatDate = (date?: string | null) => {
    if (!mounted || !date) return '...';
    return new Date(date).toLocaleDateString('ar-SY', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const paymentStatusLabel = (status?: PaymentStatus | null) => {
    if (status === 'approved') return 'مقبول';
    if (status === 'pending') return 'قيد المراجعة';
    if (status === 'rejected') return 'مرفوض';
    return 'غير معروف';
  };

  const paymentStatusClass = (status?: PaymentStatus | null) => {
    if (status === 'approved') return 'bg-emerald-100 text-emerald-700';
    if (status === 'pending') return 'bg-amber-100 text-amber-700';
    if (status === 'rejected') return 'bg-rose-100 text-rose-700';
    return 'bg-slate-100 text-slate-700';
  };

  const currentDate = mounted
    ? new Date().toLocaleDateString('ar-SY', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '...';

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                <Shield size={22} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">لوحة تحكم الإدارة</h1>
                <p className="text-sm text-slate-600 dark:text-slate-300">مرحباً {user?.name ?? 'المدير'} • {currentDate}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <MetricCard title="إجمالي المستخدمين" value={stats.totalUsers} icon={<Users size={20} />} tone="blue" />
          <MetricCard title="إجمالي الإيرادات" value={formatCurrency(stats.totalRevenue)} icon={<DollarSign size={20} />} tone="emerald" />
          <MetricCard title="طلبات بانتظار المراجعة" value={stats.pendingPayments} icon={<AlertCircle size={20} />} tone="amber" />
          <MetricCard title="عدد القوالب" value={stats.totalTemplates} icon={<LayoutTemplate size={20} />} tone="violet" />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <InfoCard
            title="متوسط قيمة الطلب"
            value={formatCurrency(averageOrder)}
            subText="مفيد لتقييم التسعير الحالي"
            icon={<CreditCard size={18} />}
          />
          <InfoCard
            title="معدل التحويل التقريبي"
            value={`${conversionRate}%`}
            subText="مدفوعات ناجحة ÷ عدد المستخدمين"
            icon={<ShoppingCart size={18} />}
          />
          <InfoCard
            title="عدد السير الناتجة"
            value={stats.totalCVs}
            subText="مؤشر على استخدام القوالب بعد الشراء"
            icon={<FileText size={18} />}
          />
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">آخر المدفوعات</h2>
              <Link href="/admin/payments" className="text-sm text-blue-600 hover:text-blue-700 font-medium">عرض الكل</Link>
            </div>

            {stats.recentPayments.length === 0 ? (
              <p className="text-sm text-slate-500">لا توجد بيانات مدفوعات حديثة.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentPayments.map((payment, idx) => (
                  <div
                    key={String(payment.id ?? idx)}
                    className="rounded-xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{payment.user_name}</p>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStatusClass(payment.status)}`}>
                        {paymentStatusLabel(payment.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{payment.template_name || 'باقة شاملة'}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">{formatCurrency(Number(payment.amount || 0))}</span>
                      <span className="text-xs text-slate-500">{formatDate(payment.created_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="xl:col-span-2 space-y-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">القوالب الأكثر طلباً</h2>
              {stats.popularTemplates.length === 0 ? (
                <p className="text-sm text-slate-500">لا توجد بيانات كافية حالياً.</p>
              ) : (
                <div className="space-y-3">
                  {stats.popularTemplates.map((template, idx) => {
                    const count = Number(template.usage_count || 0);
                    const width = Math.max(8, Math.round((count / topUsage) * 100));
                    return (
                      <div key={String(template.name ?? idx)}>
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{template.name}</p>
                          <span className="text-xs text-slate-500">{count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full rounded-full bg-blue-600" style={{ width: `${width}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">إجراءات سريعة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <QuickAction href="/admin/payments" title="مراجعة المدفوعات" subtitle={`${stats.pendingPayments} طلب معلق`} />
                <QuickAction href="/admin/users" title="إدارة المستخدمين" subtitle={`${stats.totalUsers} مستخدم`} />
                <QuickAction href="/admin/templates" title="إدارة القوالب" subtitle={`${stats.totalTemplates} قالب`} />
                <QuickAction href="/admin/settings" title="إعدادات النظام" subtitle="التحكم العام" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: string | number;
  icon: ReactNode;
  tone: 'blue' | 'emerald' | 'amber' | 'violet';
}) {
  const styles = {
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    violet: 'bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  }[tone];

  return (
    <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${styles}`}>{icon}</div>
      </div>
    </article>
  );
}

function InfoCard({
  title,
  value,
  subText,
  icon,
}: {
  title: string;
  value: string | number;
  subText: string;
  icon: ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        {icon}
        <p className="text-sm">{title}</p>
      </div>
      <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subText}</p>
    </article>
  );
}

function QuickAction({ href, title, subtitle }: { href: string; title: string; subtitle: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 hover:border-blue-400 hover:bg-blue-50/60 dark:hover:bg-slate-800 transition"
    >
      <p className="font-semibold text-slate-900 dark:text-slate-100">{title}</p>
      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
    </Link>
  );
}
