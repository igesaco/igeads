/**
 * iyzico Checkout Form (hosted payment page) client.
 * Auth follows iyzico's IYZWSv2 scheme, the same one the official iyzipay-node package uses:
 * signature = HMAC-SHA256(secretKey, randomKey + uriPath + requestBody), hex.
 * Docs: https://docs.iyzico.com/odeme-metotlari/odeme-formu
 */
import { createHmac, randomBytes } from 'crypto';

const DEFAULT_BASE = 'https://sandbox-api.iyzipay.com';

export function iyzicoConfig() {
  const apiKey = process.env.IYZICO_API_KEY?.trim();
  const secretKey = process.env.IYZICO_SECRET_KEY?.trim();
  const baseUrl = (process.env.IYZICO_BASE_URL?.trim() || DEFAULT_BASE).replace(/\/$/, '');
  return apiKey && secretKey ? { apiKey, secretKey, baseUrl } : null;
}

export function authorizationHeader(apiKey: string, secretKey: string, uriPath: string, body: string, randomKey: string): string {
  const signature = createHmac('sha256', secretKey).update(randomKey + uriPath + body).digest('hex');
  const params = `apiKey:${apiKey}&randomKey:${randomKey}&signature:${signature}`;
  return `IYZWSv2 ${Buffer.from(params).toString('base64')}`;
}

/** iyzico expects prices as strings with at least one decimal ("1490.0") */
export function formatPrice(value: number): string {
  const s = String(Math.round(value * 100) / 100);
  return s.includes('.') ? s : `${s}.0`;
}

async function call(uriPath: string, payload: Record<string, unknown>): Promise<any> {
  const config = iyzicoConfig();
  if (!config) throw new Error('iyzico anahtarları (IYZICO_API_KEY / IYZICO_SECRET_KEY) tanımlı değil');

  const body = JSON.stringify(payload);
  const randomKey = `${Date.now()}${randomBytes(8).toString('hex')}`;
  const res = await fetch(config.baseUrl + uriPath, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-iyzi-rnd': randomKey,
      Authorization: authorizationHeader(config.apiKey, config.secretKey, uriPath, body, randomKey)
    },
    body
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok && !data?.status) {
    throw new Error(`iyzico yanıt vermedi (${res.status})`);
  }
  return data;
}

export interface CheckoutBuyer {
  id: string;
  name: string;
  surname: string;
  email: string;
  gsmNumber?: string;
  identityNumber: string;
  address: string;
  city: string;
  ip: string;
}

export interface CheckoutInit {
  conversationId: string;
  basketId: string;
  price: number;
  itemName: string;
  callbackUrl: string;
  buyer: CheckoutBuyer;
}

export async function initializeCheckoutForm(input: CheckoutInit): Promise<{ token: string; paymentPageUrl: string }> {
  const contactName = `${input.buyer.name} ${input.buyer.surname}`.trim();
  const address = { contactName, city: input.buyer.city, country: 'Turkey', address: input.buyer.address };
  const price = formatPrice(input.price);

  const data = await call('/payment/iyzipos/checkoutform/initialize/auth/ecom', {
    locale: 'tr',
    conversationId: input.conversationId,
    price,
    basketId: input.basketId,
    paymentGroup: 'SUBSCRIPTION',
    buyer: {
      id: input.buyer.id,
      name: input.buyer.name,
      surname: input.buyer.surname,
      identityNumber: input.buyer.identityNumber,
      email: input.buyer.email,
      gsmNumber: input.buyer.gsmNumber || undefined,
      registrationAddress: input.buyer.address,
      city: input.buyer.city,
      country: 'Turkey',
      ip: input.buyer.ip
    },
    shippingAddress: address,
    billingAddress: address,
    basketItems: [
      { id: input.basketId, name: input.itemName, category1: 'Yazılım Aboneliği', itemType: 'VIRTUAL', price }
    ],
    callbackUrl: input.callbackUrl,
    currency: 'TRY',
    paidPrice: price,
    enabledInstallments: [1]
  });

  if (data?.status !== 'success' || !data.token) {
    throw new Error(data?.errorMessage || 'Ödeme sayfası açılamadı');
  }
  return { token: data.token, paymentPageUrl: data.paymentPageUrl };
}

export interface CheckoutResult {
  paid: boolean;
  basketId?: string;
  paidPrice?: number;
  paymentId?: string;
  errorMessage?: string;
}

export async function retrieveCheckoutForm(token: string, conversationId: string): Promise<CheckoutResult> {
  const data = await call('/payment/iyzipos/checkoutform/auth/ecom/detail', { locale: 'tr', conversationId, token });
  return {
    paid: data?.status === 'success' && data?.paymentStatus === 'SUCCESS',
    basketId: data?.basketId,
    paidPrice: data?.paidPrice !== undefined ? Number(data.paidPrice) : undefined,
    paymentId: data?.paymentId,
    errorMessage: data?.errorMessage
  };
}
