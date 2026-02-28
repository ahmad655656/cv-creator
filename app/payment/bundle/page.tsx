'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  CheckCircle, AlertCircle, Phone, Calendar, Upload, X, 
  Package, Infinity, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';

export default function BundlePaymentPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const [step, setStep] = useState(1);
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const amount = 70000;
  const YOUR_NUMBER = '0983796029';

  // التحقق من تسجيل الدخول
  if (status === 'unauthenticated') {
    router.push('/login?callbackUrl=/payment/bundle?amount=70000&type=bundle');
    return null;
  }

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('الرجاء اختيار ملف صورة صالح');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setScreenshot(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!senderNumber || !transactionDate) {
      setError('الرجاء إكمال جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payment/bundle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          senderNumber,
          transactionDate,
          screenshot,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(3);
        setTimeout(() => {
          router.push('/dashboard?payment=success');
        }, 5000);
      } else {
        setError(data.details ? `${data.error}: ${data.details}` : (data.error || 'حدث خطأ في معالجة الدفع'));
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <Link href="/pricing" className="hover:text-blue-600">الأسعار</Link>
          <ChevronRight size={16} />
          <span className="text-blue-600 font-medium">شراء الباقة الشاملة</span>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Package size={28} />
              <h1 className="text-2xl font-bold">الباقة الشاملة</h1>
            </div>
            <p className="text-white/90">جميع القوالب الاحترافية (10 قوالب)</p>
          </div>

          {/* Steps */}
          <div className="flex justify-between px-6 pt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex-1 text-center ${i < step ? 'text-green-600' : i === step ? 'text-purple-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  i < step ? 'bg-green-100 text-green-600' :
                  i === step ? 'bg-purple-100 text-purple-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {i < step ? <CheckCircle size={16} /> : i}
                </div>
                <div className="text-xs">
                  {i === 1 ? 'البيانات' : i === 2 ? 'الدفع' : 'التأكيد'}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6">
            {step === 1 && (
              <div className="space-y-6">
                {/* تفاصيل الباقة */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                  <h3 className="font-bold text-lg text-purple-800 dark:text-purple-300 mb-3">
                    تفاصيل الباقة
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                      <CheckCircle size={16} />
                      <span>10 قوالب احترافية</span>
                    </li>
                    <li className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                      <CheckCircle size={16} />
                      <span>توفير 30,000 ل.س</span>
                    </li>
                    <li className="flex items-center gap-2 text-purple-700 dark:text-purple-400">
                      <CheckCircle size={16} />
                      <span>جميع القوالب الحالية والمستقبلية</span>
                    </li>
                  </ul>
                </div>

                {/* السعر */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700 dark:text-blue-300">المبلغ الإجمالي:</span>
                    <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                      70,000 ل.س
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition font-medium"
                >
                  متابعة عملية الدفع
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                {/* تعليمات الدفع */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                    <AlertCircle size={18} />
                    تعليمات الدفع
                  </h4>
                  <ol className="text-sm text-yellow-700 dark:text-yellow-400 space-y-2 mr-4">
                    <li>1. افتح تطبيق سيريتيل كاش على هاتفك</li>
                    <li>2. اختر "تحويل رصيد"</li>
                    <li>3. أدخل الرقم: <span className="font-bold text-lg">{YOUR_NUMBER}</span></li>
                    <li>4. أدخل المبلغ: <span className="font-bold">70,000 ل.س</span></li>
                    <li>5. أكمل عملية التحويل</li>
                    <li>6. التقط صورة شاشة للإيصال</li>
                  </ol>
                </div>

                {/* رقم المرسل */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    رقم المرسل (سيريتيل كاش)
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      placeholder="09XXXXXXXX"
                      className="w-full pr-10 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* تاريخ التحويل */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    تاريخ التحويل
                  </label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="datetime-local"
                      value={transactionDate}
                      onChange={(e) => setTransactionDate(e.target.value)}
                      className="w-full pr-10 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>

                {/* رفع الصورة */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    صورة الإيصال (اختياري)
                  </label>
                  <div
                    onClick={() => document.getElementById('screenshot')?.click()}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-purple-500 transition"
                  >
                    {screenshot ? (
                      <div className="relative">
                        <img src={screenshot} alt="Screenshot" className="max-h-32 mx-auto rounded-lg" />
                        <button
                          onClick={(e) => { e.stopPropagation(); setScreenshot(null); }}
                          className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                        <p className="text-sm text-gray-600 dark:text-gray-400">اضغط لرفع صورة الإيصال</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG (حد أقصى 5MB)</p>
                      </>
                    )}
                    <input id="screenshot" type="file" accept="image/*" onChange={handleScreenshotUpload} className="hidden" />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition font-medium"
                  >
                    رجوع
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition font-medium disabled:opacity-50"
                  >
                    {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  تم استلام طلبك بنجاح!
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  سيتم مراجعة طلبك وتفعيل الباقة خلال 24 ساعة
                </p>
                <p className="text-sm text-gray-500">
                  بعد التفعيل، ستتمكن من استخدام جميع القوالب
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
