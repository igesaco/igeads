import http from 'http';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@igeads.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'igeads-dev';

let sessionCookie = '';

async function login() {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });
  const setCookie = res.headers.get('set-cookie') || '';
  sessionCookie = setCookie.split(';')[0];
  return res.ok && Boolean(sessionCookie);
}

async function request(path, options = {}, { anonymous = false, cookie } = {}) {
  const start = Date.now();
  const url = `${BASE_URL}${path}`;
  const headers = { ...(options.headers || {}) };
  const activeCookie = cookie ?? sessionCookie;
  if (!anonymous && activeCookie) headers.Cookie = activeCookie;
  try {
    const res = await fetch(url, { ...options, headers });
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
      setCookie: (res.headers.get('set-cookie') || '').split(';')[0],
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

/** Hesap ayrımı: ikinci bir müşteri hesabı ilk hesabın verisini göremez ve değiştiremez */
async function tenantTests(results) {
  const json = { 'Content-Type': 'application/json' };
  const stamp = Date.now();
  const check = (name, res, ok) => {
    res.ok = Boolean(ok);
    res.path = `${res.path} (${name})`;
    results.push(res);
    console.log(`[${res.ok ? '✅ BAŞARILI' : '❌ HATA'}] ${res.method} ${res.path} -> ${res.status} (${res.durationMs}ms)`);
  };

  const weak = await request('/api/auth/register', { method: 'POST', headers: json, body: JSON.stringify({ name: 'B', email: `b${stamp}@test.com`, password: '123', organizationName: 'B Ajans', acceptTerms: true }) }, { anonymous: true });
  check('Kısa şifre reddedilir', weak, weak.status === 400);

  const reg = await request('/api/auth/register', { method: 'POST', headers: json, body: JSON.stringify({ name: 'Test B', email: `b${stamp}@test.com`, password: 'testsifre123', organizationName: 'B Ajans', accountType: 'agency', acceptTerms: true }) }, { anonymous: true });
  check('Yeni hesap kaydı (deneme)', reg, reg.status === 201 && reg.data?.data?.organization?.planStatus === 'trialing');
  const cookieB = reg.setCookie;

  const dup = await request('/api/auth/register', { method: 'POST', headers: json, body: JSON.stringify({ name: 'Test B', email: `b${stamp}@test.com`, password: 'testsifre123', organizationName: 'X', acceptTerms: true }) }, { anonymous: true });
  check('Aynı e-posta ikinci kez kaydolamaz', dup, dup.status === 409);

  const clientsB = await request('/api/clients', {}, { cookie: cookieB });
  check('Yeni hesap başka hesabın markalarını görmez', clientsB, clientsB.ok && Array.isArray(clientsB.data?.data) && clientsB.data.data.length === 0);

  const readA = await request('/api/clients/mandalinclean', {}, { cookie: cookieB });
  check('Başka hesabın markası okunamaz', readA, readA.status === 404);

  const delA = await request('/api/clients/client-mandalin', { method: 'DELETE' }, { cookie: cookieB });
  check('Başka hesabın markası silinemez', delA, delA.status === 404);

  const stillA = await request('/api/clients/mandalinclean');
  check('İlk hesabın markası yerinde', stillA, stillA.status === 200);

  const prodB = await request('/api/products', {}, { cookie: cookieB });
  check('Başka hesabın ürünleri görünmez', prodB, prodB.ok && prodB.data?.data?.length === 0);

  const intB = await request('/api/integrations', {}, { cookie: cookieB });
  check('Başka hesabın API anahtarı görünmez', intB, intB.ok && !JSON.stringify(intB.data).includes('hasStoredValue":true'));

  const taskB = await request('/api/tasks', { method: 'POST', headers: json, body: JSON.stringify({ title: 'x', clientSlug: 'mandalinclean' }) }, { cookie: cookieB });
  check('Başka hesabın markasına görev eklenemez', taskB, taskB.status === 404);

  let lastStatus = 0;
  for (let i = 1; i <= 6; i++) {
    const r = await request('/api/clients', { method: 'POST', headers: json, body: JSON.stringify({ name: `B Marka ${i}` }) }, { cookie: cookieB });
    lastStatus = r.status;
    if (i === 5) check('Deneme hesabı 5 marka ekleyebilir', r, r.status === 201);
    if (i === 6) check('6. marka paket sınırına takılır', r, r.status === 402);
  }

  const member = await request('/api/team', { method: 'POST', headers: json, body: JSON.stringify({ name: 'Ekip Üyesi', email: `m${stamp}@test.com`, role: 'creative', password: 'uyesifre123' }) }, { cookie: cookieB });
  check('Şifreli ekip üyesi eklenir', member, member.status === 201 && member.data?.data?.hasLogin === true);

  const memberLogin = await request('/api/auth/login', { method: 'POST', headers: json, body: JSON.stringify({ email: `m${stamp}@test.com`, password: 'uyesifre123' }) }, { anonymous: true });
  check('Ekip üyesi kendi şifresiyle girer', memberLogin, memberLogin.ok && memberLogin.data?.data?.role === 'member');

  const memberClients = await request('/api/clients', {}, { cookie: memberLogin.setCookie });
  check('Ekip üyesi kendi ajansının markalarını görür', memberClients, memberClients.ok && memberClients.data?.data?.length === 5);

  const memberTeam = await request('/api/team', { method: 'POST', headers: json, body: JSON.stringify({ name: 'x', email: `x${stamp}@test.com` }) }, { cookie: memberLogin.setCookie });
  check('Ekip üyesi ekip yönetemez', memberTeam, memberTeam.status === 403);

  const link = await request('/api/clients/mandalinclean/portal-link');
  const key = link.data?.data?.key || '';
  const portalOk = await request('/api/clients/mandalinclean', { headers: { 'x-portal-client': 'mandalinclean', 'x-portal-key': key } }, { anonymous: true });
  check('Portal anahtarı kendi markasını açar', portalOk, portalOk.status === 200 && portalOk.data?.data?.slug === 'mandalinclean');

  const orgB = reg.data?.data?.orgId || '';
  const forged = `${orgB}.${key.split('.')[1] || ''}`;
  const portalForged = await request('/api/clients/mandalinclean', { headers: { 'x-portal-client': 'mandalinclean', 'x-portal-key': forged } }, { anonymous: true });
  check('Portal anahtarı başka hesaba taşınamaz', portalForged, portalForged.status === 401);

  const sub = await request('/api/subscription', {}, { cookie: cookieB });
  check('Abonelik bilgisi', sub, sub.ok && sub.data?.data?.organization?.planStatus === 'trialing' && sub.data.data.plans.length === 3);

  const badPlan = await request('/api/subscription/checkout', { method: 'POST', headers: json, body: JSON.stringify({ plan: 'bedava' }) }, { cookie: cookieB });
  check('Geçersiz paket reddedilir', badPlan, badPlan.status === 400);

  const memberPay = await request('/api/subscription/checkout', { method: 'POST', headers: json, body: JSON.stringify({ plan: 'growth' }) }, { cookie: memberLogin.setCookie });
  check('Ekip üyesi ödeme başlatamaz', memberPay, memberPay.status === 403);

  const fakeCallback = await request('/api/subscription/callback', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: 'token=sahte', redirect: 'manual' }, { anonymous: true });
  check('Sahte ödeme bildirimi paketi açmaz', fakeCallback, fakeCallback.status === 303);

  const legal = await request('/yasal/mesafeli-satis', {}, { anonymous: true });
  check('Yasal sayfa açılıyor', legal, legal.ok);

  const notif = await request('/api/notifications', {}, { cookie: cookieB });
  check('Bildirimler hesaba özel', notif, notif.ok && notif.data?.data?.length === 0);
}

async function runAllTests() {
  console.log('=== İGEADS SİSTEM SAĞLIK VE İŞLEV TESTLERİ BAŞLIYOR ===\n');

  if (!(await login())) {
    console.log('❌ Yönetici girişi başarısız. ADMIN_EMAIL / ADMIN_PASSWORD değerlerini kontrol edin.');
    process.exit(1);
  }
  console.log('[✅ BAŞARILI] Yönetici girişi\n');

  const json = { 'Content-Type': 'application/json' };

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

    // 5b. Canlı Sosyal Medya Platform Nabzı API
    { path: '/api/social-pulse', method: 'GET' },
    { path: '/api/social-pulse?mode=store', method: 'GET' },

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
    },

    // 18. Güvenlik: oturumsuz istekler reddedilmeli
    { name: 'Oturumsuz müşteri listesi 401', path: '/api/clients', method: 'GET', anonymous: true, expect: r => r.status === 401 },
    { name: 'Oturumsuz müşteri silme 401', path: '/api/clients/client-mandalin', method: 'DELETE', anonymous: true, expect: r => r.status === 401 },
    { name: 'Anahtarsız portal verisi 401', path: '/api/clients/mandalinclean', method: 'GET', anonymous: true, expect: r => r.status === 401 },
    { name: 'Yanlış şifre 401', path: '/api/auth/login', method: 'POST', anonymous: true, headers: json, body: JSON.stringify({ email: ADMIN_EMAIL, password: 'yanlis' }), expect: r => r.status === 401 },

    // 19. Entegrasyonlar: gizli anahtarlar tarayıcıya dönmemeli, sahte başarı olmamalı
    {
      name: 'Meta anahtarı kaydet',
      path: '/api/integrations', method: 'POST', headers: json,
      body: JSON.stringify({ provider: 'meta', name: 'Meta Ads (Facebook & Instagram)', category: 'ads', credentials: { 'Sistem Kullanıcısı Access Token (ads_read)': 'EAAG_TEST_SECRET_9876', 'Ad Account ID': 'act_1092841928' } })
    },
    { name: 'Gizli anahtar maskeli', path: '/api/integrations', method: 'GET', expect: r => r.ok && !JSON.stringify(r.data).includes('EAAG_TEST_SECRET_9876') },
    {
      name: 'Google arayüz alanlarıyla test',
      path: '/api/integrations/test', method: 'POST', headers: json,
      body: JSON.stringify({ provider: 'google', credentials: { 'Customer ID': '412-894-1029' } }),
      expect: r => r.data?.success === true
    },
    {
      name: 'Trendyol arayüz alanları okunuyor',
      path: '/api/integrations/test', method: 'POST', headers: json,
      body: JSON.stringify({ provider: 'trendyol', credentials: { 'Satıcı ID (Supplier ID)': '1', 'API Key': 'a', 'API Secret': 'b' } }),
      expect: r => !String(r.data?.error || '').includes('zorunludur')
    },
    {
      name: 'Desteklenmeyen sağlayıcı sahte başarı vermiyor',
      path: '/api/integrations/test', method: 'POST', headers: json,
      body: JSON.stringify({ provider: 'tiktok', credentials: {} }),
      expect: r => r.data?.success === false
    },

    // 17. Yapay Zeka Fotoğraf & Görsel Üretim API
    {
      path: '/api/generate-image',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Mandalin Clean Koltuk Yıkama Hizmeti',
        style: 'studio',
        aspectRatio: '1:1'
      })
    }
  ];

  const results = [];
  let testCampId = null;
  let testRuleId = null;

  for (const t of tests) {
    const opts = {};
    if (t.method) opts.method = t.method;
    if (t.headers) opts.headers = t.headers;
    if (t.body) opts.body = t.body;

    const res = await request(t.path, opts, { anonymous: t.anonymous });
    res.ok = t.expect ? Boolean(t.expect(res)) : res.ok;
    if (t.name) res.path = `${t.path} (${t.name})`;
    results.push(res);

    if (res.ok && t.path === '/api/campaigns' && t.method === 'POST' && res.data?.campaign?.id) {
      testCampId = res.data.campaign.id;
    }
    if (res.ok && t.path === '/api/rules' && t.method === 'POST' && res.data?.data?.id) {
      testRuleId = res.data.data.id;
    }

    const statusBadge = res.ok ? '✅ BAŞARILI' : '❌ HATA';
    console.log(`[${statusBadge}] ${res.method} ${res.path} -> ${res.status} (${res.durationMs}ms)`);
  }

  // Temizlik: Test verilerinin veritabanında kalmasını engelle
  if (testCampId) {
    await request(`/api/campaigns?id=${testCampId}`, { method: 'DELETE' });
  }
  if (testRuleId) {
    await request(`/api/rules?id=${testRuleId}`, { method: 'DELETE' });
  }

  console.log('\n--- Hesap ayrımı ve SaaS testleri ---');
  await tenantTests(results);

  console.log('\n=== TEST ÖZETİ ===');
  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  console.log(`Toplam Test: ${results.length}`);
  console.log(`Başarılı: ${passed}`);
  console.log(`Başarısız: ${failed}`);
  console.log(`Başarı Oranı: %${Math.round((passed / results.length) * 100)}`);
  if (failed > 0) process.exitCode = 1;
}

runAllTests();
