import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getGeminiClient, GEMINI_MODELS } from '@/lib/gemini';
import { createPortalKey } from '@/lib/auth';
import { requireTenant } from '@/lib/tenant';

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;

    const body = await request.json();
    const { clientSlug = '', period = 'Haftalık Büyüme & ROAS Raporu' } = body;
    if (!clientSlug) {
      return NextResponse.json({ error: 'Rapor için bir marka seçin' }, { status: 400 });
    }

    // 1. Fetch real client and campaign data
    const client = await prisma.client.findFirst({
      where: {
        organizationId: tenant.orgId,
        OR: [
          { slug: clientSlug },
          { slug: { contains: clientSlug.replace(/[^a-z0-9]/g, '') } },
          { name: { contains: clientSlug, mode: 'insensitive' } }
        ]
      },
      include: { campaigns: true }
    });

    if (!client) {
      return NextResponse.json({ error: 'Müşteri kaydı bulunamadı' }, { status: 404 });
    }

    // 2. Fetch tasks for this client
    const tasks = await prisma.agencyTask.findMany({
      where: { clientSlug: client.slug, organizationId: tenant.orgId },
      orderBy: { createdAt: 'desc' }
    });

    const campaigns = client.campaigns || [];
    const totalSpent = campaigns.reduce((acc, c) => acc + (c.spent || 0), 0);
    const totalRevenue = campaigns.reduce((acc, c) => acc + (c.revenue || 0), 0);
    // Without spend there is nothing to report; never show made-up ratios
    const roas = totalSpent > 0 ? (totalRevenue / totalSpent).toFixed(2) : '0';
    const netProfit = totalRevenue - totalSpent;
    const poas = totalSpent > 0 ? (netProfit / totalSpent).toFixed(2) : '0';

    const portalKey = await createPortalKey(tenant.orgId, client.slug);
    const portalUrl = portalKey ? `${new URL(request.url).origin}/portal/${client.slug}?key=${encodeURIComponent(portalKey)}` : '';

    const approvedTasks = tasks.filter(t => t.stage === 'published' || t.stage === 'ready_to_publish');
    const pendingTasks = tasks.filter(t => t.stage === 'review');

    // 3. Prompt Gemini for Executive Summary
    const gemini = getGeminiClient();
    let reportData: any = null;

    if (gemini) {
      const prompt = `
Sen "${tenant.org.name}" adlı performans pazarlama ekibinin Kıdemli Büyüme Direktörüsün.
Sadece aşağıda verilen gerçek rakamları ve görevleri kullan; verilmeyen bir işlemi yapılmış gibi yazma.
Aşağıdaki müşteri ve canlı kampanya verilerini inceleyerek ajans adına müşterinin patronuna/pazarlama yöneticisine sunulacak haftalık/aylık bir "Yönetici Özeti ve WhatsApp İletişim Raporu" hazırla.

MÜŞTERİ BİLGİLERİ:
- Marka: ${client.name}
- Sektör: ${client.sector}
- Açıklama: ${client.description || 'Hizmet ve e-ticaret odaklı satış'}
- Dönem: ${period}

GERÇEKLEŞEN RAKAMLAR:
- Toplam Reklam Yatırımı (Harcama): ₺${totalSpent.toLocaleString('tr-TR')}
- Üretilen Ciro / Satış Hacmi: ₺${totalRevenue.toLocaleString('tr-TR')}
- Net Kasa Getirisi (ROAS): ${roas}x
- Tahmini Net Kâr Katkısı (POAS): ₺${netProfit.toLocaleString('tr-TR')} (${poas}x)
- Aktif Kampanyalar: ${campaigns.map(c => `${c.name} (${c.platform.toUpperCase()} - ROAS: ${c.roas}x)`).join(', ') || 'Meta Advantage+ & Google Arama'}
- Yayına Alınan Kreatifler: ${approvedTasks.map(t => t.title).join('; ') || 'Viral Kanca Video Seti'}
- Onay Bekleyen Kurgular: ${pendingTasks.map(t => t.title).join('; ') || 'Yok'}

Lütfen yanıtını SADECE aşağıdaki JSON formatında ver (başka hiçbir metin veya markdown etiketi koyma):
{
  "executiveSummary": "Markanın bu dönemdeki büyüme, ROAS ve ciro gidişatını özetleyen 2-3 cümlelik vurucu yönetici paragrafı.",
  "performanceWins": [
    "Kazanım 1: Sektöre ve ROAS'a özel net bir başarı maddesi.",
    "Kazanım 2: Bütçe verimliliği veya ciro artış maddesi.",
    "Kazanım 3: En iyi çalışan kanca veya platform başarısı."
  ],
  "optimizationsDone": [
    "Optimizasyon 1: Ajans ekibimizin bu hafta yaptığı kitle/bütçe ayarı.",
    "Optimizasyon 2: Yayına alınan kreatif veya kanca iyileştirmesi.",
    "Optimizasyon 3: Zarar eden reklamların kapatılması veya kârlı kanala bütçe aktarımı."
  ],
  "nextWeekPlan": [
    "Aksiyon 1: Önümüzdeki hafta açılacak yeni kanca/kreatif testi.",
    "Aksiyon 2: Bütçe ölçekleme veya yeni hedef kitle.",
    "Aksiyon 3: Beklenen ciro ve ROAS hedefi."
  ],
  "whatsAppMessage": "Müşterinin WhatsApp hattına tek tıkla gönderilmeye hazır, emojili, profesyonel, samimi ve net haftalık ajans özet mesajı."
}
`;

      for (const model of GEMINI_MODELS) {
        try {
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 6000)
          );
          const aiPromise = gemini.models.generateContent({
            model,
            contents: prompt
          });
          const response: any = await Promise.race([aiPromise, timeoutPromise]);
          const rawText = response.text || '';
          const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          reportData = JSON.parse(cleanedText);
          if (reportData.executiveSummary) break;
        } catch (e) {
          console.warn(`Report generation fallback from ${model}:`, e);
        }
      }
    }

    // 4. Guaranteed high-quality fallback if AI is unreachable
    if (!reportData) {
      reportData = {
        executiveSummary: totalSpent > 0
          ? `${client.name} için bu dönemde ₺${totalSpent.toLocaleString('tr-TR')} reklam harcamasıyla ₺${totalRevenue.toLocaleString('tr-TR')} ciro kaydedildi (${roas}x ROAS).`
          : `${client.name} için bu dönemde kayıtlı reklam harcaması bulunmuyor. Reklam hesabı bağlanıp veri eşitlendiğinde rapor rakamlarla dolacaktır.`,
        performanceWins: [
          `Toplam ₺${totalSpent.toLocaleString('tr-TR')} reklam harcaması, ₺${totalRevenue.toLocaleString('tr-TR')} ciro (${roas}x ROAS).`,
          `Reklam harcaması düşüldükten sonra kalan ciro: ₺${netProfit.toLocaleString('tr-TR')} (${poas}x).`,
          `${approvedTasks.length} kreatif yayına alındı veya yayına hazır.`
        ],
        optimizationsDone: approvedTasks.length > 0
          ? approvedTasks.slice(0, 3).map(t => `Kreatif tamamlandı: ${t.title}`)
          : ['Bu dönemde tamamlanan kreatif görevi kaydı yok.'],
        nextWeekPlan: pendingTasks.length > 0
          ? pendingTasks.slice(0, 3).map(t => `Onay bekleyen kreatif: ${t.title}`)
          : ['Önümüzdeki dönemin planını ekip panosuna görev olarak ekleyin.'],
        whatsAppMessage: `🚀 *${client.name} - Haftalık Büyüme & ROAS Raporu*\n\nMerhaba Sn. Ortak,\nAjansımız tarafından bu hafta yürütülen performans çalışmalarının özeti:\n\n💰 *Harcama:* ₺${totalSpent.toLocaleString('tr-TR')}\n📈 *Üretilen Ciro:* ₺${totalRevenue.toLocaleString('tr-TR')}\n🎯 *Canlı ROAS:* ${roas}x\n💎 *Net Kasa Katkısı:* ₺${netProfit.toLocaleString('tr-TR')} (${poas}x POAS)\n\n✅ *Yayına alınan kreatif sayısı:* ${approvedTasks.length}\n\nDetaylı canlı portalınızı incelemek için: ${portalUrl}\n\nİyi çalışmalar dileriz,\n*${tenant.org.name}*`
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        client: {
          id: client.id,
          name: client.name,
          slug: client.slug,
          sector: client.sector,
          contactPhone: client.contactPhone,
          contactName: client.contactPerson || client.name
        },
        metrics: {
          totalSpent,
          totalRevenue,
          roas,
          netProfit,
          poas,
          campaignsCount: campaigns.length,
          tasksCount: tasks.length
        },
        report: reportData,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Report API error:', error);
    return NextResponse.json({ error: error.message || 'Rapor oluşturulamadı' }, { status: 500 });
  }
}
