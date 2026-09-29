import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { mockIntegrations } from '@/data/mockData';

export async function GET() {
  try {
    const configs = await prisma.integrationConfig.findMany({
      orderBy: { createdAt: 'asc' }
    });

    // If database has configurations, merge them with schema template
    if (configs.length > 0) {
      const merged = mockIntegrations.map(base => {
        const providerKey = base.id.replace(/^int-/, '');
        const found = configs.find(c => c.provider === providerKey || c.name === base.platform);
        if (!found) return base;

        let parsedCredentials: any = {};
        try {
          parsedCredentials = JSON.parse(found.credentials);
        } catch {
          parsedCredentials = {};
        }

        return {
          ...base,
          connected: found.connected,
          accountName: found.accountName || base.accountName,
          lastSync: found.lastSync ? new Date(found.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : base.lastSync,
          badgeColor: found.connected 
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
            : 'bg-slate-800 text-slate-400 border-slate-700',
          fields: (base.fields || []).map((f: any) => ({
            ...f,
            value: parsedCredentials[f.label] || f.value || ''
          }))
        };
      });

      return NextResponse.json({
        success: true,
        data: merged
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
