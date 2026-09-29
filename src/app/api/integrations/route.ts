import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockIntegrations } from '@/data/mockData';

export async function GET() {
  try {
    const configs = await prisma.integrationConfig.findMany({
      orderBy: { createdAt: 'asc' }
    });

    // If database has configurations, map them; otherwise return mock baseline
    if (configs.length > 0) {
      return NextResponse.json({
        success: true,
        data: configs.map(c => {
          let parsedCredentials: any = {};
          try {
            parsedCredentials = JSON.parse(c.credentials);
          } catch {
            parsedCredentials = {};
          }
          return {
            id: c.id,
            platform: c.name,
            provider: c.provider,
            category: c.category,
            connected: c.connected,
            accountName: c.accountName || `${c.name} Hesabı`,
            lastSync: c.lastSync ? new Date(c.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Henüz senkronize edilmedi',
            syncFrequency: c.syncFrequency,
            status: c.status,
            credentials: parsedCredentials
          };
        })
      });
    }

    return NextResponse.json({
      success: true,
      data: mockIntegrations
    });
  } catch (err: any) {
    console.error('Fetch integrations error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, name, category, credentials, accountName, connected = true } = body;

    if (!provider || !name) {
      return NextResponse.json({ success: false, error: 'Provider ve Name zorunludur' }, { status: 400 });
    }

    const saved = await prisma.integrationConfig.upsert({
      where: { provider },
      update: {
        name,
        category: category || 'ads',
        connected: Boolean(connected),
        accountName: accountName || undefined,
        credentials: typeof credentials === 'string' ? credentials : JSON.stringify(credentials || {}),
        lastSync: new Date(),
        status: 'active'
      },
      create: {
        provider,
        name,
        category: category || 'ads',
        connected: Boolean(connected),
        accountName: accountName || `${name} Hesabı`,
        credentials: typeof credentials === 'string' ? credentials : JSON.stringify(credentials || {}),
        lastSync: new Date(),
        status: 'active'
      }
    });

    return NextResponse.json({
      success: true,
      message: `${name} entegrasyonu başarıyla kaydedildi.`,
      data: saved
    });
  } catch (err: any) {
    console.error('Save integration error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
