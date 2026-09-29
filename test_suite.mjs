import http from 'http';

const BASE_URL = 'http://localhost:3000';

async function request(path, options = {}) {
  const start = Date.now();
  const url = `${BASE_URL}${path}`;
  try {
    const res = await fetch(url, options);
    const duration = Date.now() - start;
    let data;
    const text = await res.text();
    try {
      data = JSON.parse(text);
    } catch {
      data = text.slice(0, 80);
    }
    return {
      path,
      method: options.method || 'GET',
      status: res.status,
      ok: res.ok,
      durationMs: duration,
      data
    };
  } catch (err) {
    return {
      path,
      method: options.method || 'GET',
      status: 0,
      ok: false,
      durationMs: Date.now() - start,
      error: err.message
    };
  }
}

async function runAllTests() {
  console.log('=== İGEADS SİSTEM SAĞLIK VE İŞLEV TESTLERİ BAŞLIYOR ===\n');

  const tests = [
    // 1. Ana Sayfa (UI SSR/Static)
    { path: '/', method: 'GET' },
    
    // 2. Kampanyalar API
    { path: '/api/campaigns', method: 'GET' },
    { 
      path: '/api/campaigns', 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test Canlı Kampanya', platform: 'meta', dailyBudget: 1500 })
    },

    // 3. Pazaryeri & Ürünler API
    { path: '/api/products', method: 'GET' },

    // 4. Otonom Kurallar API
    { path: '/api/rules', method: 'GET' },
    { 
      path: '/api/rules', 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test Stok Koruma Kuralı', trigger: 'Stok < 10', action: 'Reklamı durdur' })
    },

    // 5. Canlı Satış Odası (Live War Room) API
    { path: '/api/war-room', method: 'GET' },

    // 6. Copilot Yapay Zeka API
    { 
      path: '/api/copilot', 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'Deri ceket için reklam stratejisi ve viral video kancası öner' })
    },

    // 7. Kreatif Stüdyo AI Üretici API
    { 
      path: '/api/creative-generator', 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName: 'Hakiki Deri Biker Ceket', platform: 'TikTok / Reels', tone: 'Cesur' })
    },

    // 8. WhatsApp Canlı Ticaret Masası API
    { path: '/api/whatsapp-inbox', method: 'GET' },
    { 
      path: '/api/whatsapp-inbox', 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId: 'chat-1', message: 'Test mesajı iletildi' })
    },

    // 9. Müşteri Özel Portalı
    { path: '/portal/velvetcouture', method: 'GET' },

    // 10. Canlı Entegrasyonlar API
    { path: '/api/integrations', method: 'GET' },
    { 
      path: '/api/integrations/test', 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider: 'google', credentials: { customerId: '412-894-1029' } })
    },
    { 
      path: '/api/integrations', 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        provider: 'meta', 
        name: 'Meta Ads Canlı', 
        category: 'ads', 
        credentials: { accessToken: 'test_token', adAccountId: 'act_1092841928' } 
      })
    },

    // 11. Ajans Portföyü & Çoklu Müşteri API
    { path: '/api/clients', method: 'GET' },

    // 12. Ajans Ekip & Rol Yönetimi API
    { path: '/api/team', method: 'GET' },

    // 13. Ajans İş Akışı & Kanban Görev Masası API
    { path: '/api/tasks', method: 'GET' },
    { path: '/api/tasks?clientSlug=mandalinclean', method: 'GET' },
    {
      path: '/api/tasks',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Mandalin Clean: Test Görevi',
        clientSlug: 'mandalinclean',
        clientName: 'Mandalin Clean',
        assignedTo: 'Emre Kara',
        stage: 'idea',
        priority: 'medium'
      })
    },

    // 14. Dinamik Müşteri Portalları (Mandalin Clean & İgesatürkiye)
    { path: '/portal/mandalinclean', method: 'GET' },
    { path: '/portal/igesaturkiye', method: 'GET' },

    // 15. Gemini AI Yönetici Raporu & WhatsApp Özeti API
    {
      path: '/api/reports/generate',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientSlug: 'mandalinclean',
        period: 'Haftalık Büyüme & ROAS Raporu'
      })
    },

    // 16. Ajans Finans & Retainer Sözleşmeleri API
    { path: '/api/billing', method: 'GET' },
    { path: '/api/billing?clientSlug=mandalinclean', method: 'GET' },
    {
      path: '/api/billing',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clientName: 'Mandalin Clean',
        clientSlug: 'mandalinclean',
        planTitle: 'Test Büyüme Paketi',
        monthlyRetainer: 40000,
        commissionRate: 10,
        currentMonthAdSpend: 50000,
        dueDate: '2026-10-15'
      })
    }
  ];

  const results = [];
  for (const t of tests) {
    const opts = {};
    if (t.method) opts.method = t.method;
    if (t.headers) opts.headers = t.headers;
    if (t.body) opts.body = t.body;

    const res = await request(t.path, opts);
    results.push(res);

    const statusBadge = res.ok ? '✅ BAŞARILI' : '❌ HATA';
    console.log(`[${statusBadge}] ${res.method} ${res.path} -> ${res.status} (${res.durationMs}ms)`);
  }

  console.log('\n=== TEST ÖZETİ ===');
  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  console.log(`Toplam Test: ${results.length}`);
  console.log(`Başarılı: ${passed}`);
  console.log(`Başarısız: ${failed}`);
  console.log(`Başarı Oranı: %${Math.round((passed / results.length) * 100)}`);
}

runAllTests();
