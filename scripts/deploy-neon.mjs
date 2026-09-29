#!/usr/bin/env node
/**
 * deploy-neon.mjs
 * Script to deploy İgeAds schema and seed data directly to Neon Serverless PostgreSQL.
 *
 * Usage:
 *   node scripts/deploy-neon.mjs "postgresql://user:pass@ep-xxxx.neon.tech/neondb?sslmode=require"
 *   OR set DATABASE_URL environment variable and run:
 *   npm run neon:push
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const inputUrl = process.argv[2] || process.env.DATABASE_URL;

console.log('====================================================');
console.log('🚀 İgeAds -> Neon Serverless PostgreSQL Deployer');
console.log('====================================================');

if (!inputUrl || (!inputUrl.startsWith('postgres://') && !inputUrl.startsWith('postgresql://'))) {
  console.error('\n❌ Hata: Geçerli bir PostgreSQL connection string sağlanmadı!');
  console.log('\nKullanım:');
  console.log('  node scripts/deploy-neon.mjs "postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require"');
  console.log('  veya');
  console.log('  DATABASE_URL="postgresql://..." npm run neon:push\n');
  process.exit(1);
}

// Mask URL for display
const maskedUrl = inputUrl.replace(/:([^:@]+)@/, ':****@');
console.log(`\n🔗 Bağlantı Hedefi: ${maskedUrl}`);

try {
  // 1. Prepare schema.prisma with postgresql provider
  console.log('\n[1/4] Prisma şeması PostgreSQL (Neon) için hazırlanıyor...');
  const postgresSchemaPath = path.join(rootDir, 'prisma', 'schema.postgresql.prisma');
  const mainSchemaPath = path.join(rootDir, 'prisma', 'schema.prisma');
  
  if (fs.existsSync(postgresSchemaPath)) {
    fs.copyFileSync(postgresSchemaPath, mainSchemaPath);
    console.log('   ✓ schema.prisma -> provider: postgresql olarak güncellendi.');
  }

  // 2. Generate Prisma client for postgresql
  console.log('\n[2/4] Prisma Client üretiliyor...');
  execSync('npx prisma generate', {
    cwd: rootDir,
    env: { ...process.env, DATABASE_URL: inputUrl },
    stdio: 'inherit',
  });
  console.log('   ✓ Prisma Client PostgreSQL için başarıyla üretildi.');

  // 3. Push schema to Neon PostgreSQL
  console.log('\n[3/4] Tablolar Neon PostgreSQL sunucusuna aktarılıyor (prisma db push)...');
  execSync('npx prisma db push --accept-data-loss', {
    cwd: rootDir,
    env: { ...process.env, DATABASE_URL: inputUrl },
    stdio: 'inherit',
  });
  console.log('   ✓ Tüm tablolar, ilişkiler ve indeksler Neon PostgreSQL veritabanında oluşturuldu.');

  // 4. Seed database
  console.log('\n[4/4] Başlangıç ajans verileri, müşteriler ve kampanyalar yükleniyor (seed)...');
  execSync('node prisma/seed.mjs', {
    cwd: rootDir,
    env: { ...process.env, DATABASE_URL: inputUrl },
    stdio: 'inherit',
  });
  console.log('   ✓ Seed işlemi başarıyla tamamlandı!');

  console.log('\n====================================================');
  console.log('🎉 TEBRİKLER! İgeAds Neon PostgreSQL Canlıya Alındı!');
  console.log('====================================================');
  console.log('\nŞimdi Vercel Deploy adımına geçebilirsiniz:');
  console.log('1. Vercel Dashboard -> Environment Variables:');
  console.log('   - DATABASE_URL = ' + maskedUrl);
  console.log('   - GEMINI_API_KEY = ' + (process.env.GEMINI_API_KEY ? '••••••••' : '(mevcut key)'));
  console.log('2. Vercel üzerinde Deploy butonuna basınız veya npx vercel ile deploy ediniz.\n');

} catch (err) {
  console.error('\n❌ Dağıtım sırasında hata oluştu:', err.message);
  process.exit(1);
}
