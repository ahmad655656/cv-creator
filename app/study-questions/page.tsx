'use client';

import { FormEvent, useMemo, useState } from 'react';

type QAItem = {
  question: string;
  answer: string;
};

type FlashcardItem = {
  front: string;
  back: string;
};

type QuizItem = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

type GlossaryItem = {
  term: string;
  definition: string;
};

type AnalysisOutput = {
  summary: string;
  keyPoints: string[];
  questions: QAItem[];
  flashcards: FlashcardItem[];
  quiz: QuizItem[];
  glossary: GlossaryItem[];
  actionPlan: string[];
};

type AnalysisResult = {
  analysis: AnalysisOutput;
  meta?: { provider?: string; reason?: string };
  source?: { textLength?: number; wordCount?: number; extractedFromImage?: boolean };
  error?: string;
  details?: string;
};

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default function StudyQuestionsPage() {
  const [text, setText] = useState('');
  const [count, setCount] = useState(8);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<AnalysisOutput | null>(null);
  const [meta, setMeta] = useState<{ provider?: string; reason?: string } | null>(null);
  const [sourceStats, setSourceStats] = useState<{ textLength?: number; wordCount?: number; extractedFromImage?: boolean } | null>(null);

  const imageName = useMemo(() => image?.name ?? '', [image]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setMeta(null);
    setSourceStats(null);

    if (!text.trim() && !image) {
      setError('ادخل نصا او ارفع صورة على الاقل.');
      return;
    }

    const formData = new FormData();
    formData.append('text', text);
    formData.append('count', String(count));
    formData.append('difficulty', difficulty);
    formData.append('language', language);
    if (image) {
      formData.append('image', image);
    }

    try {
      setLoading(true);
      const response = await fetch('/api/study/questions', {
        method: 'POST',
        body: formData
      });

      const data = (await response.json()) as AnalysisResult;
      if (!response.ok) {
        const details = (data.details || '').toString().trim();
        setError(details ? `${data.error || 'فشل التحليل.'} - ${details}` : data.error || 'فشل التحليل.');
        return;
      }

      setResult(data.analysis);
      setMeta(data.meta || null);
      setSourceStats(data.source || null);
    } catch {
      setError('تعذر الاتصال بالخدمة. حاول مرة اخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">AI Study Lab</h1>
          <p className="mt-2 text-gray-600">
            حلل النص باحترافية واحصل على ملخص ذكي، نقاط رئيسية، اسئلة واجوبة، بطاقات تعليمية، اختبار MCQ، قاموس مصطلحات وخطة مذاكرة.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">النص</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={9}
                placeholder="الصق النص هنا..."
                className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">الصورة (اختياري)</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                  className="block w-full rounded-xl border border-gray-300 p-2 text-sm file:ml-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white hover:file:bg-blue-700"
                />
                {imageName && <p className="mt-1 text-xs text-gray-500">الملف: {imageName}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">عدد الاسئلة</label>
                <input
                  type="number"
                  min={3}
                  max={20}
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value) || 8)}
                  className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">الصعوبة</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="easy">سهل</option>
                  <option value="medium">متوسط</option>
                  <option value="hard">متقدم</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">اللغة</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'ar' | 'en')}
                  className="w-full rounded-xl border border-gray-300 p-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'جاري التحليل الذكي...' : 'ابدأ التحليل بالذكاء الاصطناعي'}
            </button>
          </form>
        </div>

        {result && (
          <div className="mt-8 space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-slate-900 px-2 py-1 text-xs text-white">Provider: {meta?.provider || 'unknown'}</span>
                {sourceStats?.wordCount ? <span>Words: {sourceStats.wordCount}</span> : null}
                {sourceStats?.textLength ? <span>Chars: {sourceStats.textLength}</span> : null}
                {sourceStats?.extractedFromImage ? <span>OCR: on</span> : null}
              </div>
              {meta?.reason ? <p className="mt-2 text-xs text-slate-500">Fallback reason: {meta.reason}</p> : null}
            </div>

            <SectionCard title="الملخص الذكي">
              <p className="leading-8 text-gray-800">{result.summary}</p>
            </SectionCard>

            <SectionCard title="النقاط الرئيسية">
              <ul className="space-y-2">
                {result.keyPoints.map((point, index) => (
                  <li key={`${point}-${index}`} className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-gray-800">
                    {point}
                  </li>
                ))}
              </ul>
            </SectionCard>

            <SectionCard title="اسئلة واجوبة">
              <div className="space-y-3">
                {result.questions.map((item, index) => (
                  <div key={`${item.question}-${index}`} className="rounded-xl border border-gray-200 p-4">
                    <p className="font-semibold text-gray-900">
                      {index + 1}. {item.question}
                    </p>
                    <p className="mt-2 text-gray-700">{item.answer}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="بطاقات تعليمية">
              <div className="grid gap-3 md:grid-cols-2">
                {result.flashcards.map((item, index) => (
                  <div key={`${item.front}-${index}`} className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <p className="font-semibold text-blue-900">{item.front}</p>
                    <p className="mt-2 text-blue-800">{item.back}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="اختبار اختيار من متعدد">
              <div className="space-y-4">
                {result.quiz.map((item, index) => (
                  <div key={`${item.question}-${index}`} className="rounded-xl border border-gray-200 p-4">
                    <p className="font-semibold text-gray-900">
                      {index + 1}. {item.question}
                    </p>
                    <div className="mt-3 grid gap-2 md:grid-cols-2">
                      {item.options.map((option, optionIndex) => (
                        <div
                          key={`${option}-${optionIndex}`}
                          className={`rounded-lg border p-2 text-sm ${
                            option === item.answer ? 'border-green-300 bg-green-50 text-green-800' : 'border-gray-200 bg-gray-50 text-gray-700'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-gray-600">{item.explanation}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="قاموس المصطلحات">
              <div className="grid gap-3 md:grid-cols-2">
                {result.glossary.map((item, index) => (
                  <div key={`${item.term}-${index}`} className="rounded-xl border border-violet-200 bg-violet-50 p-4">
                    <p className="font-semibold text-violet-900">{item.term}</p>
                    <p className="mt-2 text-violet-800">{item.definition}</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="خطة مذاكرة ذكية">
              <ol className="space-y-2">
                {result.actionPlan.map((step, index) => (
                  <li key={`${step}-${index}`} className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900">
                    {index + 1}. {step}
                  </li>
                ))}
              </ol>
            </SectionCard>
          </div>
        )}
      </div>
    </div>
  );
}
