export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 sm:p-10">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">اتصل بنا</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">يمكنك التواصل معنا لأي استفسار تقني أو إداري.</p>
          <div className="mt-6 space-y-3 text-slate-700 dark:text-slate-300">
            <p><strong>البريد:</strong> support@cvcreator.app</p>
            <p><strong>واتساب:</strong> +963 9XX XXX XXX</p>
            <p><strong>الدعم:</strong> يومياً من 10 صباحاً حتى 8 مساءً</p>
          </div>
        </div>
      </div>
    </div>
  );
}
