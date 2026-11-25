import { NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenant';
import { generateAiImage } from '@/lib/image-gen';

// Gemini image generation typically takes 10–30 seconds.
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
    const body = await request.json().catch(() => ({}));
    const result = await generateAiImage(body);
    if (!result.success) {
      return NextResponse.json(result, { status: 502 });
    }
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Image generation route error:', error);
    const dbDown = error?.code === 'P1001' || /reach database/i.test(error?.message || '');
    return NextResponse.json(
      {
        success: false,
        error: dbDown
          ? 'Sunucu veritabanına bağlanamadı. Birkaç saniye sonra tekrar deneyin.'
          : 'Görsel üretiminde beklenmeyen bir hata oluştu.'
      },
      { status: 500 }
    );
  }
}
