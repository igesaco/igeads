import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireTenant } from '@/lib/tenant';
import { mockIntegrations } from '@/data/mockData';
import { maskSecret, mergeCredentials, parseStoredCredentials } from '@/lib/integrations/credentials';

export async function GET(request: Request) {
  try {
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;

    const configs = await prisma.integrationConfig.findMany({
      where: { organizationId: tenant.orgId },
      orderBy: { createdAt: 'asc' }
    });

    // If database has configurations, merge them with schema template
    if (configs.length > 0) {
      const merged = mockIntegrations.map(base => {
        const providerKey = base.id.replace(/^int-/, '');
        const found = configs.find(c => c.provider === providerKey || c.name === base.platform);
        if (!found) return base;

        const parsedCredentials = parseStoredCredentials(found.credentials);

        return {
          ...base,
          connected: found.connected,
          accountName: found.accountName || base.accountName,
          lastSync: found.lastSync ? new Date(found.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : base.lastSync,
          lastSyncAt: found.lastSync ? new Date(found.lastSync).toISOString() : null,
          badgeColor: found.connected 
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
            : 'bg-slate-800 text-slate-400 border-slate-700',
          // Secret values never leave the server; the browser only sees that one is stored
          fields: (base.fields || []).map((f: any) => {
            const storedValue = parsedCredentials[f.label] || '';
            if (f.isSecret) {
              return {
                ...f,
                value: '',
                hasStoredValue: Boolean(storedValue),
                placeholder: storedValue ? `${maskSecret(storedValue)} (kayıtlı, değiştirmek için yazın)` : f.placeholder
              };
            }
            return { ...f, value: storedValue || f.value || '' };
          })
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
    const tenant = await requireTenant(request);
    if (tenant instanceof NextResponse) return tenant;
    const body = await request.json();
    const { provider, name, category, credentials, accountName } = body;

    if (!provider || !name) {
      return NextResponse.json({ success: false, error: 'Provider ve Name zorunludur' }, { status: 400 });
    }

    // Keep stored secrets when the form leaves a secret field empty
    const existing = await prisma.integrationConfig.findFirst({ where: { provider, organizationId: tenant.orgId } });
    const incoming = typeof credentials === 'string' ? parseStoredCredentials(credentials) : (credentials || {});
    const mergedCredentials = JSON.stringify(mergeCredentials(parseStoredCredentials(existing?.credentials), incoming));

    // Saved credentials count as connected only after /api/integrations/test succeeds
    const saved = existing
      ? await prisma.integrationConfig.update({
          where: { id: existing.id },
          data: {
            name,
            category: category || 'ads',
            connected: false,
            accountName: accountName || undefined,
            credentials: mergedCredentials,
            status: 'configured'
          }
        })
      : await prisma.integrationConfig.create({
          data: {
            organizationId: tenant.orgId,
            provider,
            name,
            category: category || 'ads',
            connected: false,
            accountName: accountName || `${name} Hesabı`,
            credentials: mergedCredentials,
            status: 'configured'
          }
        });

    return NextResponse.json({
      success: true,
      message: `${name} bilgileri kaydedildi. Bağlantıyı doğrulamak için test ediliyor.`,
      data: { id: saved.id, provider: saved.provider, connected: saved.connected, status: saved.status }
    });
  } catch (err: any) {
    console.error('Save integration error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
