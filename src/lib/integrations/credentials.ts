/**
 * Maps the credential fields sent by the Integrations screen (keyed by the labels in mockData.ts,
 * including labels used by earlier versions) to the typed credentials each service expects.
 * Test and sync routes both go through here so they always read the same keys.
 */

type Raw = Record<string, any> | null | undefined;

function pick(raw: Raw, ...keys: string[]): string {
  if (!raw) return '';
  for (const key of keys) {
    const value = raw[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
}

export function metaCredentials(raw: Raw) {
  return {
    accessToken: pick(raw, 'accessToken', 'Sistem Kullanıcısı Access Token (ads_read)', 'Pixel ID & CAPI Token',
      'Sistem Kullanıcısı Token (EAA...)', 'Meta System User Token', 'Access Token', 'token'),
    adAccountId: pick(raw, 'adAccountId', 'Ad Account ID', 'Reklam Hesabı ID (act_...)', 'Reklam Hesabı ID (Ad Account ID)', 'accountId')
  };
}

export function trendyolCredentials(raw: Raw) {
  return {
    supplierId: pick(raw, 'supplierId', 'Satıcı ID (Supplier ID)', 'Satıcı ID (SupplierId)', 'sellerId'),
    apiKey: pick(raw, 'apiKey', 'API Key', 'API Anahtarı'),
    apiSecret: pick(raw, 'apiSecret', 'API Secret', 'API Gizli Anahtarı (Secret)')
  };
}

export function hepsiburadaCredentials(raw: Raw) {
  return {
    merchantId: pick(raw, 'merchantId', 'Merchant ID', 'Mağaza ID', 'id'),
    secretKey: pick(raw, 'secretKey', 'Entegratör Gizli Anahtarı', 'Secret Key', 'API Şifresi', 'password'),
    serviceUsername: pick(raw, 'serviceUsername', 'API Kullanıcı Adı (Username)', 'username')
  };
}

export function googleCredentials(raw: Raw) {
  return {
    customerId: pick(raw, 'customerId', 'Customer ID', 'Google Ads Müşteri ID'),
    refreshToken: pick(raw, 'refreshToken', 'OAuth Refresh Token')
  };
}

export function whatsappCredentials(raw: Raw) {
  return {
    phoneNumberId: pick(raw, 'phoneNumberId', 'WhatsApp Phone Number ID'),
    systemUserToken: pick(raw, 'systemUserToken', 'Meta System User Token', 'token')
  };
}

export function parseStoredCredentials(json?: string | null): Record<string, any> {
  if (!json) return {};
  try {
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

/** Values sent by the browser win; empty ones fall back to what is stored (secrets are never sent to the browser). */
export function mergeCredentials(stored: Record<string, any>, incoming: Raw): Record<string, any> {
  const merged: Record<string, any> = { ...stored };
  for (const [key, value] of Object.entries(incoming || {})) {
    if (typeof value === 'string' && value.trim()) merged[key] = value;
  }
  return merged;
}

export function maskSecret(value: string): string {
  if (!value) return '';
  return value.length <= 4 ? '••••' : `••••${value.slice(-4)}`;
}
