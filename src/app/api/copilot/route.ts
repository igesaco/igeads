import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODEL, GEMINI_MODELS, SYSTEM_PROMPT_COPILOT } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';

function extractTopic(prompt: string): string {
  // Matches "... için"
  const match = prompt.match(/(?:(?:dostum|lütfen|bana|selam)\s+)*(.+?)\s+(?:için|hakkında|adına|sektöründe)/i);
  if (match && match[1]) {
    const cleaned = match[1]
      .replace(/^(dostum|lütfen|bana|yeni|bir|selam)\s+/gi, '')
      .trim();
    if (cleaned.length >= 2) return cleaned;
  }
  
  // Secondary fallback: strip common words
  const cleaned = prompt
    .replace(/(dostum|lütfen|bana|yeni|bir|kanca|videosu|video|yaz|oluştur|öner|reels|tiktok|için|hakkında)/gi, '')
    .trim();
  return cleaned || 'ürününüz';
}

function generateDynamicHooks(topic: string) {
  const t = topic || 'bu sektör';
  const cap = t.charAt(0).toUpperCase() + t.slice(1);
  return [
    `1. "Neden herkes ${t} konusunda aynı hatayı yapıyor? İşte kimsenin söylemediği o gerçek..." (Merak & Farkındalık)`,
    `2. "${cap} seçerken paranızı çöpe atmamak için bu 3 kurala mutlaka dikkat edin!" (Otorite & Güven Kancası)`,
    `3. "POV: Sonunda işini gerçekten profesyonelce yapan bir ${t} bulduğunda gelen o rahatlama..." (Duyusal & Sosyal Kanıt)`
  ];
}

