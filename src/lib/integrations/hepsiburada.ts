/**
 * Hepsiburada Marketplace Integration Service
 * Uses Hepsiburada Listing API & OMS API
 * Basic Auth: base64(username:secretKey) with User-Agent header
 */

export interface HepsiburadaCredentials {
  merchantId: string;
  secretKey: string;
  serviceUsername?: string;
}

export interface HepsiburadaConnectionResult {
  success: boolean;
  merchantId?: string;
  totalProducts?: number;
  pingMs: number;
  error?: string;
  message?: string;
}

export interface HepsiburadaListingItem {
  listingId?: string;
  hepsiburadaSku?: string;
  merchantSku?: string;
  price?: number;
  availableStock?: number;
  commissionRate?: number;
  isSalable?: boolean;
  isSuspended?: boolean;
  isLocked?: boolean;
  cargoCompany1?: string;
  [key: string]: any;
}

/**
 * Test live connection to Hepsiburada Listing API
 */
export async function testHepsiburadaConnection(
  credentials: HepsiburadaCredentials
): Promise<HepsiburadaConnectionResult> {
  const start = Date.now();
  const { merchantId, secretKey, serviceUsername } = credentials;

  if (!merchantId || !secretKey) {
    return {
      success: false,
      pingMs: 0,
      error: 'Hepsiburada Merchant ID (Mağaza ID) ve Entegratör Gizli Anahtarı zorunludur.'
    };
  }

  const cleanMerchantId = merchantId.trim();
  const cleanSecretKey = secretKey.trim();
  const username = serviceUsername?.trim() || cleanMerchantId;

  const authHeader = `Basic ${Buffer.from(`${username}:${cleanSecretKey}`).toString('base64')}`;
  const url = `https://listing-external.hepsiburada.com/listings/merchantid/${cleanMerchantId}?offset=0&limit=1`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'User-Agent': `${cleanMerchantId} - IgeAdsIntegration`,
        'Accept': 'application/json'
      }
    });

    const pingMs = Date.now() - start;

    if (res.status === 401 || res.status === 403) {
      const errorText = await res.text();
      return {
        success: false,
        pingMs,
        error: `Hepsiburada API Yetkilendirme Başarısız (401 Unauthorized): Girilen anahtar Hepsiburada sunucuları tarafından reddedildi. Lütfen Hepsiburada Satıcı Paneli (merchant.hepsiburada.com) > 'Entegrasyon Bilgileri' sekmesinden aldığınız 'Entegratör Gizli Anahtarı (API Secret)' bilgisini girdiğinizden emin olun (Panel giriş şifresi değil, API Secret gereklidir). Ayrıca Satıcı Destek veya Entegratörlerim menüsünden yetkilendirme verilmelidir.`
      };
    }

    if (!res.ok) {
      const errorText = await res.text();
      return {
        success: false,
        pingMs,
        error: `Hepsiburada API Hatası (${res.status}): ${errorText.slice(0, 150)}`
      };
    }

    const data = await res.json();
    const count = data.listings?.length ?? data.totalElements ?? 0;

    return {
      success: true,
      merchantId: cleanMerchantId,
      totalProducts: count,
      pingMs,
      message: `Hepsiburada Mağazasına Başarıyla Bağlandı (${count} ürün bulundu).`
    };
  } catch (err: any) {
    return {
      success: false,
      pingMs: Date.now() - start,
      error: err.message || 'Hepsiburada sunucularına erişilemedi.'
    };
  }
}

/**
 * Fetch product listings from Hepsiburada Listing API
 */
export async function fetchHepsiburadaProducts(
  credentials: HepsiburadaCredentials
): Promise<HepsiburadaListingItem[]> {
  const { merchantId, secretKey, serviceUsername } = credentials;
  const cleanMerchantId = merchantId.trim();
  const cleanSecretKey = secretKey.trim();
  const username = serviceUsername?.trim() || cleanMerchantId;

  const authHeader = `Basic ${Buffer.from(`${username}:${cleanSecretKey}`).toString('base64')}`;
  const url = `https://listing-external.hepsiburada.com/listings/merchantid/${cleanMerchantId}?offset=0&limit=50`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'User-Agent': `${cleanMerchantId} - IgeAdsIntegration`,
      'Accept': 'application/json'
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    if (res.status === 401) {
      throw new Error(`Hepsiburada Yetkilendirme Hatası (401): Girilen Gizli Anahtar Hepsiburada API tarafından doğrulanamadı. Lütfen satıcı şifreniz yerine Hepsiburada Satıcı Paneli > Entegrasyon Bilgileri alanındaki API Secret anahtarını girin.`);
    }
    throw new Error(`Hepsiburada ürünleri çekilemedi (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data.listings || [];
}

/**
 * Update stock and price for a Hepsiburada SKU
 */
export async function updateHepsiburadaPriceAndStock(
  credentials: HepsiburadaCredentials,
  sku: string,
  price: number,
  stock?: number
) {
  const { merchantId, secretKey, serviceUsername } = credentials;
  const cleanMerchantId = merchantId.trim();
  const cleanSecretKey = secretKey.trim();
  const username = serviceUsername?.trim() || cleanMerchantId;

  const authHeader = `Basic ${Buffer.from(`${username}:${cleanSecretKey}`).toString('base64')}`;
  const url = `https://listing-external.hepsiburada.com/listings/merchantid/${cleanMerchantId}/sku/${sku}`;

  const payload: any = {
    price: Number(price)
  };
  if (stock !== undefined) {
    payload.availableStock = Number(stock);
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': authHeader,
      'User-Agent': `${cleanMerchantId} - IgeAdsIntegration`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Hepsiburada fiyat güncelleme başarısız: ${errorText}`);
  }

  return await res.json();
}
