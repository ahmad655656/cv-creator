'use client';

import { useState } from 'react';
import { X, Upload, CheckCircle, AlertCircle, Phone, Calendar, CreditCard } from 'lucide-react';
import Image from 'next/image';

interface PaymentModalProps {
  template: {
    id: number;
    name: string;
    price: number;
  };
  userId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function PaymentModal({ template, userId, onClose, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState(1);
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const YOUR_NUMBER = '0983796029';

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
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId: template.id,
          amount: template.price,
          senderNumber,
          transactionDate,
          screenshot,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(3);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 5000);
      } else {
        setError(data.error || 'حدث خطأ في معالجة الدفع');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            شراء قالب {template.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Steps */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex-1 text-center ${
                  i < step
                    ? 'text-green-600'
                    : i === step
                    ? 'text-blue-600'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                    i < step
                      ? 'bg-green-100 text-green-600'
                      : i === step
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {i < step ? <CheckCircle size={16} /> : i}
                </div>
                <div className="text-xs">
                  {i === 1 ? 'البيانات' : i === 2 ? 'الدفع' : 'التأكيد'}
                </div>
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              {/* Price Info */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700 dark:text-blue-300">المبلغ المطلوب:</span>
                  <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {template.price.toLocaleString()} ل.س
                  </span>
                </div>
              </div>

              {/* Payment Instructions */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2 flex items-center gap-2">
                  <AlertCircle size={18} />
                  تعليمات الدفع
                </h4>
                <ol className="text-sm text-yellow-700 dark:text-yellow-400 space-y-2 mr-4">
                  <li>1. افتح تطبيق سيريتيل كاش على هاتفك</li>
                  <li>2. اختر "تحويل رصيد"</li>
                  <li>3. أدخل الرقم: <span className="font-bold text-lg">{YOUR_NUMBER}</span></li>
                  <li>4. أدخل المبلغ: <span className="font-bold">{template.price} ل.س</span></li>
                  <li>5. أكمل عملية التحويل</li>
                  <li>6. التقط صورة شاشة للإيصال</li>
                </ol>
              </div>

              {/* QR Code (اختياري) - يمكن إضافة QR code هنا */}
              <div className="text-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  أو امسح رمز QR للتحويل السريع
                </p>
                <div className="w-32 h-32 mx-auto bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">QR Code</span>
                </div>
              </div>

              <button
                onClick={() => setStep(2)}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
              >
                تمت عملية التحويل
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              {/* Sender Number */}
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
                    className="w-full pr-10 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Transaction Date */}
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
                    className="w-full pr-10 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Screenshot Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  صورة الإيصال (اختياري)
                </label>
                <div
                  onClick={() => document.getElementById('screenshot')?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition"
                >
                  {screenshot ? (
                    <div className="relative">
                      <img
                        src={screenshot}
                        alt="Screenshot"
                        className="max-h-32 mx-auto rounded-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setScreenshot(null);
                        }}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        اضغط لرفع صورة الإيصال
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG (حد أقصى 5MB)
                      </p>
                    </>
                  )}
                  <input
                    id="screenshot"
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotUpload}
                    className="hidden"
                  />
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
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50"
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
                سيتم مراجعة طلبك وتفعيل القالب خلال 24 ساعة كحد أقصى
              </p>
              <p className="text-sm text-gray-500">
                سيصلك إشعار عند التفعيل
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}