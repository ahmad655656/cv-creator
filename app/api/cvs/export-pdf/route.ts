import { NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import React from 'react';
import CVPDFDocument from '@/lib/pdf/CVPDFDocument';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      cvData,
      templateSlug,
      templateConfig,
      sectionVisibility,
      sectionOrder,
      sectionStyleOverrides
    } = body;

    if (!cvData) {
      return NextResponse.json(
        { error: 'Missing CV data' },
        { status: 400 }
      );
    }

    // إنشاء PDF
    const pdfElement = React.createElement(CVPDFDocument, {
      cvData,
      templateSlug,
      templateConfig,
      sectionVisibility,
      sectionOrder,
      sectionStyleOverrides
    }) as unknown as React.ReactElement;

    const pdfBuffer = await renderToBuffer(pdfElement);

    const baseName = String(cvData?.personalInfo?.fullName || 'cv')
      .replace(/[\\/:*?"<>|]/g, '-')
      .trim() || 'cv';

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${baseName}.pdf"`,
      },
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);

    return NextResponse.json(
      { error: 'PDF generation failed' },
      { status: 500 }
    );
  }
}
