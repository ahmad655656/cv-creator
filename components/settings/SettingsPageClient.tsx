'use client';

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, KeyRound, Loader2, Mail, Moon, Save, ShieldCheck, Sun, User2 } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type SettingsUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  hasPassword: boolean;
};

type Props = {
  initialUser: SettingsUser;
};

export function SettingsPageClient({ initialUser }: Props) {
  const router = useRouter();
  const { update } = useSession();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState(initialUser.name || '');
  const [email, setEmail] = useState(initialUser.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const joinedAt = useMemo(
    () => new Date(initialUser.createdAt).toLocaleDateString('ar-EG'),
    [initialUser.createdAt],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingProfile(true);
    setMessage(null);
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, currentPassword: '', newPassword: '' }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage({ type: 'error', text: data?.error || 'تعذر حفظ البيانات.' });
        return;
      }
      if (data?.user?.name || data?.user?.email) {
        await update({
          name: String(data.user.name || name),
          email: String(data.user.email || email),
        });
      }
      setMessage({
        type: 'success',
        text: `${data?.message || 'تم حفظ البيانات بنجاح.'} (User ID: ${String(data?.debugUserId ?? initialUser.id)})`,
      });
      router.refresh();
    } catch {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء حفظ البيانات.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const onSavePassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingPassword(true);
    setMessage(null);
    try {
      const response = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, currentPassword, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage({ type: 'error', text: data?.error || 'تعذر تحديث كلمة المرور.' });
        return;
      }
      if (data?.user?.name || data?.user?.email) {
        await update({
          name: String(data.user.name || name),
          email: String(data.user.email || email),
        });
      }
      setCurrentPassword('');
      setNewPassword('');
      setMessage({
        type: 'success',
        text: `${data?.message || 'تم تحديث كلمة المرور بنجاح.'} (User ID: ${String(data?.debugUserId ?? initialUser.id)})`,
      });
      router.refresh();
    } catch {
      setMessage({ type: 'error', text: 'حدث خطأ أثناء تحديث كلمة المرور.' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(900px_420px_at_100%_-10%,#dbeafe_0%,transparent_62%),radial-gradient(700px_340px_at_0%_0%,#cffafe_0%,transparent_52%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_56%,#ffffff_100%)] dark:bg-[radial-gradient(900px_420px_at_100%_-10%,#1e3a8a_0%,transparent_62%),radial-gradient(700px_340px_at_0%_0%,#155e75_0%,transparent_52%),linear-gradient(180deg,#020617_0%,#0b1220_56%,#020617_100%)]"
    >
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <section className="mx-auto max-w-6xl rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/85 sm:p-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100">الإعدادات</h1>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
            صفحة إعدادات حسابك للتحكم بالبيانات الأساسية، كلمة المرور، وتجربة العرض.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard icon={User2} label="الاسم الحالي" value={initialUser.name || '-'} />
            <InfoCard icon={Mail} label="البريد الحالي" value={initialUser.email || '-'} />
            <InfoCard icon={ShieldCheck} label="الدور" value={initialUser.role || 'user'} />
            <InfoCard icon={CheckCircle2} label="تاريخ الانضمام" value={joinedAt} />
          </div>
        </section>

        {message && (
          <div
            className={`mx-auto mt-4 max-w-6xl rounded-xl px-4 py-3 text-sm ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/25 dark:text-emerald-300'
                : 'bg-red-50 text-red-700 dark:bg-red-900/25 dark:text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <section className="mx-auto mt-6 grid max-w-6xl gap-6 lg:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 sm:p-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">بيانات الحساب</h2>
            <form className="mt-4 space-y-4" onSubmit={onSaveProfile}>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">الاسم</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                حفظ البيانات
              </button>
            </form>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 sm:p-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">الأمان</h2>
            {!initialUser.hasPassword && (
              <p className="mt-2 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
                لا يمكن تغيير كلمة المرور لهذا النوع من الحساب حالياً.
              </p>
            )}
            <form className="mt-4 space-y-4" onSubmit={onSavePassword}>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">كلمة المرور الحالية</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={!initialUser.hasPassword}
                  required={initialUser.hasPassword}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">كلمة المرور الجديدة</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={!initialUser.hasPassword}
                  required={initialUser.hasPassword}
                  minLength={8}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={savingPassword || !initialUser.hasPassword}
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingPassword ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
                تحديث كلمة المرور
              </button>
            </form>
          </article>
        </section>

        <section className="mx-auto mt-6 max-w-6xl rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 sm:p-6">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">تجربة العرض</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">يمكنك التحكم بطريقة عرض المنصة بما يناسبك.</p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <ThemeButton
              active={mounted && theme === 'light'}
              title="الوضع الفاتح"
              onClick={() => setTheme('light')}
              icon={<Sun size={16} />}
            />
            <ThemeButton
              active={mounted && theme === 'dark'}
              title="الوضع الداكن"
              onClick={() => setTheme('dark')}
              icon={<Moon size={16} />}
            />
            <ThemeButton
              active={mounted && theme === 'system'}
              title={mounted ? `تلقائي (${resolvedTheme === 'dark' ? 'داكن' : 'فاتح'})` : 'تلقائي'}
              onClick={() => setTheme('system')}
              icon={<ShieldCheck size={16} />}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-700 dark:bg-slate-800/80">
      <p className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
        <Icon size={13} />
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}

function ThemeButton({
  active,
  title,
  onClick,
  icon,
}: {
  active: boolean;
  title: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
        active
          ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900/30 dark:text-blue-300'
          : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
      }`}
    >
      {icon}
      {title}
    </button>
  );
}
