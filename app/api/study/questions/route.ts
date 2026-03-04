import { NextResponse } from 'next/server';

type DifficultyLevel = 'easy' | 'medium' | 'hard';
type OutputLanguage = 'ar' | 'en';

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

type AnalysisResponse = {
  analysis: AnalysisOutput;
  meta: {
    provider: 'ollama-local' | 'local-fallback';
    reason?: string;
  };
  source: {
    textLength: number;
    wordCount: number;
    extractedFromImage: boolean;
  };
};

type OllamaGenerateResponse = {
  response?: string;
};

const AR_STOPWORDS = new Set([
  'من', 'الى', 'إلى', 'على', 'في', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'تلك', 'التي', 'الذي', 'كما', 'لقد', 'ثم',
  'كان', 'كانت', 'يكون', 'تكون', 'تم', 'هو', 'هي', 'هم', 'هن', 'او', 'أو', 'و', 'ما', 'لا', 'لم', 'لن', 'قد',
  'بعد', 'قبل', 'كل', 'أي', 'ان', 'أن', 'اذا', 'إذا', 'حتى', 'هناك', 'هنا', 'ضمن', 'حول', 'بين'
]);

const EN_STOPWORDS = new Set([
  'the', 'and', 'or', 'to', 'of', 'in', 'on', 'at', 'for', 'with', 'from', 'as', 'is', 'are', 'was', 'were',
  'be', 'been', 'being', 'this', 'that', 'these', 'those', 'it', 'its', 'by', 'an', 'a', 'but', 'if', 'then',
  'than', 'into', 'about', 'over', 'under', 'very', 'can', 'could', 'should', 'would'
]);

function splitSentences(text: string): string[] {
  return text
    .split(/[.!?؟\n]+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 20);
}

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || []).filter((w) => w.length >= 3);
}

function buildKeywordScores(text: string): Map<string, number> {
  const map = new Map<string, number>();
  const tokens = tokenize(text);
  for (const token of tokens) {
    if (AR_STOPWORDS.has(token) || EN_STOPWORDS.has(token)) continue;
    map.set(token, (map.get(token) || 0) + 1);
  }
  return map;
}

function topKeywords(scores: Map<string, number>, limit: number): string[] {
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map((entry) => entry[0]);
}

function sentenceScore(sentence: string, scores: Map<string, number>): number {
  const tokens = tokenize(sentence);
  if (!tokens.length) return 0;
  let score = 0;
  for (const token of tokens) score += scores.get(token) || 0;
  return score / Math.sqrt(tokens.length);
}

function takeTopSentences(sentences: string[], scores: Map<string, number>, limit: number): string[] {
  return sentences
    .map((sentence, index) => ({ sentence, score: sentenceScore(sentence, scores), index }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .sort((a, b) => a.index - b.index)
    .map((row) => row.sentence);
}

function firstNWords(text: string, n: number): string {
  return text.split(/\s+/).filter(Boolean).slice(0, n).join(' ');
}

function parseFirstJsonObject(text: string): Record<string, unknown> | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asStringArray(value: unknown, limit: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => String(item || '').trim())
    .filter(Boolean)
    .slice(0, limit);
}

function sanitizeQuestions(value: unknown, limit: number): QAItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item as Partial<QAItem>;
      return {
        question: String(row?.question || '').trim(),
        answer: String(row?.answer || '').trim()
      };
    })
    .filter((item) => item.question && item.answer)
    .slice(0, limit);
}

function sanitizeFlashcards(value: unknown, limit: number): FlashcardItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item as Partial<FlashcardItem>;
      return {
        front: String(row?.front || '').trim(),
        back: String(row?.back || '').trim()
      };
    })
    .filter((item) => item.front && item.back)
    .slice(0, limit);
}

function sanitizeQuiz(value: unknown, limit: number): QuizItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item as Partial<QuizItem>;
      const options = Array.isArray(row?.options)
        ? row.options.map((opt) => String(opt || '').trim()).filter(Boolean).slice(0, 4)
        : [];
      return {
        question: String(row?.question || '').trim(),
        options,
        answer: String(row?.answer || '').trim(),
        explanation: String(row?.explanation || '').trim()
      };
    })
    .filter((item) => item.question && item.answer && item.options.length >= 2)
    .slice(0, limit);
}

function sanitizeGlossary(value: unknown, limit: number): GlossaryItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const row = item as Partial<GlossaryItem>;
      return {
        term: String(row?.term || '').trim(),
        definition: String(row?.definition || '').trim()
      };
    })
    .filter((item) => item.term && item.definition)
    .slice(0, limit);
}

