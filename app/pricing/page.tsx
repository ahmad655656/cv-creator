import Link from 'next/link';
import { CheckCircle, Crown, Star, Sparkles, CreditCard, Shield, Zap, Infinity } from 'lucide-react';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            خطط وأسعار بسيطة وواضحة
          </h1>
          <p className="text-xl text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            اختر الخطة المناسبة لك وابدأ في إنشاء سيرتك الذاتية الاحترافية
          </p>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8 justify-center items-stretch max-w-6xl mx-auto">
          
          {/* الخطة المجانية */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-1 rounded-full text-sm font-medium">
                تجربة مجانية
              </span>
            </div>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-gray-500" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">مجاني</h2>
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">0 ل.س</div>
              <p className="text-gray-500 dark:text-gray-400">للتجربة فقط</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                <span>قالب واحد فقط (Modern)</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                <span>جميع أقسام السيرة الذاتية</span>
              </li>
              <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                <span>تصدير PDF (مع علامة مائية)</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
                <span className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-700 flex-shrink-0" />
                <span className="line-through">قوالب إضافية</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 dark:text-gray-600">
                <span className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-700 flex-shrink-0" />
                <span className="line-through">إحصائيات متقدمة</span>
              </li>
            </ul>

            <Link
              href="/register"
              className="block w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-center font-medium transition"
            >
              ابدأ مجاناً
            </Link>
          </div>

          {/* الخطة المدفوعة - 10,000 ل.س (مميزة) */}
          <div className="flex-1 bg-gradient-to-b from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white transform scale-105 relative overflow-hidden">
            {/* خلفية زخرفية */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            
            {/* شعار الخطة الأكثر شعبية */}
            <div className="absolute top-6 left-6">
              <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                <Crown size={14} />
                الأكثر مبيعاً
              </span>
            </div>

            <div className="text-center mb-8 relative">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur">
                <Crown className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">القالب الواحد</h2>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-5xl font-bold">10,000</span>
                <span className="text-2xl">ل.س</span>
              </div>
              <p className="text-white/80">دفع لمرة واحدة فقط</p>
            </div>

            <ul className="space-y-4 mb-8 relative">
              <li className="flex items-center gap-3">
                <CheckCircle size={20} className="text-white flex-shrink-0" />
                <span>قالب احترافي من اختيارك</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={20} className="text-white flex-shrink-0" />
                <span>جميع أقسام السيرة الذاتية</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={20} className="text-white flex-shrink-0" />
                <span>تصدير PDF بدون علامة مائية</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={20} className="text-white flex-shrink-0" />
                <span>تخصيص كامل للألوان والخطوط</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={20} className="text-white flex-shrink-0" />
                <span>رابط مشاركة فريد</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={20} className="text-white flex-shrink-0" />
                <span>إحصائيات المشاهدات</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={20} className="text-white flex-shrink-0" />
                <span>تحديثات مجانية مدى الحياة</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle size={20} className="text-white flex-shrink-0" />
                <span>دعم فني 24/7</span>
              </li>
            </ul>

            <Link
              href="/templates"
              className="relative block w-full py-3 px-4 bg-white text-blue-600 rounded-xl text-center font-bold text-lg hover:bg-gray-100 transition shadow-xl hover:shadow-2xl"
            >
              اختر قالبك الآن
            </Link>

            <p className="text-center text-white/80 text-sm mt-4">
              * القالب ملكك مدى الحياة بعد الشراء
            </p>
          </div>

          {/* الخطة الشاملة (جميع القوالب) */}
<div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition">
  <div className="text-center mb-8">
    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
      <Infinity className="text-purple-600" size={32} />
    </div>
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">الباقة الشاملة</h2>
    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">70,000 ل.س</div>
    <p className="text-gray-500 dark:text-gray-400">وفر 30,000 ل.س</p>
  </div>

  <ul className="space-y-4 mb-8">
    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
      <CheckCircle size={20} className="text-purple-500 flex-shrink-0" />
      <span><strong>جميع القوالب</strong> (10 قوالب)</span>
    </li>
    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
      <CheckCircle size={20} className="text-purple-500 flex-shrink-0" />
      <span>جميع مزايا الخطة الأساسية</span>
    </li>
    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
      <CheckCircle size={20} className="text-purple-500 flex-shrink-0" />
      <span>قوالب حصرية إضافية</span>
    </li>
    <li className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
      <CheckCircle size={20} className="text-purple-500 flex-shrink-0" />
      <span>أولوية في الدعم الفني</span>
    </li>
  </ul>

  <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
    <p className="text-sm text-purple-700 dark:text-purple-300 text-center">
      سعر القالب الواحد بالباقة: 7,000 ل.س فقط
    </p>
  </div>

  <Link
    href={`/payment/bundle?amount=70000&type=bundle`} // رابط خاص للباقة
    className="block w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-center font-medium transition"
  >
    شراء الباقة الشاملة
  </Link>
</div>
        </div>

        {/* مقارنة سريعة */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            مقارنة سريعة
          </h3>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-right">الميزة</th>
                  <th className="px-6 py-4 text-center">مجاني</th>
                  <th className="px-6 py-4 text-center bg-blue-50 dark:bg-blue-900/20">قالب واحد</th>
                  <th className="px-6 py-4 text-center">باقة شاملة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                <tr>
                  <td className="px-6 py-4">السعر</td>
                  <td className="px-6 py-4 text-center">0 ل.س</td>
                  <td className="px-6 py-4 text-center bg-blue-50 dark:bg-blue-900/20 font-bold">10,000 ل.س</td>
                  <td className="px-6 py-4 text-center">70,000 ل.س</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">عدد القوالب</td>
                  <td className="px-6 py-4 text-center">1</td>
                  <td className="px-6 py-4 text-center bg-blue-50 dark:bg-blue-900/20">1</td>
                  <td className="px-6 py-4 text-center">10</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">تصدير PDF</td>
                  <td className="px-6 py-4 text-center">مع علامة مائية</td>
                  <td className="px-6 py-4 text-center bg-blue-50 dark:bg-blue-900/20">بدون علامة</td>
                  <td className="px-6 py-4 text-center">بدون علامة</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">تخصيص الألوان</td>
                  <td className="px-6 py-4 text-center">❌</td>
                  <td className="px-6 py-4 text-center bg-blue-50 dark:bg-blue-900/20">✅</td>
                  <td className="px-6 py-4 text-center">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* قسم الأسئلة الشائعة */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            أسئلة شائعة
          </h3>

          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-lg mb-2">هل القالب ملكي بعد الشراء؟</h4>
              <p className="text-gray-600 dark:text-gray-400">نعم، بمجرد شراء القالب يصبح ملكك مدى الحياة ويمكنك استخدامه لأي عدد تريده من السير الذاتية.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-lg mb-2">كيف يمكنني الدفع؟</h4>
              <p className="text-gray-600 dark:text-gray-400">نقبل الدفع عبر سيريتيل كاش. بعد اختيار القالب، ستظهر لك تعليمات التحويل.</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-md">
              <h4 className="font-bold text-lg mb-2">هل يمكنني تجربة القالب قبل الشراء؟</h4>
              <p className="text-gray-600 dark:text-gray-400">نعم، يمكنك تجربة القالب المجاني (Modern) بدون أي تكلفة لتتعرف على واجهة المحرر.</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-medium transition shadow-lg"
          >
            <Sparkles size={20} />
            استعرض القوالب واختر قالبك
          </Link>
        </div>
      </div>
    </div>
  );
}