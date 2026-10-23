/**
 * Organization (tenant) context for API routes. Every query on customer data must be scoped with the
 * organizationId returned here, so one account never sees another account's rows.
 */
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import type { Organization } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS, verifySessionToken, type SessionUser } from '@/lib/auth';
import { limitsFor } from '@/lib/plans';

export const PORTAL_CLIENT_HEADER = 'x-portal-verified-client';
export const PORTAL_ORG_HEADER = 'x-portal-verified-org';

export interface AccessState {
  active: boolean;
  status: 'trialing' | 'active' | 'expired';
  plan: string;
  daysLeft: number | null; // null = no end date
  endsAt: Date | null;
}

export interface TenantContext {
  session: SessionUser;
  orgId: string;
  org: Organization;
  access: AccessState;
}

export function accessState(org: Organization, now = new Date()): AccessState {
  const endsAt = org.planStatus === 'trialing' ? org.trialEndsAt : org.currentPeriodEnd;
  const notExpired = !endsAt || endsAt > now;
  const active = (org.planStatus === 'active' || org.planStatus === 'trialing') && notExpired;
  return {
    active,
    status: !active ? 'expired' : org.planStatus === 'trialing' ? 'trialing' : 'active',
    plan: org.plan,
    endsAt: endsAt ?? null,
    daysLeft: endsAt ? Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / 86400000)) : null
  };
}

export async function getTenant(): Promise<TenantContext | null> {
  const cookieStore = await cookies();
  const session = await verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  if (!session) return null;

  // The user may have been removed or moved since the cookie was issued
  const user = await prisma.user.findUnique({ where: { id: session.userId }, include: { organization: true } });
  if (!user || user.organizationId !== session.orgId) return null;

  return {
    session: { ...session, role: user.role, name: user.name },
    orgId: user.organizationId,
    org: user.organization,
    access: accessState(user.organization)
  };
}

interface RequireOptions {
  /** Let the request through even when the trial or subscription has ended (billing, account pages) */
  allowExpired?: boolean;
  /** Only these roles may call the route */
  roles?: string[];
}

/**
 * Returns the tenant, or a ready error response. Reads keep working after a subscription ends so customers
 * can still see their data; changes are blocked until they pay.
 */
export async function requireTenant(request?: Request, options: RequireOptions = {}): Promise<TenantContext | NextResponse> {
  const tenant = await getTenant();
  if (!tenant) {
    return NextResponse.json({ success: false, error: 'Bu işlem için giriş yapmanız gerekiyor' }, { status: 401 });
  }
  if (options.roles && !options.roles.includes(tenant.session.role)) {
    return NextResponse.json({ success: false, error: 'Bu işlem için yetkiniz yok' }, { status: 403 });
  }
  const method = request?.method?.toUpperCase() || 'GET';
  if (!tenant.access.active && !options.allowExpired && method !== 'GET') {
    return NextResponse.json({
      success: false,
      code: 'subscription_required',
      error: 'Deneme süreniz veya aboneliğiniz sona erdi. Devam etmek için Paketler & Abonelik sayfasından bir paket seçin.'
    }, { status: 402 });
  }
  return tenant;
}

/** Portal visitors are authorized by middleware for one brand of one organization */
export function getPortalContext(request: Request): { orgId: string; clientSlug: string } | null {
  const clientSlug = request.headers.get(PORTAL_CLIENT_HEADER);
  const orgId = request.headers.get(PORTAL_ORG_HEADER);
  return clientSlug && orgId ? { orgId, clientSlug } : null;
}

export async function clientLimitReached(org: Organization): Promise<{ reached: boolean; max: number | null }> {
  const { maxClients } = limitsFor(org.plan === 'trial' ? 'growth' : org.plan);
  if (maxClients === null) return { reached: false, max: null };
  const count = await prisma.client.count({ where: { organizationId: org.id } });
  return { reached: count >= maxClients, max: maxClients };
}

export async function userLimitReached(org: Organization): Promise<{ reached: boolean; max: number | null }> {
  const { maxUsers } = limitsFor(org.plan === 'trial' ? 'growth' : org.plan);
  if (maxUsers === null) return { reached: false, max: null };
  const count = await prisma.user.count({ where: { organizationId: org.id } });
  return { reached: count >= maxUsers, max: maxUsers };
}

/** Rows created before accounts existed belong to nobody; the platform owner's organization takes them over */
export async function claimUnownedRows(orgId: string) {
  const where = { organizationId: null };
  const data = { organizationId: orgId };
  await prisma.$transaction([
    prisma.client.updateMany({ where, data }),
    prisma.campaign.updateMany({ where, data }),
    prisma.product.updateMany({ where, data }),
    prisma.automationRule.updateMany({ where, data }),
    prisma.notification.updateMany({ where, data }),
    prisma.integrationConfig.updateMany({ where, data }),
    prisma.teamMember.updateMany({ where, data }),
    prisma.agencyTask.updateMany({ where, data }),
    prisma.agencyContract.updateMany({ where, data })
  ]);
}

export function toSessionUser(user: { id: string; email: string; name: string; role: string; organizationId: string }, org: Organization): SessionUser {
  return {
    userId: user.id,
    orgId: user.organizationId,
    email: user.email,
    name: user.name,
    role: user.role,
    type: org.type === 'business' ? 'business' : 'agency'
  };
}

/** Builds the JSON response that signs the user in */
export async function sessionResponse(sessionUser: SessionUser, org: Organization, status = 200): Promise<NextResponse> {
  const token = await createSessionToken(sessionUser);
  if (!token) {
    return NextResponse.json({ success: false, error: 'Sunucuda AUTH_SECRET tanımlı değil' }, { status: 500 });
  }
  const res = NextResponse.json({ success: true, data: { ...sessionUser, organization: publicOrganization(org) } }, { status });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  });
  return res;
}

export function publicOrganization(org: Organization) {
  const access = accessState(org);
  const limits = limitsFor(org.plan === 'trial' ? 'growth' : org.plan);
  return {
    id: org.id,
    name: org.name,
    type: org.type,
    plan: org.plan,
    planStatus: access.status,
    billingCycle: org.billingCycle,
    daysLeft: access.daysLeft,
    endsAt: access.endsAt,
    maxClients: limits.maxClients,
    maxUsers: limits.maxUsers
  };
}
