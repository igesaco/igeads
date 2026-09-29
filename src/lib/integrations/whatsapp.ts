/**
 * Meta WhatsApp Business Cloud API Integration Service
 * Uses Meta Graph API v21.0
 */

export interface WhatsAppCredentials {
  phoneNumberId: string;
  systemUserToken: string;
}

export interface WhatsAppConnectionResult {
  success: boolean;
  phoneNumber?: string;
  verifiedName?: string;
  qualityRating?: string;
  pingMs: number;
  error?: string;
}

export async function testWhatsAppConnection(credentials: WhatsAppCredentials): Promise<WhatsAppConnectionResult> {
  const start = Date.now();
  const { phoneNumberId, systemUserToken } = credentials;

  if (!phoneNumberId || !systemUserToken) {
    return {
      success: false,
      pingMs: 0,
      error: 'WhatsApp Phone Number ID ve Meta System User Token zorunludur.'
    };
  }

  const url = `https://graph.facebook.com/v21.0/${phoneNumberId.trim()}?fields=verified_name,code_verification_status,display_phone_number,quality_rating&access_token=${systemUserToken.trim()}`;

  try {
    const res = await fetch(url);
    const pingMs = Date.now() - start;
    const data = await res.json();

    if (!res.ok || data.error) {
      return {
        success: false,
        pingMs,
        error: data.error?.message || `WhatsApp Cloud API Hatası (${res.status})`
      };
    }

    return {
      success: true,
      phoneNumber: data.display_phone_number,
      verifiedName: data.verified_name || 'Doğrulanmış İşletme',
      qualityRating: data.quality_rating || 'HIGH (Yeşil)',
      pingMs
    };
  } catch (err: any) {
    return {
      success: false,
      pingMs: Date.now() - start,
      error: err.message || 'WhatsApp Cloud API sunucusuna bağlanılamadı'
    };
  }
}

export async function sendWhatsAppMessage(
  credentials: WhatsAppCredentials,
  to: string,
  messageText: string
) {
  const { phoneNumberId, systemUserToken } = credentials;
  const url = `https://graph.facebook.com/v21.0/${phoneNumberId.trim()}/messages`;

  const cleanTo = to.replace(/[^0-9]/g, '');

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: cleanTo,
    type: 'text',
    text: {
      preview_url: true,
      body: messageText
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${systemUserToken.trim()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error?.message || 'WhatsApp mesajı gönderilemedi');
  }

  return data;
}
