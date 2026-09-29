/**
 * Meta (Facebook & Instagram) Marketing API Integration Service
 * Uses Meta Graph API v21.0
 */

export interface MetaCredentials {
  accessToken: string;
  adAccountId: string;
}

export interface MetaConnectionResult {
  success: boolean;
  accountName?: string;
  currency?: string;
  amountSpent?: string;
  status?: string;
  pingMs: number;
  error?: string;
}

export async function testMetaConnection(credentials: MetaCredentials): Promise<MetaConnectionResult> {
  const start = Date.now();
  const { accessToken, adAccountId } = credentials;

  if (!accessToken || !adAccountId) {
    return {
      success: false,
      pingMs: 0,
      error: 'Access Token ve Reklam Hesabı ID (Ad Account ID) zorunludur.'
    };
  }

  // Clean account id (remove 'act_' prefix if user entered it)
  const cleanId = adAccountId.replace(/^act_/, '').trim();
  const url = `https://graph.facebook.com/v21.0/act_${cleanId}?fields=name,account_status,currency,amount_spent&access_token=${accessToken.trim()}`;

  try {
    const res = await fetch(url, { method: 'GET' });
    const pingMs = Date.now() - start;
    const data = await res.json();

    if (!res.ok || data.error) {
      return {
        success: false,
        pingMs,
        error: data.error?.message || `Meta API Hatası (${res.status})`
      };
    }

    const statusMap: Record<number, string> = {
      1: 'Aktif (Kullanıma Uygun)',
      2: 'Devre Dışı',
      3: 'Ödeme Bekleniyor',
      7: 'İnceleniyor',
      9: 'Kapatıldı'
    };

    return {
      success: true,
      accountName: data.name || `Hesap ${cleanId}`,
      currency: data.currency || 'TRY',
      amountSpent: data.amount_spent ? `${(parseFloat(data.amount_spent) / 100).toLocaleString('tr-TR')} ${data.currency}` : undefined,
      status: statusMap[data.account_status] || 'Bilinmiyor',
      pingMs
    };
  } catch (err: any) {
    return {
      success: false,
      pingMs: Date.now() - start,
      error: err.message || 'Meta sunucusuna bağlanılamadı'
    };
  }
}

export async function fetchMetaCampaigns(credentials: MetaCredentials) {
  const { accessToken, adAccountId } = credentials;
  const cleanId = adAccountId.replace(/^act_/, '').trim();
  const url = `https://graph.facebook.com/v21.0/act_${cleanId}/campaigns?fields=id,name,status,daily_budget,lifetime_budget,insights{spend,purchase_roas,cpc,ctr,impressions,clicks}&limit=25&access_token=${accessToken.trim()}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new Error(data.error?.message || 'Meta kampanyaları alınamadı');
    }
    return data.data || [];
  } catch (err: any) {
    console.error('Fetch Meta campaigns error:', err);
    throw err;
  }
}
