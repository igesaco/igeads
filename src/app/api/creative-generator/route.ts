import { NextResponse } from 'next/server';
import { getGeminiClient, GEMINI_MODELS } from '@/lib/gemini';

function detectSector(name: string): 'cleaning' | 'b2b_marketing' | 'clothing' | 'general' {
  const lower = name.toLowerCase();
  if (lower.includes('clean') || lower.includes('temizlik') || lower.includes('koltuk') || lower.includes('hijyen') || lower.includes('yıkama') || lower.includes('mandalin')) {
    return 'cleaning';
  }
  if (lower.includes('ige') || lower.includes('ads') || lower.includes('pazarlama') || lower.includes('ajans') || lower.includes('yazılım') || lower.includes('danışmanlık') || lower.includes('b2b')) {
    return 'b2b_marketing';
  }
  if (lower.includes('ceket') || lower.includes('mont') || lower.includes('giyim') || lower.includes('elbise') || lower.includes('deri')) {
    return 'clothing';
  }
  return 'general';
}

function getSectorFallback(productName: string, sector: 'cleaning' | 'b2b_marketing' | 'clothing' | 'general') {
  if (sector === 'cleaning') {
    return {
      hooks: [
        `"Bize bu eşyayı 'asla temizlenmez, çöpe atın' dediler... Ama ${productName} farkı tam burada devreye girdi!"`,
        `"Hafta sonunuzu saatlerce temizlikle heba etmekten yoruldunuz mu? İşte 1 günde sıfır gibi yapan çözüm:"`,
        `"Evinize veya ofisinize profesyonel temizlik ekibi çağırmadan önce bu 3 kritik kuralı bilmelisiniz!"`
      ],
      primaryText: `${productName} ile yaşam alanlarınızda gerçek hijyen ve ferahlığı hissedin. Alman teknolojisi profesyonel vakumlu yıkama ve antialerjik solüsyonlarımızla en zorlu lekeleri bile liflerinden söküp atıyoruz. Hemen randevu alın, aynı gün yerinde temizlik konforunu yaşayın!`,
      headline: `Profesyonel Yerinde Temizlik & Hijyen Hizmeti - ${productName}`,
      cta: 'Hemen Fiyat Al / Randevu Oluştur'
    };
  }

  if (sector === 'b2b_marketing') {
    return {
      hooks: [
        `"Meta ve Google Ads bütçenizi tüketip sıfır dönüşüm almaktan sıkılmadınız mı? İşte kaçırdığınız o kritik ayar:"`,
        `"${productName} ile ROAS oranınızı 2 haftada 2 katına çıkaracak yapay zeka reklam stratejisi!"`,
        `"E-ticaret markaları 2026'da neden manuel reklam yönetimini bırakıp otonom sistemlere geçiyor?"`
      ],
      primaryText: `${productName} ile reklam bütçenizi israf etmekten kurtulun! Canlı ROAS/POAS takibi, akıllı bütçe kaydırma ve viral kanca motorumuzla e-ticaret cironuzu katlayın. Ücretsiz büyüme analizinizi bugün başlatın.`,
      headline: `Otonom Reklam Optimizasyonu & Satış Büyüme Sistemi - ${productName}`,
      cta: 'Ücretsiz Analiz Başlat'
    };
  }

  if (sector === 'clothing') {
    return {
      hooks: [
        `"Sıradan kıyafetlerin ilk yıkamada formunu kaybetmesinden bıktınız mı? İşte fark:"`,
        `"Gardırobunuzun en şık parçası olacak ${productName} sınırlı stokla yeniden satışta!"`,
        `"POV: Giydiğin anda ortamdaki tüm bakışların sana döndüğü o özel tasarım..."`
      ],
      primaryText: `Özel kalıp ve premium kumaş işçiliğiyle hazırlanan ${productName}, tarzınıza kusursuz bir dokunuş katıyor. Bugün sipariş verin, hızlı kargo ve koşulsuz değişim avantajından yararlanın.`,
      headline: `Premium Özel Tasarım Koleksiyon - ${productName}`,
      cta: 'Koleksiyonu İncele'
    };
  }

  return {
    hooks: [
      `"${productName} arayışında olanların %90'ının yaptığı o büyük hata..."`,
      `"İşte sektörün sır gibi sakladığı ve ${productName} deneyimini tamamen değiştiren yöntem!"`,
      `"Eğer siz de en yüksek kalite ve güveni arıyorsanız, ${productName} ile tanışma zamanınız geldi."`
    ],
    primaryText: `${productName} ile beklentilerinizin ötesine geçin. Yüksek müşteri memnuniyeti, garantili hizmet ve üstün kalite standardıyla yanınızdayız. Şimdi iletişime geçin, özel avantajları yakalayın.`,
    headline: `Garantili ve Üstün Kalite Standardı: ${productName}`,
    cta: 'Detaylı Bilgi & Keşfet'
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { productName = 'Mandalin Clean Temizlik Hizmeti', platform = 'TikTok / Reels', tone = 'Cesur & Merak Uyandırıcı' } = body;

    const sector = detectSector(productName);

    const activeGeminiClient = getGeminiClient();
    if (activeGeminiClient) {
      const prompt = `
Ürün veya Hizmet: "${productName}"
Platform: "${platform}"
Ton: "${tone}"

Bu ürün/hizmet için sektöre tam uygun (örneğin temizlik ise koltuk/ev hijyeni; ajans ise reklam bütçesi/ROAS; giyim ise kumaş/tasarım) yüksek dönüşüm getirecek 3 adet viral video kancası (hook), 1 adet reklam birincil metni (primary text) ve 1 adet dikkat çekici başlık (headline) oluştur.
Kesinlikle ilgisiz sektör kelimeleri (örneğin temizlik için ceket, deri gibi) KULLANMA. Doğrudan bu hizmete/ürüne odaklan.

JSON formatında döndür:
{
  "hooks": ["kanca 1", "kanca 2", "kanca 3"],
  "primaryText": "...",
  "headline": "...",
  "cta": "..."
}
`;
      for (const modelName of GEMINI_MODELS) {
        try {
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 4500));
          const aiPromise = activeGeminiClient.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              temperature: 0.8,
              responseMimeType: 'application/json'
            }
          });

          const response: any = await Promise.race([aiPromise, timeoutPromise]);
          const json = JSON.parse(response.text || '{}');
          if (json.hooks && json.hooks.length > 0) {
            return NextResponse.json({ success: true, data: json, engine: modelName });
          }
        } catch (e: any) {
          console.warn(`Creative generator: Model ${modelName} failed or timed out:`, e.message);
        }
      }
    }

    // Dynamic High-Converting Sector-Aware Fallback
    const fallbackData = getSectorFallback(productName, sector);
    return NextResponse.json({
      success: true,
      data: fallbackData,
      engine: 'sector-aware-template-engine'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Üretim hatası' }, { status: 500 });
  }
}
