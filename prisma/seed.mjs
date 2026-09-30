import { PrismaClient } from '@prisma/client';
import fs from 'fs';

// Load .env.local if DATABASE_URL is not set
if (!process.env.DATABASE_URL && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  envContent.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) {
      process.env[k.trim()] = v.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
  });
}

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing
  await prisma.campaign.deleteMany();
  await prisma.product.deleteMany();
  await prisma.client.deleteMany();
  await prisma.automationRule.deleteMany();
  await prisma.notification.deleteMany();

  // 0. Agency Clients
  await prisma.client.createMany({
    data: [
      {
        id: 'client-mandalin',
        name: 'Mandalin Clean',
        slug: 'mandalinclean',
        sector: 'Temizlik & Koltuk Yıkama',
        description: 'Yerinde koltuk, yatak ve ev tekstili yıkama, antibakteriyel buharlı hijyen hizmeti.',
        targetAudience: 'Ev hanımları, çalışan çiftler, çocuklu aileler, Airbnb ev sahipleri',
        monthlyBudget: 28000,
        currency: 'TRY',
        status: 'active',
        contactPerson: 'Murat Bey (Operasyon Müdürü)',
        contactPhone: '+90 532 555 44 33',
        metaAccountId: 'act_982341052',
        googleAdsId: '382-910-4492'
      },
      {
        id: 'client-ige',
        name: 'İgeAds / igesaturkiye',
        slug: 'igesaturkiye',
        sector: 'Dijital Pazarlama & B2B',
        description: 'Performans pazarlama, e-ihracat ve otonom reklam optimizasyon danışmanlığı.',
        targetAudience: 'E-ticaret marka kurucuları, dijital pazarlama direktörleri',
        monthlyBudget: 45000,
        currency: 'TRY',
        status: 'active',
        contactPerson: 'İlker Bey (Kurucu)',
        contactPhone: '+90 555 123 45 67',
        metaAccountId: 'act_773412091',
        googleAdsId: '109-442-8871'
      },
      {
        id: 'client-velvet',
        name: 'Velvet Couture',
        slug: 'velvetcouture',
        sector: 'E-Ticaret & Moda',
        description: 'Hakiki kuzu derisi ceketler, kabanlar ve kışlık premium aksesuarlar.',
        targetAudience: '25-45 yaş, yüksek alım gücüne sahip moda takipçileri',
        monthlyBudget: 35000,
        currency: 'TRY',
        status: 'active',
        contactPerson: 'Selin Hanım (E-Ticaret Yöneticisi)',
        contactPhone: '+90 533 987 65 43',
        metaAccountId: 'act_441209871',
        googleAdsId: '551-889-1029'
      }
    ]
  });

  // 1. Multi-Client Dynamic Campaigns
  await prisma.campaign.createMany({
    data: [
      // Mandalin Clean (Temizlik & Hijyen)
      {
        id: 'camp-mandalin-1',
        clientId: 'client-mandalin',
        name: 'Meta - Mandalin Clean | Yerinde Koltuk & Ev Hijyeni Lead Kampanyası',
        platform: 'meta',
        status: 'active',
        dailyBudget: 1500,
        spent: 18500,
        revenue: 114700,
        roas: 6.2,
        poas: 3.40,
        cpc: 2.10,
        ctr: 4.25,
        fatigueScore: 18,
        targetMarketplaceStock: 100
      },
      {
        id: 'camp-mandalin-2',
        clientId: 'client-mandalin',
        name: 'Google Ads - Mandalin Clean | Bölgesel Koltuk & Yatak Yıkama Arama Ağı',
        platform: 'google',
        status: 'active',
        dailyBudget: 2200,
        spent: 24600,
        revenue: 132840,
        roas: 5.4,
        poas: 2.85,
        cpc: 3.80,
        ctr: 5.10,
        fatigueScore: 22,
        targetMarketplaceStock: 100
      },
      {
        id: 'camp-mandalin-3',
        clientId: 'client-mandalin',
        name: 'WhatsApp Cloud - Mandalin Clean | Hızlı Fiyat & Randevu Botu',
        platform: 'whatsapp',
        status: 'active',
        dailyBudget: 500,
        spent: 6200,
        revenue: 48360,
        roas: 7.8,
        poas: 4.10,
        cpc: 1.40,
        ctr: 8.50,
        fatigueScore: 12,
        targetMarketplaceStock: 100
      },
      // İgeAds / igesaturkiye (B2B Dijital Pazarlama)
      {
        id: 'camp-ige-1',
        clientId: 'client-ige',
        name: 'Meta - igesaturkiye | E-Ticaret ROAS Katlama & Büyüme Kampanyası',
        platform: 'meta',
        status: 'active',
        dailyBudget: 2500,
        spent: 31250,
        revenue: 250000,
        roas: 8.0,
        poas: 4.60,
        cpc: 4.50,
        ctr: 3.80,
        fatigueScore: 15,
        targetMarketplaceStock: 50
      },
      {
        id: 'camp-ige-2',
        clientId: 'client-ige',
        name: 'Google Ads - igesaturkiye | Performans Pazarlama & ROAS Danışmanlığı',
        platform: 'google',
        status: 'active',
        dailyBudget: 2000,
        spent: 26000,
        revenue: 182000,
        roas: 7.0,
        poas: 3.90,
        cpc: 6.20,
        ctr: 4.10,
        fatigueScore: 25,
        targetMarketplaceStock: 50
      },
      // Velvet Couture (E-Ticaret / Giyim)
      {
        id: 'camp-velvet-1',
        clientId: 'client-velvet',
        name: 'Meta - Velvet Couture | Kış Koleksiyonu Dinamik Katalog',
        platform: 'meta',
        status: 'active',
        dailyBudget: 1800,
        spent: 22000,
        revenue: 96800,
        roas: 4.4,
        poas: 2.10,
        cpc: 3.20,
        ctr: 2.60,
        fatigueScore: 35,
        targetMarketplaceStock: 80
      }
    ]
  });

  // 2. Services & Marketplace Products
  await prisma.product.createMany({
    data: [
      // Hepsiburada Products (Velvet Couture & Mandalin Clean)
      {
        id: 'prod-hb-1',
        clientId: 'client-velvet',
        name: 'Hakiki Deri Unisex Biker Ceket (Vintage Siyah)',
        sku: 'HB-JKT-LTH-01',
        marketplace: 'Hepsiburada',
        stock: 38,
        price: 2450,
        buyboxPrice: 2450,
        isBuybox: true,
        returnRate: 2.1
      },
      {
        id: 'prod-hb-2',
        clientId: 'client-velvet',
        name: 'Oversize Kaşmir Yün Palto (Camel)',
        sku: 'HB-PLT-KSM-02',
        marketplace: 'Hepsiburada',
        stock: 14,
        price: 3890,
        buyboxPrice: 3890,
        isBuybox: true,
        returnRate: 1.8
      },
      {
        id: 'prod-hb-3',
        clientId: 'client-velvet',
        name: 'El Yapımı İtalyan Deri Chelsea Bot (Acı Kahve)',
        sku: 'HB-BOT-CHL-03',
        marketplace: 'Hepsiburada',
        stock: 6, // Kritik stok - Auto Halt Ads testi
        price: 2890,
        buyboxPrice: 2950,
        isBuybox: false,
        returnRate: 3.2
      },
      // Trendyol Products
      {
        id: 'prod-ty-1',
        clientId: 'client-velvet',
        name: 'Slim Fit İtalyan Kesim Blazer Ceket',
        sku: 'TY-BLZ-SLM-01',
        marketplace: 'Trendyol',
        stock: 52,
        price: 1850,
        buyboxPrice: 1850,
        isBuybox: true,
        returnRate: 4.5
      },
      {
        id: 'prod-ty-2',
        clientId: 'client-velvet',
        name: 'Premium Örgü Triko Balıkçı Kazak',
        sku: 'TY-KZK-TRK-02',
        marketplace: 'Trendyol',
        stock: 8, // Kritik stok
        price: 980,
        buyboxPrice: 990,
        isBuybox: true,
        returnRate: 2.0
      },
      // Amazon TR Products
      {
        id: 'prod-amz-1',
        clientId: 'client-velvet',
        name: 'Su Geçirmez Termal Outdoor Mont (Haki)',
        sku: 'AMZ-MNT-THM-01',
        marketplace: 'Amazon',
        stock: 24,
        price: 3200,
        buyboxPrice: 3150,
        isBuybox: false,
        returnRate: 1.5
      },
      // İdefix Products
      {
        id: 'prod-idx-1',
        clientId: 'client-velvet',
        name: 'Deri Kartlık ve Cüzdan Seti (Özel Ahşap Kutulu)',
        sku: 'IDX-CZDN-SET-01',
        marketplace: 'İdefix',
        stock: 65,
        price: 750,
        buyboxPrice: 750,
        isBuybox: true,
        returnRate: 0.8
      },
      // N11 Products
      {
        id: 'prod-n11-1',
        clientId: 'client-velvet',
        name: 'Süet Deri Bel Kemeri (Antik Pirinç Tokalı)',
        sku: 'N11-KMR-SUET-01',
        marketplace: 'N11',
        stock: 42,
        price: 490,
        buyboxPrice: 490,
        isBuybox: true,
        returnRate: 1.1
      },
      // Mandalin Clean Hijyen Hizmeti
      {
        id: 'prod-mandalin-1',
        clientId: 'client-mandalin',
        name: 'Mandalin Clean VIP Yerinde Koltuk Yıkama & Buharlı Dezenfeksiyon',
        sku: 'MNDLN-KLTK-01',
        marketplace: 'Hepsiburada',
        stock: 50,
        price: 1250,
        buyboxPrice: 1250,
        isBuybox: true,
        returnRate: 0.5
      },
      {
        id: 'prod-mandalin-2',
        clientId: 'client-mandalin',
        name: 'Mandalin Clean Yatak & Baza Derin Alerjen Arındırma Hizmeti',
        sku: 'MNDLN-YTK-02',
        marketplace: 'Trendyol',
        stock: 40,
        price: 1400,
        buyboxPrice: 1400,
        isBuybox: true,
        returnRate: 0.2
      }
    ]
  });

  // 3. Automation Rules
  await prisma.automationRule.createMany({
    data: [
      {
        id: 'rule-1',
        title: 'Kritik Stokta Reklam Durdurma Koruması',
        category: 'stock',
        trigger: 'Pazaryeri stoku < 10 adet olduğunda',
        action: 'Bağlı Meta & Google reklam setlerini derhal duraklat (Pause)',
        enabled: true,
        impactScore: 98,
        lastTriggered: '14 dakika önce'
      },
      {
        id: 'rule-2',
        title: 'Agresif Buybox Geri Alma Repricer',
        category: 'repricer',
        trigger: 'Buybox kaybedildiğinde ve rakip fiyatı > Taban Fiyat',
        action: 'Rakip fiyatının ₺1 altına anında dinamik güncelleme yap',
        enabled: true,
        impactScore: 92,
        lastTriggered: '1 saat önce'
      },
      {
        id: 'rule-3',
        title: 'Kreatif Yorgunluk Otomatik Bütçe Koruyucu',
        category: 'creative',
        trigger: 'Kreatif Yorgunluk Skoru > 80 ve ROAS < 3.0x',
        action: 'Günlük bütçeyi %50 kıs ve yeni AI kanca varyasyonu talep et',
        enabled: true,
        impactScore: 89,
        lastTriggered: '3 saat önce'
      },
      {
        id: 'rule-4',
        title: 'Gece Kuşu Yüksek POAS Bütçe Artırıcı',
        category: 'budget',
        trigger: 'Saat 21:00 - 01:00 arası ve POAS > 2.5x',
        action: 'Meta bütçesini 4 saatliğine %35 ölçekle (Scale Up)',
        enabled: false,
        impactScore: 84,
        lastTriggered: 'Dün gece'
      }
    ]
  });

  // 4. Notifications
  await prisma.notification.createMany({
    data: [
      {
        id: 'notif-1',
        title: 'Otonom Müdahale: Reklam Durduruldu',
        message: 'Oversize Kaşmir Kazak Trendyol stoku 6 adede indiği için TikTok Spark Ads duraklatıldı.',
        type: 'warning',
        time: '12 dk önce',
        read: false
      },
      {
        id: 'notif-2',
        title: 'Buybox Geri Kazanıldı! 🏆',
        message: 'Deri Ceket için Amazon fiyatı ₺2.198 olarak güncellendi ve Buybox %100 bizde.',
        type: 'success',
        time: '45 dk önce',
        read: false
      },
      {
        id: 'notif-3',
        title: 'Yüksek İade Alarmı: Beden Kalıbı',
        message: 'Kaşmir Kazak iade oranı %18.5 seviyesine çıktı. Ürün açıklamasına beden rehberi eklenmeli.',
        type: 'alert',
        time: '2 saat önce',
        read: true
      }
    ]
  });

  // 5. Team Members (Ajans Ekip Üyeleri)
  await prisma.teamMember.deleteMany();
  await prisma.teamMember.createMany({
    data: [
      {
        id: 'team-1',
        name: 'Ahmet Yılmaz',
        email: 'ahmet@igeads.com',
        role: 'admin',
        roleTitle: 'Ajans Kurucusu & Strateji Direktörü',
        phone: '+90 532 100 20 30',
        assignedClients: '*',
        status: 'active',
        avatarColor: 'indigo'
      },
      {
        id: 'team-2',
        name: 'Cansu Demir',
        email: 'cansu@igeads.com',
        role: 'media_buyer',
        roleTitle: 'Kıdemli Medya Satın Alıcı (Performance)',
        phone: '+90 533 222 33 44',
        assignedClients: 'mandalinclean,igesaturkiye',
        status: 'active',
        avatarColor: 'cyan'
      },
      {
        id: 'team-3',
        name: 'Emre Kara',
        email: 'emre@igeads.com',
        role: 'creative',
        roleTitle: 'Kreatif Direktör & AI Metin Yazarı',
        phone: '+90 535 444 55 66',
        assignedClients: '*',
        status: 'active',
        avatarColor: 'purple'
      },
      {
        id: 'team-4',
        name: 'Selin Aydın',
        email: 'selin@igeads.com',
        role: 'account_manager',
        roleTitle: 'Müşteri İlişkileri & Raporlama Müdürü',
        phone: '+90 536 777 88 99',
        assignedClients: 'mandalinclean,velvetcouture',
        status: 'active',
        avatarColor: 'emerald'
      }
    ]
  });

  // 6. Agency Workflow Tasks (Kanban Onay Masası)
  await prisma.agencyTask.deleteMany();
  await prisma.agencyTask.createMany({
    data: [
      {
        id: 'task-1',
        title: 'Mandalin Clean: Koltuk Yıkama 3 Yeni Viral Reels Kancası',
        description: 'Önce/sonra su çekme anı ve çocuklu aileler için alerjen güvenliği odaklı kancalar.',
        clientSlug: 'mandalinclean',
        clientName: 'Mandalin Clean',
        assignedTo: 'Emre Kara',
        stage: 'review',
        priority: 'high',
        dueDate: 'Bugün 17:00',
        creativeHook: 'Bize bu koltuğu çöpe atın dediler...',
        channel: 'reels'
      },
      {
        id: 'task-2',
        title: 'igesaturkiye: Meta Advantage+ Bütçesini ₺2.500\'e Ölçekleme',
        description: 'ROAS 8.0x üzerinde seyreden en verimli kitleye bütçe aktarımı yapılması.',
        clientSlug: 'igesaturkiye',
        clientName: 'İgeAds / igesaturkiye',
        assignedTo: 'Cansu Demir',
        stage: 'ready_to_publish',
        priority: 'urgent',
        dueDate: 'Yarın 12:00',
        creativeHook: 'Reklam bütçenizi tüketip sıfır dönüşüm almaktan sıkılmadınız mı?',
        channel: 'meta'
      },
      {
        id: 'task-3',
        title: 'Duru Diş Kliniği: Zirkonyum Gülüş Tasarımı Kreatif Seti',
        description: 'Ağrısız dijital diş hekimliği ve 1 saatte gülüş yenileme temalı 9:16 storyler.',
        clientSlug: 'durudisklinigi',
        clientName: 'Duru Diş Kliniği',
        assignedTo: 'Emre Kara',
        stage: 'in_progress',
        priority: 'medium',
        dueDate: '2 gün sonra',
        creativeHook: 'Dişçiden korkanlar buraya: 1 saatte yeni bir gülüş...',
        channel: 'meta'
      },
      {
        id: 'task-4',
        title: 'Mandalin Clean: Haftalık ROAS & POAS Müşteri Raporu İletimi',
        description: 'Müşteriye özel /portal/mandalinclean linkinin WhatsApp üzerinden paylaşılması.',
        clientSlug: 'mandalinclean',
        clientName: 'Mandalin Clean',
        assignedTo: 'Selin Aydın',
        stage: 'published',
        priority: 'low',
        dueDate: 'Tamamlandı',
        creativeHook: 'Canlı Büyüme Raporu Hazır',
        channel: 'whatsapp'
      }
    ]
  });

  console.log('Seed completed successfully with Teams and Tasks!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
