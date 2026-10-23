/**
 * Sends a product's new price and/or stock to the marketplace it is listed on, using the organization's own
 * integration keys. Callers update the local copy only after this succeeds.
 */
import type { Product } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { hepsiburadaCredentials, parseStoredCredentials, trendyolCredentials } from './credentials';
import { updateTrendyolPrice } from './trendyol';
import { updateHepsiburadaPriceAndStock } from './hepsiburada';

export interface PushResult {
  pushed: boolean; // false = product is not linked to a connected marketplace; only the local record changes
  marketplace: string;
  message: string;
}

export async function pushProductUpdate(
  orgId: string,
  product: Pick<Product, 'sku' | 'marketplace' | 'price' | 'stock'>,
  change: { price?: number; stock?: number }
): Promise<PushResult> {
  const marketplace = (product.marketplace || '').toLowerCase();
  const provider = marketplace.includes('trendyol') ? 'trendyol' : marketplace.includes('hepsiburada') ? 'hepsiburada' : null;
  if (!provider) {
    return { pushed: false, marketplace: product.marketplace, message: 'Bu ürün bağlı bir pazaryerine ait değil; sadece panelde güncellendi.' };
  }

  const config = await prisma.integrationConfig.findFirst({ where: { organizationId: orgId, provider } });
  if (!config?.connected) {
    return { pushed: false, marketplace: product.marketplace, message: `${product.marketplace} entegrasyonu bağlı değil; değişiklik sadece panelde kaydedildi.` };
  }
  const raw = parseStoredCredentials(config.credentials);

  if (provider === 'trendyol') {
    const price = change.price ?? product.price;
    await updateTrendyolPrice(trendyolCredentials(raw), [{
      barcode: product.sku,
      salePrice: price,
      listPrice: price,
      ...(change.stock !== undefined && { quantity: change.stock })
    }]);
    return { pushed: true, marketplace: 'Trendyol', message: 'Trendyol\'a gönderildi. Trendyol değişikliği birkaç dakika içinde işler.' };
  }

  await updateHepsiburadaPriceAndStock(hepsiburadaCredentials(raw), product.sku, change.price, change.stock);
  return { pushed: true, marketplace: 'Hepsiburada', message: 'Hepsiburada\'ya gönderildi. Hepsiburada değişikliği birkaç dakika içinde işler.' };
}
