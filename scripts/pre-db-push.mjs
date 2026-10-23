/**
 * Runs before `prisma db push` on deploys. Applies schema changes that db push would refuse without
 * --accept-data-loss (adding unique indexes to tables that already hold rows), in an idempotent way,
 * so the push that follows has nothing risky left to do. Safe to run any number of times.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const TENANT_TABLES = [
  'Client', 'Campaign', 'Product', 'AutomationRule', 'Notification',
  'IntegrationConfig', 'TeamMember', 'AgencyTask', 'AgencyContract'
];

// Old single-tenant unique indexes replaced by per-organization ones
const UNIQUE_SWAPS = [
  { table: 'Client', oldIndex: 'Client_slug_key', newIndex: 'Client_organizationId_slug_key', columns: ['organizationId', 'slug'] },
  { table: 'Product', oldIndex: 'Product_sku_key', newIndex: 'Product_organizationId_sku_key', columns: ['organizationId', 'sku'] },
  { table: 'IntegrationConfig', oldIndex: 'IntegrationConfig_provider_key', newIndex: 'IntegrationConfig_organizationId_provider_key', columns: ['organizationId', 'provider'] },
  { table: 'TeamMember', oldIndex: 'TeamMember_email_key', newIndex: 'TeamMember_organizationId_email_key', columns: ['organizationId', 'email'] }
];

async function tableExists(table) {
  const rows = await prisma.$queryRawUnsafe(
    `SELECT 1 FROM information_schema.tables WHERE table_schema = current_schema() AND table_name = $1`,
    table
  );
  return rows.length > 0;
}

async function main() {
  for (const table of TENANT_TABLES) {
    if (!(await tableExists(table))) continue; // fresh database: db push creates everything
    await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ADD COLUMN IF NOT EXISTS "organizationId" TEXT`);
  }

  for (const swap of UNIQUE_SWAPS) {
    if (!(await tableExists(swap.table))) continue;
    const cols = swap.columns.map(c => `"${c}"`).join(', ');
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "${swap.newIndex}" ON "${swap.table}"(${cols})`);
    await prisma.$executeRawUnsafe(`DROP INDEX IF EXISTS "${swap.oldIndex}"`);
  }

  console.log('pre-db-push: tenant columns and indexes are in place');
}

main()
  .catch(err => {
    console.error('pre-db-push failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
