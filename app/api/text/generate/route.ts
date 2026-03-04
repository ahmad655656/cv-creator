import { NextResponse } from 'next/server';
import { ornamentEngine } from '@/lib/text-ornaments/engine';

export async function GET() {
  return NextResponse.json({
    templates: ornamentEngine.listTemplates()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const text = String(body?.text ?? '').trim().slice(0, 300);
    const templateId = String(body?.templateId ?? '').trim();

    if (!text) {
      return NextResponse.json({ error: 'text_required' }, { status: 400 });
    }
    if (!templateId) {
      return NextResponse.json({ error: 'template_id_required' }, { status: 400 });
    }

    const result = ornamentEngine.applyTemplate(templateId, text);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    if (message.startsWith('template_not_found:')) {
      return NextResponse.json({ error: message }, { status: 404 });
    }
    return NextResponse.json({ error: 'unexpected_server_error', details: message }, { status: 500 });
  }
}
