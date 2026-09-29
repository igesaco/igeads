/**
 * Trendyol Marketplace Integration Service
 * Uses Trendyol Supplier API (SAPIGW)
 */

export interface TrendyolCredentials {
  supplierId: string;
  apiKey: string;
  apiSecret: string;
}

export interface TrendyolConnectionResult {
  success: boolean;
  supplierId?: string;
  totalProducts?: number;
  pingMs: number;
  error?: string;
}

export async function testTrendyolConnection(credentials: TrendyolCredentials): Promise<TrendyolConnectionResult> {
  const start = Date.now();
  const { supplierId, apiKey, apiSecret } = credentials;

  if (!supplierId || !apiKey || !apiSecret) {
    return {
      success: false,
      pingMs: 0,
      error: 'Satıcı ID (Supplier ID), API Key ve API Secret zorunludur.'
    };
  }

  const cleanSupplierId = supplierId.trim();
  const authHeader = `Basic ${Buffer.from(`${apiKey.trim()}:${apiSecret.trim()}`).toString('base64')}`;
  const url = `https://api.trendyol.com/sapigw/suppliers/${cleanSupplierId}/products?size=1`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'User-Agent': `${cleanSupplierId} - IgeAdsIntegration`,
        'Content-Type': 'application/json'
      }
    });

    const pingMs = Date.now() - start;

    if (res.status === 401 || res.status === 403) {
      return {
        success: false,
        pingMs,
        error: 'Trendyol API Kimlik Doğrulama Hatası (Yetkisiz API Key/Secret veya Satıcı ID uyuşmuyor).'
      };
    }

    if (!res.ok) {
      const errorText = await res.text();
      return {
        success: false,
        pingMs,
        error: `Trendyol API Hatası (${res.status}): ${errorText.slice(0, 100)}`
      };
    }

    const data = await res.json();
    return {
      success: true,
      supplierId: cleanSupplierId,
      totalProducts: data.totalElements ?? data.content?.length ?? 0,
      pingMs
    };
  } catch (err: any) {
    return {
      success: false,
      pingMs: Date.now() - start,
      error: err.message || 'Trendyol sunucusuna bağlanılamadı'
    };
  }
}

export async function fetchTrendyolProducts(credentials: TrendyolCredentials) {
  const { supplierId, apiKey, apiSecret } = credentials;
  const cleanSupplierId = supplierId.trim();
  const authHeader = `Basic ${Buffer.from(`${apiKey.trim()}:${apiSecret.trim()}`).toString('base64')}`;
  const url = `https://api.trendyol.com/sapigw/suppliers/${cleanSupplierId}/products?size=50`;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'User-Agent': `${cleanSupplierId} - IgeAdsIntegration`
    }
  });

  if (!res.ok) {
    throw new Error(`Trendyol ürün listesi alınamadı (${res.status})`);
  }

  const data = await res.json();
  return data.content || [];
}

export async function updateTrendyolPrice(
  credentials: TrendyolCredentials,
  items: Array<{ barcode: string; quantity?: number; salePrice: number; listPrice: number }>
) {
  const { supplierId, apiKey, apiSecret } = credentials;
  const cleanSupplierId = supplierId.trim();
  const authHeader = `Basic ${Buffer.from(`${apiKey.trim()}:${apiSecret.trim()}`).toString('base64')}`;
  const url = `https://api.trendyol.com/sapigw/suppliers/${cleanSupplierId}/products/price-and-inventory`;

  const payload = {
    items: items.map(item => ({
      barcode: item.barcode,
      ...(item.quantity !== undefined && { quantity: item.quantity }),
      salePrice: item.salePrice,
      listPrice: item.listPrice
    }))
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'User-Agent': `${cleanSupplierId} - IgeAdsIntegration`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Trendyol fiyat güncelleme başarısız: ${errorText}`);
  }

  return await res.json();
}
