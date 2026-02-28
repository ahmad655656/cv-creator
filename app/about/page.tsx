export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 sm:p-10">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">عن المنصة</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300 leading-8">
            CV Creator منصة عربية لبناء وإدارة قوالب سيرة ذاتية احترافية مع نظام شراء قوالب ومراجعة دفع وإشعارات داخلية.
          </p>
          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-2xl font-bold text-blue-600">+50</p>
              <p className="text-sm text-slate-500">قالب احترافي</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-2xl font-bold text-blue-600">Responsive</p>
              <p className="text-sm text-slate-500">متوافق مع الجوال</p>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
              <p className="text-2xl font-bold text-blue-600">Secure</p>
              <p className="text-sm text-slate-500">جلسات آمنة</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
