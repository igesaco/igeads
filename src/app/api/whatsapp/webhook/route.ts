import { NextResponse } from 'next/server';
import { createHmac, timingSafeEqual } from 'crypto';
import { prisma } from '@/lib/prisma';
import { parseStoredCredentials, whatsappCredentials } from '@/lib/integrations/credentials';

/**
 * Meta WhatsApp Cloud API webhook.
 * GET: subscription handshake (hub.verify_token must equal WHATSAPP_VERIFY_TOKEN).
 * POST: incoming messages and delivery statuses, signed with the Meta app secret (X-Hub-Signature-256).
 * Docs: https://developers.facebook.com/docs/graph-api/webhooks/getting-started
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const expected = process.env.WHATSAPP_VERIFY_TOKEN;
  if (
    expected &&
    searchParams.get('hub.mode') === 'subscribe' &&
    searchParams.get('hub.verify_token') === expected
  ) {
    return new NextResponse(searchParams.get('hub.challenge') || '', { status: 200 });
  }
  return new NextResponse('Forbidden', { status: 403 });
}

function validSignature(raw: string, header: string | null, secret: string): boolean {
  if (!header?.startsWith('sha256=')) return false;
  const expected = Buffer.from(createHmac('sha256', secret).update(raw).digest('hex'));
  const given = Buffer.from(header.slice(7));
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/** Finds the account whose connected WhatsApp integration uses this phone number id */
async function organizationFor(phoneNumberId: string): Promise<string | null> {
  const configs = await prisma.integrationConfig.findMany({
    where: { provider: 'whatsapp', organizationId: { not: null } },
    select: { organizationId: true, credentials: true }
  });
  const match = configs.find(c => whatsappCredentials(parseStoredCredentials(c.credentials)).phoneNumberId?.trim() === phoneNumberId);
  return match?.organizationId ?? null;
}

function messageText(m: any): string {
  if (m.type === 'text') return m.text?.body || '';
  if (m.type === 'button') return m.button?.text || '';
  if (m.type === 'interactive') return m.interactive?.button_reply?.title || m.interactive?.list_reply?.title || '';
  return `[${m.type || 'mesaj'}]`;
}

export async function POST(request: Request) {
  const secret = process.env.WHATSAPP_APP_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'WHATSAPP_APP_SECRET tanımlı değil' }, { status: 503 });
  }

  const raw = await request.text();
  if (!validSignature(raw, request.headers.get('x-hub-signature-256'), secret)) {
    return NextResponse.json({ error: 'Geçersiz imza' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Geçersiz gövde' }, { status: 400 });
  }

  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      const value = change.value || {};
      const phoneNumberId = value.metadata?.phone_number_id;
      if (!phoneNumberId) continue;
      const orgId = await organizationFor(String(phoneNumberId));
      if (!orgId) continue;

      const names = new Map<string, string>();
      for (const c of value.contacts || []) {
        if (c.wa_id) names.set(c.wa_id, c.profile?.name || '');
      }

      for (const m of value.messages || []) {
        if (!m.id || !m.from) continue;
        await prisma.whatsAppMessage.upsert({
          where: { waMessageId: m.id },
          update: {},
          create: {
            organizationId: orgId,
            waId: String(m.from),
            customerName: names.get(m.from) || null,
            direction: 'in',
            text: messageText(m),
            waMessageId: m.id,
            status: 'received',
            createdAt: m.timestamp ? new Date(Number(m.timestamp) * 1000) : new Date()
          }
        });
      }

      for (const s of value.statuses || []) {
        if (!s.id || !s.status) continue;
        await prisma.whatsAppMessage.updateMany({
          where: { waMessageId: s.id, organizationId: orgId },
          data: {
            status: s.status,
            ...(s.errors?.[0] && { errorMessage: s.errors[0].title || s.errors[0].message })
          }
        });
      }
    }
  }

  // Meta retries anything that is not a 200
  return NextResponse.json({ received: true });
}