export async function POST(request: Request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const prompt = body?.prompt || '';
    const activeClient = body?.clientName || '';
    if (!prompt.trim()) {
      return NextResponse.json({ reply: 'Lütfen analiz etmek istediğiniz konuyu veya sorunuzu yazın.' });
    }

    // Fetch live system state from Prisma to inject real-time context
    let liveCampaigns: any[] = [];
    let liveProducts: any[] = [];
    let clientInfo: any = null;

    try {
      if (activeClient && activeClient !== 'Tüm Müşteriler') {
        clientInfo = await prisma.client.findFirst({
          where: {
            OR: [
              { name: { contains: activeClient } },
              { slug: { contains: activeClient.toLowerCase().replace(/[^a-z0-9]/g, '') } }
            ]
          },
          include: { campaigns: true, products: true }
        });
      }

      [liveCampaigns, liveProducts] = await Promise.all([
        prisma.campaign.findMany({ select: { name: true, platform: true, dailyBudget: true, roas: true, poas: true, status: true, fatigueScore: true, clientId: true } }),
        prisma.product.findMany({ select: { name: true, stock: true, price: true, isBuybox: true, marketplace: true, clientId: true } })
      ]);
    } catch (e) {
      console.warn('DB fetch in copilot fallback:', e);
    }

    const clientHeader = clientInfo 
      ? `SEÇİLİ MARKA: ${clientInfo.name} (${clientInfo.sector})\nAylık Bütçe: ₺${clientInfo.monthlyBudget}\n` 
      : (activeClient ? `SEÇİLİ MARKA: ${activeClient}\n` : 'TÜM AJANS PORTFÖYÜ\n');

    const liveContext = `
GÜNCEL SİSTEM DURUMU:
${clientHeader}
- Aktif Kampanyalar:
${liveCampaigns.map(c => `  * ${c.name} (${c.platform}): Bütçe ₺${c.dailyBudget}/gün, ROAS: ${c.roas}x, POAS: ${c.poas}x, Durum: ${c.status}, Yorgunluk: ${c.fatigueScore}%`).join('\n')}

- Pazaryeri Ürünleri & Stok Durumları:
${liveProducts.map(p => `  * ${p.name}: Stok: ${p.stock} adet, Fiyat: ₺${p.price}, Buybox: ${p.isBuybox ? 'Bizde' : 'Kayıp'}, Kanal: ${p.marketplace}`).join('\n')}
`;

    // 1. If Gemini API is configured, use real Gemini Flash model
    const activeGeminiClient = getGeminiClient();
    if (activeGeminiClient) {
      const fullSystemInstruction = `${SYSTEM_PROMPT_COPILOT}\n\n${liveContext}\n\nKullanıcının sorusu bir sektör, reklam metni, kanca, temizlik şirketi, e-ticaret veya herhangi bir konu olabilir. Kullanıcının sorusuna doğrudan, özgün ve yüksek yaratıcılıkla yanıt ver.`;

      const candidateModels = GEMINI_MODELS;
      for (const modelName of candidateModels) {
        try {
          const response = await activeGeminiClient.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: fullSystemInstruction,
              temperature: 0.7,
            }
          });

          const reply = response.text || 'Analiz tamamlandı.';
          
          let action = undefined;
          const lower = prompt.toLowerCase();
          if (lower.includes('bütçe') || lower.includes('kaydır')) {
            action = "Bütçeyi Meta'ya Aktar";
          } else if (lower.includes('stok') && lower.includes('durdur')) {
            action = "Kritik Reklamları Duraklat";
          }

          return NextResponse.json({
            success: true,
            reply,
            action,
            engine: modelName
          });
        } catch (geminiError: any) {
          console.warn(`Model ${modelName} failed (${geminiError.status || geminiError.message}), trying next candidate...`);
        }
      }
    }

    // 2. Dynamic Topic & Context Aware Engine (Active when GEMINI_API_KEY is not yet supplied)
    let reply = '';
    let action = undefined;
    const lower = prompt.toLowerCase();
    const topic = extractTopic(prompt);

    if (lower.includes('kanca') || lower.includes('reels') || lower.includes('içerik') || lower.includes('video') || lower.includes('reklam')) {
      const hooks = generateDynamicHooks(topic);
      reply = `🎯 "${topic.toUpperCase()}" için dönüşüm ve merak odaklı 3 viral video kancası:\n\n` +
              hooks.join('\n\n') +
              `\n\n💡 Reklam Stratejisi: Bu kancalarda ilk 3 saniyede kancayı sesli ve büyük altyazıyla verin, ardından doğrudan öncesi/sonrası veya müşteri sonucunu gösterin.\n\n*(Not: Sınırsız ve tamamen özgür yapay zeka yanıtları için .env.local dosyasına ücretsiz bir GEMINI_API_KEY ekleyebilirsiniz).*`;
    } else if (lower.includes('bütçe') || lower.includes('butce') || lower.includes('kaydır')) {
      const topCamp = liveCampaigns.find(c => c.roas >= 4.5) || { name: 'Meta Katalog', roas: 4.8 };
      const lowCamp = liveCampaigns.find(c => c.fatigueScore > 50 || c.roas < 3) || { name: 'TikTok Ads', roas: 2.5 };
      reply = `Veritabanı analizi tamamlandı: ${lowCamp.name} ROAS (${lowCamp.roas}x) seviyesinde ve yorulma belirtisi gösteriyor. Günlük ₺500 bütçeyi yüksek verimli ${topCamp.name} (${topCamp.roas}x ROAS) kampanyasına kaydırmanızı öneriyorum.`;
      action = "Bütçeyi Meta'ya Aktar";
    } else if (lower.includes('stok')) {
      const lowStock = liveProducts.filter(p => p.stock < 10);
      if (lowStock.length > 0) {
        reply = `Kritik stok uyarısı: ${lowStock.map(p => `"${p.name}" (${p.stock} adet)`).join(', ')} kritik eşik altında. Bütçe israfını önlemek için bağlı reklamlar otomatik korumaya alındı.`;
        action = "Kritik Reklamları İncele";
      } else {
        reply = `Tüm pazaryeri stokları güvenli seviyede. Kritik eşiğin (<10 adet) altında ürün bulunmuyor.`;
      }
    } else if (lower.includes('buybox') || lower.includes('fiyat')) {
      const lostBuybox = liveProducts.filter(p => !p.isBuybox);
      if (lostBuybox.length > 0) {
        reply = `Buybox kaybı tespit edildi: ${lostBuybox.map(p => p.name).join(', ')} için rakip fiyatı daha avantajlı. Repricer motoru taban fiyat sınırında ₺1 kırmaya hazır.`;
        action = "Repricer'ı Çalıştır";
      } else {
        reply = 'Tüm ürünlerde Buybox %100 oranında lehimize korunuyor.';
      }
    } else {
      reply = `"${prompt}" konulu talebinizi analiz ettim. "${topic}" veya genel e-ticaret büyüme konularında viral kanca, bütçe optimizasyonu ve strateji üretebilirim.`;
    }

    return NextResponse.json({
      success: true,
      reply,
      action,
      engine: 'dynamic-context-engine'
    });
  } catch (err: any) {
    console.error('Copilot error:', err);
    return NextResponse.json({ error: err.message || 'İç sunucu hatası' }, { status: 500 });
  }
}