function buildLocalAnalysis(text: string, count: number, language: OutputLanguage, difficulty: DifficultyLevel): AnalysisOutput {
  const sentences = splitSentences(text);
  const scores = buildKeywordScores(text);
  const keywords = topKeywords(scores, 12);
  const strongest = takeTopSentences(sentences, scores, Math.min(Math.max(3, Math.floor(count / 2)), 8));

  const summary = strongest.length
    ? strongest.slice(0, 3).join(language === 'ar' ? '، ' : '. ')
    : firstNWords(text, 60);

  const keyPoints = strongest.length ? strongest : [firstNWords(text, 40)];

  const questions: QAItem[] = Array.from({ length: count }, (_, i) => {
    const source = keyPoints[i % keyPoints.length] || summary;
    return {
      question:
        language === 'ar'
          ? `ما الفكرة الأساسية في العبارة التالية؟ "${firstNWords(source, 14)}..."`
          : `What is the core idea behind: "${firstNWords(source, 14)}..."?`,
      answer: source
    };
  });

  const flashcards: FlashcardItem[] = keyPoints.slice(0, Math.min(10, keyPoints.length)).map((point, i) => ({
    front:
      language === 'ar'
        ? `بطاقة ${i + 1}: اشرح هذا المفهوم`
        : `Card ${i + 1}: Explain this concept`,
    back: point
  }));

  const fallbackOptions = keywords.length >= 4 ? keywords.slice(0, 4) : ['Concept A', 'Concept B', 'Concept C', 'Concept D'];
  const quiz: QuizItem[] = keyPoints.slice(0, Math.min(6, keyPoints.length)).map((point, i) => {
    const answer = keywords[i % Math.max(1, keywords.length)] || firstNWords(point, 2);
    const options = [...new Set([answer, ...fallbackOptions])].slice(0, 4);
    while (options.length < 4) options.push(`Option ${options.length + 1}`);
    return {
      question:
        language === 'ar'
          ? `أي خيار يرتبط أكثر بهذه الفكرة؟ "${firstNWords(point, 12)}..."`
          : `Which option best matches this point: "${firstNWords(point, 12)}..."?`,
      options,
      answer,
      explanation:
        language === 'ar'
          ? `السبب: النص يربط الفكرة مباشرة بـ "${answer}".`
          : `Reason: the text directly ties this point to "${answer}".`
    };
  });

  const glossary: GlossaryItem[] = keywords.slice(0, 8).map((term) => {
    const exampleSentence = sentences.find((s) => s.toLowerCase().includes(term.toLowerCase())) || summary;
    return {
      term,
      definition:
        language === 'ar'
          ? `مصطلح محوري في النص، يظهر في سياق: "${firstNWords(exampleSentence, 14)}..."`
          : `Key term in the text, used in context: "${firstNWords(exampleSentence, 14)}..."`
    };
  });

  const pace = difficulty === 'hard' ? 'deep' : difficulty === 'easy' ? 'light' : 'balanced';
  const actionPlan =
    language === 'ar'
      ? [
          `ابدأ بقراءة الملخص ثم راجع ${Math.min(6, keyPoints.length)} نقاط رئيسية.`,
          `تدرّب على ${Math.min(10, questions.length)} أسئلة س/ج مع استرجاع الإجابة من الذاكرة.`,
          `راجع البطاقات التعليمية مرتين يوميًا (${pace} pace).`,
          'حل اختبار الاختيار المتعدد ثم ارجع لشرح كل إجابة خاطئة.'
        ]
      : [
          `Read the summary first, then cover ${Math.min(6, keyPoints.length)} key points.`,
          `Practice ${Math.min(10, questions.length)} Q&A prompts using active recall.`,
          `Review flashcards twice daily (${pace} pace).`,
          'Complete the MCQ quiz and revisit each incorrect explanation.'
        ];

  return {
    summary,
    keyPoints,
    questions,
    flashcards,
    quiz,
    glossary,
    actionPlan
  };
}

async function extractTextFromImage(imageFile: File): Promise<string> {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!allowedTypes.includes(imageFile.type)) {
    throw new Error('Supported image types are PNG, JPEG, WEBP only.');
  }

  const maxSizeBytes = 5 * 1024 * 1024;
  if (imageFile.size > maxSizeBytes) {
    throw new Error('Image is too large. Max size is 5MB.');
  }

  const buffer = Buffer.from(await imageFile.arrayBuffer());
  const { recognize } = await import('tesseract.js');
  const result = await recognize(buffer, 'ara+eng');
  return result.data.text?.trim() || '';
}

