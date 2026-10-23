import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenant } from '@/lib/tenant';
import { parseStoredCredentials, whatsappCredentials } from '@/lib/integrations/credentials';
import { sendWhatsAppMessage } from '@/lib/integrations/whatsapp';

// Free-form messages are only allowed within 24 hours of the customer's last message (Meta's customer service window)
const SERVICE_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  const tenant = await requireTenant(request);
  if (tenant instanceof NextResponse) return tenant;

  const integration = await prisma.integrationConfig.findFirst({
    where: { organizationId: tenant.orgId, provider: 'whatsapp' },
    select: { connected: true }
  });

  const messages = await prisma.whatsAppMessage.findMany({
    where: { organizationId: tenant.orgId },
    orderBy: { createdAt: 'asc' },
    take: 1000
  });

  const byCustomer = new Map<string, typeof messages>();
  for (const m of messages) {
    const list = byCustomer.get(m.waId) || [];
    list.push(m);
    byCustomer.set(m.waId, list);
  }

  const now = Date.now();
  const conversations = Array.from(byCustomer.entries()).map(([waId, list]) => {
    const last = list[list.length - 1];
    const lastInbound = [...list].reverse().find(m => m.direction === 'in');
    return {
      id: waId,
      phone: `+${waId}`,
      customerName: list.find(m => m.customerName)?.customerName || `+${waId}`,
      lastMessage: last.text,
      lastMessageAt: last.createdAt,
      canReply: Boolean(lastInbound && now - lastInbound.createdAt.getTime() < SERVICE_WINDOW_MS),
      messages: list.map(m => ({
        id: m.id,
        direction: m.direction,
        text: m.text,
        status: m.status,
        errorMessage: m.errorMessage,
        createdAt: m.createdAt
      }))
    };
  }).sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());

  return NextResponse.json({
    success: true,
    data: {
      connected: Boolean(integration?.connected),
      webhookConfigured: Boolean(process.env.WHATSAPP_APP_SECRET && process.env.WHATSAPP_VERIFY_TOKEN),
      conversations
    }
  });
}

export async function POST(request: Request) {
  const tenant = await requireTenant(request);
  if (tenant instanceof NextResponse) return tenant;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Geçersiz istek' }, { status: 400 });
  }

  const to = String(body.to || '').replace(/[^0-9]/g, '');
  const text = String(body.text || '').trim();
  if (!to || !text) {
    return NextResponse.json({ success: false, error: 'Alıcı numara ve mesaj zorunludur.' }, { status: 400 });
  }
  if (text.length > 4096) {
    return NextResponse.json({ success: false, error: 'Mesaj en fazla 4096 karakter olabilir.' }, { status: 400 });
  }

  const config = await prisma.integrationConfig.findFirst({
    where: { organizationId: tenant.orgId, provider: 'whatsapp' }
  });
  const credentials = whatsappCredentials(parseStoredCredentials(config?.credentials));
  if (!config?.connected || !credentials.phoneNumberId || !credentials.systemUserToken) {
    return NextResponse.json({
      success: false,
      error: 'WhatsApp bağlı değil. Entegrasyonlar sayfasından Phone Number ID ve System User Token girin.'
    }, { status: 400 });
  }

  const lastInbound = await prisma.whatsAppMessage.findFirst({
    where: { organizationId: tenant.orgId, waId: to, direction: 'in' },
    orderBy: { createdAt: 'desc' }
  });
  if (!lastInbound || Date.now() - lastInbound.createdAt.getTime() > SERVICE_WINDOW_MS) {
    return NextResponse.json({
      success: false,
      error: 'WhatsApp kuralı: müşteri size son 24 saat içinde yazmadıysa serbest mesaj gönderilemez (onaylı şablon gerekir).'
    }, { status: 400 });
  }

  try {
    const result = await sendWhatsAppMessage(credentials, to, text);
    const saved = await prisma.whatsAppMessage.create({
      data: {
        organizationId: tenant.orgId,
        waId: to,
        direction: 'out',
        text,
        waMessageId: result?.messages?.[0]?.id || null,
        status: 'sent'
      }
    });
    return NextResponse.json({ success: true, message: 'Mesaj WhatsApp üzerinden gönderildi.', data: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'WhatsApp mesajı gönderilemedi' }, { status: 502 });
  }
}
