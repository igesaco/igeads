#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️ Neon PostgreSQL veritabanı temizleniyor...');
  
  // Clean all records
  const deletedCampaigns = await prisma.campaign.deleteMany();
  console.log(`✓ ${deletedCampaigns.count} adet kampanya silindi.`);

  const deletedProducts = await prisma.product.deleteMany();
  console.log(`✓ ${deletedProducts.count} adet ürün silindi.`);

  const deletedTasks = await prisma.agencyTask.deleteMany();
  console.log(`✓ ${deletedTasks.count} adet ajans görevi silindi.`);

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
