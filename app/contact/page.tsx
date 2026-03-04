'use client';

import { useState } from 'react';
import { Mail, Phone, ShieldCheck, Send, Clock3, CheckCircle2, AlertCircle } from 'lucide-react';

type ContactFormState = {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  company: string;
};

const INITIAL_FORM: ContactFormState = {
  fullName: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  company: '',
};

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const updateField = (field: keyof ContactFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok || !data?.success) {
        setResult({ type: 'error', message: data?.error || 'تعذر إرسال الرسالة حالياً.' });
        return;
      }

      setResult({ type: 'success', message: data?.message || 'تم إرسال رسالتك بنجاح.' });
      setForm(INITIAL_FORM);
    } catch {
      setResult({ type: 'error', message: 'حدث خطأ أثناء الإرسال، حاول مرة أخرى.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(900px_420px_at_100%_-10%,#dbeafe_0%,transparent_62%),radial-gradient(700px_340px_at_0%_0%,#cffafe_0%,transparent_52%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_56%,#ffffff_100%)] dark:bg-[radial-gradient(900px_420px_at_100%_-10%,#1e3a8a_0%,transparent_62%),radial-gradient(700px_340px_at_0%_0%,#155e75_0%,transparent_52%),linear-gradient(180deg,#020617_0%,#0b1220_56%,#020617_100%)]"
    >
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <section className="mx-auto max-w-6xl rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] dark:border-slate-800 dark:bg-slate-900/85 sm:p-8">
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 sm:text-4xl">تواصل معنا</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">
            لأي استفسار أو طلب تطوير، أرسل رسالتك مباشرة وسيتم استلامها على البريد الرسمي.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/80">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Mail size={18} />
                <h3 className="font-bold">البريد الإلكتروني</h3>
              </div>
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-300 break-all">haedarahasan69@gmail.com</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/80">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Phone size={18} />
                <h3 className="font-bold">رقم التواصل</h3>
              </div>
              <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">+963983796029</p>
            </article>

            <article className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/80 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
                <Clock3 size={18} />
                <h3 className="font-bold">أوقات الرد</h3>
              </div>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">يوميًا من 10:00 صباحًا حتى 8:00 مساءً</p>
            </article>
          </div>
        </section>

        <section className="mx-auto mt-6 max-w-6xl rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 sm:p-8">
          <div className="mb-5 flex items-center gap-2 text-slate-700 dark:text-slate-200">
            <ShieldCheck size={18} />
            <p className="text-sm">يتم إرسال الرسائل بشكل آمن من خلال خادم المنصة مباشرة.</p>
          </div>

          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">الاسم الكامل</label>
              <input
                value={form.fullName}
                onChange={(e) => updateField('fullName', e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">البريد الإلكتروني</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">رقم الهاتف (اختياري)</label>
              <input
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">عنوان الرسالة</label>
              <input
                value={form.subject}
                onChange={(e) => updateField('subject', e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-200">نص الرسالة</label>
              <textarea
                value={form.message}
                onChange={(e) => updateField('message', e.target.value)}
                required
                rows={7}
                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Honeypot */}
            <input
              type="text"
              value={form.company}
              onChange={(e) => updateField('company', e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {result && (
              <div
                className={`md:col-span-2 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${
                  result.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                }`}
              >
                {result.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {result.message}
              </div>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={16} />
                {loading ? 'جارٍ الإرسال...' : 'إرسال الرسالة'}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
