import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenant } from '@/lib/tenant';
import { testMetaConnection } from '@/lib/integrations/meta';
import { testTrendyolConnection } from '@/lib/integrations/trendyol';
import { testGoogleAdsConnection } from '@/lib/integrations/google';
import { testWhatsAppConnection } from '@/lib/integrations/whatsapp';
import { testHepsiburadaConnection } from '@/lib/integrations/hepsiburada';
import {
  googleCredentials,
  hepsiburadaCredentials,
  mergeCredentials,
  metaCredentials,
  parseStoredCredentials,
  trendyolCredentials,
  whatsappCredentials
} from '@/lib/integrations/credentials';

export async function POST(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
    const body = await request.json();
    const { provider } = body;

    if (!provider) {
      return NextResponse.json({ success: false, error: 'Sağlayıcı (provider) belirtilmedi' }, { status: 400 });
    }

    const providerKey = String(provider).replace(/^int-/, '').toLowerCase();

    // Secrets are masked in the browser, so fill empty fields from the stored config
    const stored = await prisma.integrationConfig.findFirst({ where: { provider: providerKey, organizationId: tenant.orgId } });
    const credentials = mergeCredentials(parseStoredCredentials(stored?.credentials), body.credentials);

    let testResult: any;

    switch (providerKey) {
      case 'hepsiburada':
        testResult = await testHepsiburadaConnection(hepsiburadaCredentials(credentials));
        break;
      case 'meta':
        testResult = await testMetaConnection(metaCredentials(credentials));
        break;
      case 'trendyol':
        testResult = await testTrendyolConnection(trendyolCredentials(credentials));
        break;
      case 'google':
        testResult = await testGoogleAdsConnection(googleCredentials(credentials));
        break;
      case 'whatsapp':
        testResult = await testWhatsAppConnection(whatsappCredentials(credentials));
        break;
      default:
        testResult = {
          success: false,
          pingMs: 0,
          error: `${provider} için canlı bağlantı testi henüz desteklenmiyor. Bilgiler kaydedilebilir ancak veri çekilmez.`
        };
    }

    if (stored) {
      await prisma.integrationConfig.update({
        where: { id: stored.id },
        data: {
          connected: Boolean(testResult.success),
          status: testResult.success ? 'active' : 'error',
          ...(testResult.accountName && { accountName: testResult.accountName })
        }
      });
    }

    return NextResponse.json(testResult);
  } catch (err: any) {
    console.error('Integration test error:', err);
    return NextResponse.json({
      success: false,
      error: err.message || 'Entegrasyon testi sırasında hata oluştu'
    }, { status: 500 });
  }
}
