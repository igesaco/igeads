import { NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenant';
import { generateAiImage } from '@/lib/image-gen';

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
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
