import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const clientSlug = searchParams.get('clientSlug') || 'all';

  const mandalinChats = [
    {
      id: 'chat-mc-1',
      customerName: 'Zeynep Kaya (Kadıköy/Moda)',
      phone: '+90 532 *** ** 19',
      status: 'product_inquiry',
      lastMessage: 'Merhaba yarın öğleden sonra için 3 kişilik L koltuk ve berjer yıkama randevusu alabilir miyim?',
      unreadCount: 1,
      cartProduct: {
        name: 'Buharlı Koltuk & Berjer Yıkama Paketi',
        price: '₺1.450',
        size: 'Kadıköy Şubesi',
        stock: 4
      },
      messages: [
        { sender: 'agent', text: 'Mandalin Clean Hijyen Hattına hoş geldiniz! Size nasıl yardımcı olabiliriz?', time: '13:40' },
        { sender: 'customer', text: 'Merhaba yarın öğleden sonra için 3 kişilik L koltuk ve berjer yıkama randevusu alabilir miyim?', time: '13:45' }
      ]
    },
    {
      id: 'chat-mc-2',
      customerName: 'Burak Demir (Ataşehir)',
      phone: '+90 544 *** ** 73',
      status: 'vip',
      lastMessage: 'Randevu onaylandı, ekip yarın saat 11:00\'de adreste olacak.',
      unreadCount: 0,
      cartProduct: {
        name: 'Antibakteriyel Yatak & Halı Dezenfeksiyonu',
        price: '₺2.200',
        size: 'Ataşehir Şubesi',
        stock: 2
      },
      messages: [
        { sender: 'customer', text: 'Evde kedi var, kullandığınız solüsyonlar evcil hayvan dostu mu?', time: '11:15' },
        { sender: 'ai', text: 'Burak Bey, tüm solüsyonlarımız %100 organik, vegan ve evcil hayvan dostudur. Kimyasal kalıntı bırakmaz. Randevunuzu oluşturmamı ister misiniz?', time: '11:16' },
        { sender: 'customer', text: 'Süper, yarın saat 11:00 için onaylıyorum.', time: '11:20' }
      ]
    },
    {
      id: 'chat-mc-3',
      customerName: 'Ebru Yıldız (Suadiye)',
      phone: '+90 535 *** ** 90',
      status: 'abandoned_cart',
      lastMessage: 'İndirim kodunu nasıl kullanabilirim acaba?',
      unreadCount: 1,
      cartProduct: {
        name: 'Bahar Temizliği Villa/Daire Özel Paketi',
        price: '₺3.800',
        size: 'Suadiye Bölgesi',
        stock: 1
      },
      messages: [
        { sender: 'customer', text: 'Web sitenizden randevu oluştururken %20 bahar indirimi kodunu göremedim.', time: '10:02' }
      ]
    }
  ];

  const igeChats = [
    {
      id: 'chat-ige-1',
      customerName: 'Kemal Arslan (E-Ticaret Kurucusu)',
      phone: '+90 530 *** ** 55',
      status: 'vip',
      lastMessage: 'Haftalık 200k reklam bütçemiz var. Amazon US ve Meta tarafında ölçekleme toplantısı ayarlayabilir miyiz?',
      unreadCount: 1,
      cartProduct: {
        name: 'B2B Büyüme & E-İhracat Danışmanlığı',
        price: '₺45.000 /ay',
        size: 'Full-Funnel Ads',
        stock: 3
      },
      messages: [
        { sender: 'customer', text: 'Haftalık 200k reklam bütçemiz var. Amazon US ve Meta tarafında ölçekleme toplantısı ayarlayabilir miyiz?', time: '14:10' }
      ]
    },
    {
      id: 'chat-ige-2',
      customerName: 'Derya Çetin (Tekstil İhracatçısı)',
      phone: '+90 541 *** ** 28',
      status: 'product_inquiry',
      lastMessage: 'Case study sunumunuzu inceledim, ROAS garantisi veya sözleşme şartlarınız nasıl işliyor?',
      unreadCount: 0,
      cartProduct: {
        name: 'Meta CAPI & ROAS Optimizasyon Denetimi',
        price: '₺15.000',
        size: 'Tek Seferlik Denetim',
        stock: 5
      },
      messages: [
        { sender: 'customer', text: 'Case study sunumunuzu inceledim, ROAS garantisi veya sözleşme şartlarınız nasıl işliyor?', time: '12:00' },
        { sender: 'agent', text: 'Derya Hanım merhabalar! Performans odaklı çalışıyoruz; ilk 30 günde POAS hedefini tutturamazsak sonraki ay yönetim bedeli almıyoruz.', time: '12:05' }
      ]
    }
  ];

  const velvetChats = [
    {
      id: 'chat-vc-1',
      customerName: 'Melis Doğan',
      phone: '+90 533 *** ** 44',
      status: 'abandoned_cart',
      lastMessage: 'Merhaba ceket kalıbı dar mı acaba? Normalde M giyiyorum ama kararsız kaldım.',
      unreadCount: 1,
      cartProduct: {
        name: 'Hakiki Deri Biker Ceket',
        price: '₺2.199',
        size: 'Beden: M',
        stock: 3
      },
      messages: [
        { sender: 'agent', text: 'Merhaba Melis Hanım! Velvet Couture sepetinizdeki Hakiki Deri Ceket için size nasıl yardımcı olabiliriz?', time: '14:20' },
        { sender: 'customer', text: 'Merhaba ceket kalıbı dar mı acaba? Normalde M giyiyorum ama kararsız kaldım.', time: '14:22' }
      ]
    },
    {
      id: 'chat-vc-2',
      customerName: 'Canberk Yılmaz',
      phone: '+90 542 *** ** 88',
      status: 'vip',
      lastMessage: 'Ödeme linki için teşekkürler, siparişi tamamladım!',
      unreadCount: 0,
      cartProduct: {
        name: 'Minimalist Deri Sırt Çantası',
        price: '₺1.190',
        size: 'Standart',
        stock: 8
      },
      messages: [
        { sender: 'customer', text: 'Tekrar merhaba, çanta için özel bir indirim tanımlayabilir misiniz?', time: '14:05' },
        { sender: 'ai', text: 'Canberk Bey, VIP üyemiz olduğunuz için size özel %10 indirimli hızlı ödeme linki oluşturdum: ₺1.071', time: '14:06', hasPaymentLink: true, paymentAmount: '₺1.071' },
        { sender: 'customer', text: 'Ödeme linki için teşekkürler, siparişi tamamladım!', time: '14:10' }
      ]
    }
  ];

  let conversations = [...mandalinChats, ...igeChats, ...velvetChats];
  let recoveredRevenue = 142800;

  if (clientSlug.includes('mandalin')) {
    conversations = mandalinChats;
    recoveredRevenue = 38400;
  } else if (clientSlug.includes('ige') || clientSlug.includes('ajans')) {
    conversations = igeChats;
    recoveredRevenue = 85000;
  } else if (clientSlug.includes('velvet')) {
    conversations = velvetChats;
    recoveredRevenue = 48720;
  }

  return NextResponse.json({
    success: true,
    data: {
      totalActiveChats: conversations.length,
      recoveredRevenueWeekly: recoveredRevenue,
      conversations
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({
      success: true,
      message: 'WhatsApp mesajı ve ödeme linki başarıyla iletildi.',
      sentPayload: body
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
