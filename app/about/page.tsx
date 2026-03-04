import Link from 'next/link';
import { CheckCircle2, FileText, ShieldCheck, Sparkles, Wand2, Zap } from 'lucide-react';

const highlights = [
  { title: '7 قوالب Premium', note: 'مختارة بعناية وجودة عالية' },
  { title: 'تجربة عربية كاملة', note: 'واجهة واضحة واتجاه RTL متقن' },
  { title: 'تصدير PDF احترافي', note: 'معاينة دقيقة قبل التحميل' },
];

const values = [
  {
    icon: FileText,
    title: 'وضوح المحتوى',
    description: 'نصمم كل قالب ليعرض معلوماتك بترتيب ذكي وسهل القراءة لأصحاب العمل.',
  },
  {
    icon: Wand2,
    title: 'تحرير فعلي قبل التحميل',
    description: 'لكل قالب نموذج مطابق لحقوله الفعلية، حتى تظهر تغييراتك مباشرة في النسخة النهائية.',
  },
  {
    icon: ShieldCheck,
    title: 'اعتمادية واستقرار',
    description: 'عملية شراء ومراجعة وتنزيل مدروسة، مع واجهة ثابتة وسلوك متوقع في كل خطوة.',
  },
  {
    icon: Zap,
    title: 'سرعة في الإنجاز',
    description: 'من اختيار القالب إلى تنزيل PDF خلال دقائق، دون تعقيد أو خطوات زائدة.',
  },
];

export default function AboutPage() {
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[radial-gradient(900px_420px_at_100%_-10%,#dbeafe_0%,transparent_60%),radial-gradient(700px_360px_at_0%_0%,#ccfbf1_0%,transparent_52%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_52%,#ffffff_100%)] dark:bg-[radial-gradient(900px_420px_at_100%_-10%,#1e3a8a_0%,transparent_60%),radial-gradient(700px_360px_at_0%_0%,#0f766e_0%,transparent_52%),linear-gradient(180deg,#020617_0%,#0b1220_52%,#020617_100%)]"
    >
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <section className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white/85 p-6 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
                <Sparkles size={14} />
                عن CV Creator
              </p>

              <h1 className="mt-4 text-3xl font-black leading-tight text-slate-900 dark:text-slate-100 sm:text-4xl lg:text-5xl">
                منصة احترافية لصناعة سيرة ذاتية تقنع من أول نظرة
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-8 text-slate-600 dark:text-slate-300 sm:text-base">
                CV Creator هو منتج عربي يركز على الجودة الفعلية: قوالب واضحة، تحرير متطابق مع التصميم النهائي، ومعاينة
                دقيقة قبل التحميل. هدفنا أن تبني CV قويًا بسرعة وبنتيجة تليق بخبرتك.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/templates"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  استعراض القوالب
                </Link>
                <Link
                  href="/contact"
                  className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  تواصل معنا
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {highlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white/90 p-4 dark:border-slate-700 dark:bg-slate-800/80"
                >
                  <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto mt-6 max-w-6xl rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 sm:p-8">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">ما الذي يميزنا؟</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article
                  key={value.title}
                  className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/80"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      <Icon size={18} />
                    </span>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">{value.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{value.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mt-6 max-w-6xl rounded-3xl border border-slate-200 bg-gradient-to-l from-blue-600 to-cyan-600 p-6 text-white shadow-lg dark:border-slate-700 sm:p-8">
          <h2 className="text-2xl font-extrabold">رؤيتنا</h2>
          <p className="mt-3 max-w-4xl text-sm leading-8 text-blue-50 sm:text-base">
            تقديم منصة عربية بمعيار عالمي في بناء السيرة الذاتية، بحيث تكون التجربة مريحة للمستخدم، والنتيجة النهائية
            جاهزة للتقديم المهني فورًا. نؤمن أن الجودة ليست في الشكل فقط، بل في دقة التفاصيل من البداية حتى ملف PDF النهائي.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-white/95">
            <CheckCircle2 size={18} />
            جودة التصميم + دقة البيانات + سهولة الاستخدام
          </div>
        </section>
      </div>
    </div>
  );
}
