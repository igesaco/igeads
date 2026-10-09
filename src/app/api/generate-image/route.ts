import { NextResponse } from 'next/server';
import { generateAiImage } from '@/lib/image-gen';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await generateAiImage(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Image generation route error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Görsel üretiminde bir hata oluştu.' },
      { status: 500 }
    );
  }
}
