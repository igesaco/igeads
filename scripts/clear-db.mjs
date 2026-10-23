import fs from 'fs';
import { PrismaClient } from '@prisma/client';

// Load .env.local if DATABASE_URL is not set
if (!process.env.DATABASE_URL && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  envContent.split('\n').forEach(line => {
    const [k, ...v] = line.split('=');
    if (k && v.length) {
      process.env[k.trim()] = v.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
  });
}

const prisma = new PrismaClient();

async function main() {
  // Multi-tenant safety: this wipes every account's data, so refuse once customers have signed up
  const orgCount = await prisma.organization.count();
  if (orgCount > 1 && !process.argv.includes('--force')) {
    console.error(`Veritabanında ${orgCount} müşteri hesabı var; bu komut hepsinin verisini siler. Emin iseniz --force ile çalıştırın.`);
    process.exit(1);
  }

  console.log('🗑️ Neon PostgreSQL veritabanı temizleniyor...');
  
  // Clean all records
  const deletedCampaigns = await prisma.campaign.deleteMany();
  console.log(`✓ ${deletedCampaigns.count} adet kampanya silindi.`);

  const deletedProducts = await prisma.product.deleteMany();
  console.log(`✓ ${deletedProducts.count} adet ürün silindi.`);

  const deletedTasks = await prisma.agencyTask.deleteMany();
  console.log(`✓ ${deletedTasks.count} adet ajans görevi silindi.`);

  const deletedRules = await prisma.automationRule.deleteMany();
  console.log(`✓ ${deletedRules.count} adet kural silindi.`);

  const deletedNotifications = await prisma.notification.deleteMany();
  console.log(`✓ ${deletedNotifications.count} adet bildirim silindi.`);

  const deletedClients = await prisma.client.deleteMany();
  console.log(`✓ ${deletedClients.count} adet müşteri/marka silindi.`);

  console.log('\n✨ Veritabanı sıfırlandı! Sistem kendi ajans verileriniz için 0 kilometre temiz hale getirildi.');
}

main()
  .catch((e) => {
    console.error('Hata:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
