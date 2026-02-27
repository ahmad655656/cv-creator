import { NextResponse } from 'next/server';

type QAItem = {
  question: string;
  answer: string;
};

type OllamaGenerateResponse = {
  response?: string;
};

function extractJsonPayload(text: string): { questions: QAItem[] } | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) return null;

  const candidate = text.slice(start, end + 1);

  try {
    const parsed = JSON.parse(candidate) as { questions?: QAItem[] };
    if (!Array.isArray(parsed.questions)) return null;

    const questions = parsed.questions
      .map((item) => ({
        question: String(item?.question ?? '').trim(),
        answer: String(item?.answer ?? '').trim(),
      }))
      .filter((item) => item.question && item.answer);

    return questions.length ? { questions } : null;
  } catch {
    return null;
  }
}

function generateLocalQuestionsFromText(text: string, count: number): QAItem[] {
  const cleanedText = text.replace(/\s+/g, ' ').trim();
  if (!cleanedText) return [];

  const sentences = cleanedText
    .split(/[.!؟\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  if (sentences.length === 0) {
    return [{ question: 'ما الفكرة الأساسية في النص؟', answer: cleanedText.slice(0, 300) }];
  }

  const templates = [
    (s: string) => `ما المقصود بقول النص: "${s.slice(0, 60)}..."؟`,
    (s: string) => `اذكر شرحا موجزا للجملة: "${s.slice(0, 60)}..."`,
    (s: string) => `ما الفكرة التي تعرضها العبارة: "${s.slice(0, 60)}..."؟`,
    (s: string) => `كيف تفسر المعنى في: "${s.slice(0, 60)}..."؟`,
  ];

  return Array.from({ length: count }, (_, i) => {
    const sentence = sentences[i % sentences.length];
    return {
      question: templates[i % templates.length](sentence),
      answer: sentence,
    };
  });
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

async function generateWithOllama(text: string, count: number) {
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
  const model = process.env.OLLAMA_MODEL || 'qwen2.5:7b';

  const prompt =
    'أنت مساعد تعليمي احترافي. ' +
    `أنشئ ${count} أسئلة احترافية من النص التالي، وتحت كل سؤال ضع جوابا صحيحا من نفس النص فقط دون اختراع. ` +
    'أعد النتيجة بصيغة JSON فقط بالشكل: {"questions":[{"question":"...","answer":"..."}]}. ' +
    '\n\nالنص:\n' +
    text;

  const response = await fetch(`${ollamaBaseUrl}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt,
      stream: false,
      format: 'json',
      options: { temperature: 0.2 },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`ollama_failed status=${response.status} ${details}`);
  }

  const payload = (await response.json()) as OllamaGenerateResponse;
  const textOutput = String(payload.response ?? '').trim();
  const parsed = extractJsonPayload(textOutput);

  if (!parsed) {
    throw new Error('ollama_invalid_json_output');
  }

  return parsed.questions;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const sourceText = String(formData.get('text') ?? '').trim();
    const rawCount = Number(formData.get('count') ?? 8);
    const count = Number.isFinite(rawCount) ? Math.min(Math.max(Math.floor(rawCount), 3), 20) : 8;
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
            details: error instanceof Error ? error.message : 'OCR error',
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

    try {
      const questions = await generateWithOllama(combinedText, count);
      return NextResponse.json({ questions, meta: { provider: 'ollama-local' } });
    } catch (error) {
      const localQuestions = generateLocalQuestionsFromText(combinedText, count);
      return NextResponse.json({
        questions: localQuestions,
        meta: {
          provider: 'local-fallback',
          reason: error instanceof Error ? error.message : 'unknown_error',
        },
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Unexpected server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

