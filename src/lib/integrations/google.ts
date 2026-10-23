/**
 * Google Ads API Integration Service
 */

export interface GoogleCredentials {
  customerId: string;
  developerToken?: string;
  refreshToken?: string;
}

export interface GoogleConnectionResult {
  success: boolean;
  customerId?: string;
  pingMs: number;
  error?: string;
  message?: string;
}

export async function testGoogleAdsConnection(credentials: GoogleCredentials): Promise<GoogleConnectionResult> {
  const start = Date.now();
  const { customerId } = credentials;

  if (!customerId) {
    return {
      success: false,
      pingMs: 0,
      error: 'Google Ads Müşteri Numarası (Customer ID) zorunludur.'
    };
  }

  const cleanId = customerId.replace(/-/g, '').trim();
  if (cleanId.length !== 10) {
    return {
      success: false,
      pingMs: Date.now() - start,
      error: 'Google Ads Müşteri Numarası 10 haneli olmalıdır (Örn: 412-894-1029).'
    };
  }

  // Only the ID format is checked here; there is no live Google Ads API call yet
  return {
    success: true,
    message: 'Müşteri numarası formatı doğru. Google Ads API ile canlı doğrulama henüz yapılmıyor.',
    customerId: `${cleanId.slice(0, 3)}-${cleanId.slice(3, 6)}-${cleanId.slice(6)}`,
    pingMs: Date.now() - start
  };
}
