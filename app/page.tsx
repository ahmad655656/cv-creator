import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    const userRole = session.user.role || 'user';
    if (userRole === 'admin') {
      redirect('/admin');
    }
    redirect('/dashboard');
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(1200px_620px_at_85%_-10%,#93c5fd_0%,transparent_58%),radial-gradient(900px_500px_at_10%_0%,#bfdbfe_0%,transparent_55%),linear-gradient(180deg,#f8fbff_0%,#eef4ff_42%,#f8fafc_100%)] dark:bg-[radial-gradient(1200px_620px_at_85%_-10%,#1d4ed8_0%,transparent_58%),radial-gradient(900px_500px_at_10%_0%,#1e3a8a_0%,transparent_55%),linear-gradient(180deg,#020617_0%,#0b1220_42%,#0f172a_100%)]">
      <div className="absolute inset-0 bg-grid-pattern opacity-35 pointer-events-none" />

      <div className="relative container mx-auto px-4 py-10 sm:py-14 lg:py-20">
        <section className="mx-auto max-w-6xl rounded-3xl border border-white/60 dark:border-slate-800/70 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl shadow-[0_24px_90px_rgba(30,64,175,0.16)] px-5 sm:px-8 lg:px-12 py-8 sm:py-12">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <p className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-blue-500/40 dark:bg-blue-500/10 dark:text-blue-300">
                CV Creator Pro Experience
              </p>

              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white">
                أنشئ سيرة ذاتية احترافية
                <span className="block text-blue-600 dark:text-blue-400">متوافقة مع كل الشاشات</span>
              </h1>

              <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl">
                تصاميم حديثة، أداء سريع، ومعاينة دقيقة للقوالب قبل الاستخدام. تجربة واضحة على الموبايل واللابتوب بدون قص أو تشويه.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm sm:text-base font-semibold transition shadow-lg shadow-blue-600/25"
                >
                  ابدأ الآن
                </Link>
                <Link
                  href="/templates"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 px-6 py-3 text-sm sm:text-base font-semibold transition"
                >
                  تصفح القوالب
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { value: '+50', label: 'قالب احترافي' },
                { value: '+1000', label: 'مستخدم نشط' },
                { value: '+5000', label: 'سيرة منشأة' },
                { value: 'PDF', label: 'تصدير فوري' }
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm"
                >
                  <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">{item.value}</div>
                  <div className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl mt-8 sm:mt-10 grid gap-4 sm:gap-5 md:grid-cols-3">
          {[
            {
              title: 'تصميم متجاوب بالكامل',
              description: 'المظهر مضبوط تلقائياً على الجوال، التابلت، واللابتوب.'
            },
            {
              title: 'معاينة حقيقية للقالب',
              description: 'تشاهد القالب بشكل واضح قبل الاختيار أو الشراء.'
            },
            {
              title: 'واجهة حديثة وسريعة',
              description: 'تنقل سلس، بطاقات نظيفة، وتجربة استخدام احترافية.'
            }
          ].map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-5 shadow-sm"
            >
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
