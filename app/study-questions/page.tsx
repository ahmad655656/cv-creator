'use client';

import { FormEvent, useMemo, useState } from 'react';

type QAItem = {
  question: string;
  answer: string;
};

export default function StudyQuestionsPage() {
  const [text, setText] = useState('');
  const [count, setCount] = useState(8);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [questions, setQuestions] = useState<QAItem[]>([]);

  const imageName = useMemo(() => image?.name ?? '', [image]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setQuestions([]);

    if (!text.trim() && !image) {
      setError('أدخل نصا أو ارفع صورة درس على الأقل.');
      return;
    }

    const formData = new FormData();
    formData.append('text', text);
    formData.append('count', String(count));
    if (image) {
      formData.append('image', image);
    }

    try {
      setLoading(true);
      const response = await fetch('/api/study/questions', {
        method: 'POST',
        body: formData,
      });

      const data = (await response.json()) as {
        error?: string;
        details?: string;
        questions?: QAItem[];
      };

      if (!response.ok) {
        const details = (data.details || '').toString().trim();
        setError(details ? `${data.error || 'فشل توليد الأسئلة.'} - ${details}` : (data.error || 'فشل توليد الأسئلة.'));
        return;
      }

      setQuestions(data.questions || []);
    } catch {
      setError('تعذر الاتصال بالخدمة. حاول مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-sky-100 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            مولد الأسئلة الذكي للطلاب
          </h1>
          <p className="mt-2 text-gray-600">
            ارفع صورة درس نصي أو الصق أي فقرة، وسنولد لك أسئلة احترافية مع الجواب تحت كل سؤال.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                النص (اختياري إذا رفعت صورة)
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                placeholder="الصق هنا نص الدرس أو الفقرة..."
                className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  صورة الدرس (PNG / JPG / WEBP)
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                  className="block w-full rounded-xl border border-gray-300 p-2 text-sm file:ml-3 file:rounded-lg file:border-0 file:bg-sky-600 file:px-3 file:py-2 file:text-white hover:file:bg-sky-700"
                />
                {imageName && <p className="mt-1 text-xs text-gray-500">الملف: {imageName}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  عدد الأسئلة
                </label>
                <input
                  type="number"
                  min={3}
                  max={20}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value) || 8)}
                  className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-sky-600 px-6 py-3 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'جاري توليد الأسئلة...' : 'توليد الأسئلة والإجابات'}
            </button>
          </form>
        </div>

        {questions.length > 0 && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-xl font-bold text-gray-900">النتيجة</h2>
            <div className="mt-4 space-y-4">
              {questions.map((item, index) => (
                <div key={`${item.question}-${index}`} className="rounded-xl border border-gray-200 p-4">
                  <p className="font-semibold text-gray-900">
                    {index + 1}. {item.question}
                  </p>
                  <p className="mt-2 text-gray-700">
                    <span className="font-semibold text-sky-700">الجواب:</span> {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
