/**
 * Trendyol Marketplace Integration Service
 * Uses the Trendyol integration gateway (apigw.trendyol.com/integration). The old sapigw paths and the
 * V1 product filter are retired; products are read through the V2 approved inventory-and-price service.
 * Docs: https://developers.trendyol.com/v3.0/docs/product-filtering-approved-products-stock-and-price
 */

const TRENDYOL_BASE = process.env.TRENDYOL_API_BASE || 'https://apigw.trendyol.com/integration';
const STOREFRONT_CODE = process.env.TRENDYOL_STOREFRONT_CODE || 'TR';

function trendyolHeaders(supplierId: string, apiKey: string, apiSecret: string): Record<string, string> {
  return {
    'Authorization': `Basic ${Buffer.from(`${apiKey.trim()}:${apiSecret.trim()}`).toString('base64')}`,
    // Trendyol blocks requests without "<sellerId> - SelfIntegration" style User-Agent (403)
    'User-Agent': `${supplierId} - SelfIntegration`,
    'storeFrontCode': STOREFRONT_CODE,
    'Content-Type': 'application/json'
  };
}

function inventoryUrl(supplierId: string, size: number) {
  return `${TRENDYOL_BASE}/product/sellers/${supplierId}/products/approved/inventory-and-price?page=0&size=${size}`;
}

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

  try {
    const res = await fetch(inventoryUrl(cleanSupplierId, 1), {
      method: 'GET',
      headers: trendyolHeaders(cleanSupplierId, apiKey, apiSecret)
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

export interface TrendyolVariant {
  barcode: string;
  stockCode?: string;
  productMainId?: string;
  salePrice?: number;
  listPrice?: number;
  quantity?: number;
}

/** Returns one row per variant (barcode); the V2 service has no product title */
export async function fetchTrendyolProducts(credentials: TrendyolCredentials): Promise<TrendyolVariant[]> {
  const { supplierId, apiKey, apiSecret } = credentials;
  const cleanSupplierId = supplierId.trim();

  const res = await fetch(inventoryUrl(cleanSupplierId, 100), {
    method: 'GET',
    headers: trendyolHeaders(cleanSupplierId, apiKey, apiSecret)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Trendyol ürün listesi alınamadı (${res.status}): ${errorText.slice(0, 150)}`);
  }

  const data = await res.json();
  const variants: TrendyolVariant[] = [];
  for (const product of data.content || []) {
    for (const v of product.variants || []) {
      if (v.barcode) variants.push({ ...v, productMainId: product.productMainId });
    }
  }
  return variants;
}

export async function updateTrendyolPrice(
  credentials: TrendyolCredentials,
  items: Array<{ barcode: string; quantity?: number; salePrice: number; listPrice: number }>
) {
  const { supplierId, apiKey, apiSecret } = credentials;
  const cleanSupplierId = supplierId.trim();
  const url = `${TRENDYOL_BASE}/inventory/sellers/${cleanSupplierId}/products/price-and-inventory`;

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
    headers: trendyolHeaders(cleanSupplierId, apiKey, apiSecret),
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Trendyol fiyat güncelleme başarısız: ${errorText}`);
  }

  return await res.json();
}

export interface TrendyolBuyboxInfo {
  barcode: string;
  buyboxOrder: number; // 1 = this seller holds the buybox
  buyboxPrice: number;
  hasMultipleSeller: boolean;
}

/** Buybox state per barcode; Trendyol accepts at most 10 barcodes per call */
export async function fetchTrendyolBuybox(credentials: TrendyolCredentials, barcodes: string[]): Promise<TrendyolBuyboxInfo[]> {
  const { supplierId, apiKey, apiSecret } = credentials;
  const cleanSupplierId = supplierId.trim();
  const url = `${TRENDYOL_BASE}/product/sellers/${cleanSupplierId}/products/buybox-information`;
  const results: TrendyolBuyboxInfo[] = [];

  for (let i = 0; i < barcodes.length; i += 10) {
    const res = await fetch(url, {
      method: 'POST',
      headers: trendyolHeaders(cleanSupplierId, apiKey, apiSecret),
      body: JSON.stringify({ barcodes: barcodes.slice(i, i + 10) })
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Trendyol buybox bilgisi alınamadı (${res.status}): ${errorText.slice(0, 150)}`);
    }
    const data = await res.json();
    for (const b of data.buyboxInfo || []) {
      if (b.barcode) {
        results.push({
          barcode: b.barcode,
          buyboxOrder: Number(b.buyboxOrder),
          buyboxPrice: Number(b.buyboxPrice),
          hasMultipleSeller: Boolean(b.hasMultipleSeller)
        });
      }
    }
  }
  return results;
}
