import { NextResponse } from 'next/server';
import { requireTenant } from '@/lib/tenant';
import { getGeminiClient, GEMINI_MODELS } from '@/lib/gemini';

/**
 * Breaks down a competitor video ad from the user's own description and writes a counter-script.
 * The video itself is not downloaded: social platforms do not allow fetching it server side.
 */
export async function POST(request: Request) {
  const tenant = await requireTenant(request);
  if (tenant instanceof NextResponse) return tenant;

  const body = await request.json().catch(() => ({}));
  const description = String(body.description || '').trim().slice(0, 3000);
  const product = String(body.product || '').trim().slice(0, 300);
  const videoUrl = String(body.videoUrl || '').trim().slice(0, 500);
  if (description.length < 20) {
    return NextResponse.json({ success: false, error: 'Videoda ne olduğunu en az birkaç cümleyle anlatın.' }, { status: 400 });
  }

  const client = getGeminiClient();
  if (!client) {
    return NextResponse.json({ success: false, error: 'Yapay zeka anahtarı (GEMINI_API_KEY) tanımlı değil.' }, { status: 503 });
  }

  const prompt = `Sen deneyimli bir performans reklamı kreatif stratejistisin.
Bir rakip video reklamı, kullanıcının anlattığı haliyle aşağıda. Bu anlatıma dayanarak (uydurma veri ekleme) reklamı çözümle
ve ${product ? `"${product}" ürünü için` : 'kullanıcının markası için'} daha güçlü bir karşı senaryo yaz.
${videoUrl ? `Video bağlantısı (yalnızca bağlam için): ${videoUrl}\n` : ''}
Rakip videonun anlatımı:
"""${description}"""

SADECE şu JSON'u döndür (Türkçe):
{
  "hookAnalysis": "ilk 3 saniyede kullanılan kanca ve neden işe yaradığı",
  "hookScore": 0-100 arası tam sayı,
  "visualPacing": "kurgu ve tempo hakkında anlatımdan çıkarılabilenler",
  "secretConversionFactor": "satışa dönüştüren asıl psikolojik etken",
  "antiScript": {
    "hook": "bizim kancamız",
    "timeline": ["0-3 sn: ...", "3-7 sn: ...", "7-12 sn: ...", "12-15 sn: ..."],
    "soundSuggestion": "ses/müzik önerisi",
    "callToAction": "harekete geçirici mesaj"
  }
}`;

  let lastError = '';
  for (const model of GEMINI_MODELS) {
    try {
      const response: any = await client.models.generateContent({
        model,
        contents: prompt,
        config: { temperature: 0.7, responseMimeType: 'application/json' }
      });
      const data = JSON.parse(response?.text || '');
      if (data?.antiScript?.timeline) {
        return NextResponse.json({ success: true, data });
      }
    } catch (err: any) {
      lastError = err.message || String(err);
    }
  }

  console.warn('Video vision generation failed:', lastError);
  return NextResponse.json({ success: false, error: 'Yapay zeka şu an yanıt vermedi, lütfen tekrar deneyin.' }, { status: 502 });
}