async function generateWithOllama(text: string, count: number, language: OutputLanguage, difficulty: DifficultyLevel): Promise<AnalysisOutput> {
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
  const model = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

  const prompt = `
You are a professional educational AI analyst.
Analyze the provided text and return STRICT JSON only.
Language: ${language === 'ar' ? 'Arabic' : 'English'}.
Difficulty: ${difficulty}.
Question count target: ${count}.

Required JSON schema:
{
  "summary": "string",
  "keyPoints": ["string"],
  "questions": [{"question":"string","answer":"string"}],
  "flashcards": [{"front":"string","back":"string"}],
  "quiz": [{"question":"string","options":["a","b","c","d"],"answer":"string","explanation":"string"}],
  "glossary": [{"term":"string","definition":"string"}],
  "actionPlan": ["string"]
}

Rules:
- Use only facts grounded in the input text.
- Keep outputs concise, clear, and study-friendly.
- questions length should be close to ${count}.
- quiz should have 4 options per item and include the exact answer text.

TEXT:
${text}
  `.trim();

  const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: 'json',
      options: { temperature: 0.2, top_p: 0.9 }
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`ollama_failed status=${response.status} ${details}`);
  }

  const payload = (await response.json()) as OllamaGenerateResponse;
  const modelText = String(payload.response || '').trim();
  const parsed = parseFirstJsonObject(modelText);
  if (!parsed) {
    throw new Error('ollama_invalid_json_output');
  }

  const output: AnalysisOutput = {
    summary: String(parsed.summary || '').trim(),
    keyPoints: asStringArray(parsed.keyPoints, 12),
    questions: sanitizeQuestions(parsed.questions, Math.min(20, Math.max(3, count))),
    flashcards: sanitizeFlashcards(parsed.flashcards, 15),
    quiz: sanitizeQuiz(parsed.quiz, 10),
    glossary: sanitizeGlossary(parsed.glossary, 12),
    actionPlan: asStringArray(parsed.actionPlan, 8)
  };

  if (!output.summary) {
    throw new Error('ollama_missing_summary');
  }
  if (!output.questions.length) {
    throw new Error('ollama_missing_questions');
  }

  return output;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const sourceText = String(formData.get('text') ?? '').trim();
    const rawCount = Number(formData.get('count') ?? 8);
    const count = Number.isFinite(rawCount) ? Math.min(Math.max(Math.floor(rawCount), 3), 20) : 8;
    const difficultyRaw = String(formData.get('difficulty') ?? 'medium').toLowerCase();
    const languageRaw = String(formData.get('language') ?? 'ar').toLowerCase();
    const difficulty: DifficultyLevel = difficultyRaw === 'easy' || difficultyRaw === 'hard' ? difficultyRaw : 'medium';
    const language: OutputLanguage = languageRaw === 'en' ? 'en' : 'ar';
    const image = formData.get('image');
    const hasImage = image instanceof File && image.size > 0;

    if (!sourceText && !hasImage) {
      return NextResponse.json({ error: 'Please provide text or upload an image.' }, { status: 400 });
    }

    let imageText = '';
    if (hasImage) {
      try {
        imageText = await extractTextFromImage(image as File);
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Failed to read text from image',
            details: error instanceof Error ? error.message : 'OCR error'
          },
          { status: 400 }
        );
      }
    }

    const combinedText = [sourceText, imageText].filter(Boolean).join('\n\n');
    if (!combinedText.trim()) {
      return NextResponse.json(
        { error: 'No readable text found. Please provide clearer text/image.' },
        { status: 400 }
      );
    }

    const wordCount = combinedText.split(/\s+/).filter(Boolean).length;

    try {
      const analysis = await generateWithOllama(combinedText, count, language, difficulty);
      const response: AnalysisResponse = {
        analysis,
        meta: { provider: 'ollama-local' },
        source: {
          textLength: combinedText.length,
          wordCount,
          extractedFromImage: hasImage
        }
      };
      return NextResponse.json(response);
    } catch (error) {
      const analysis = buildLocalAnalysis(combinedText, count, language, difficulty);
      const response: AnalysisResponse = {
        analysis,
        meta: {
          provider: 'local-fallback',
          reason: error instanceof Error ? error.message : 'unknown_error'
        },
        source: {
          textLength: combinedText.length,
          wordCount,
          extractedFromImage: hasImage
        }
      };
      return NextResponse.json(response);
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Unexpected server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
