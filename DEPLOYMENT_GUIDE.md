# 🚀 İgeAds - Vercel & Neon PostgreSQL Canlıya Alma Rehberi

İgeAds Dijital Pazarlama ve Ajans İşletim Sistemi, **Vercel** (Frontend & Serverless Edge) ve **Neon** (Serverless PostgreSQL) altyapısına %100 uyumlu, optimize edilmiş ve teste tabi tutulmuş şekilde hazırlanmıştır.

---

## 💎 Adım 1: Neon Serverless PostgreSQL Veritabanını Kurma (1 Dakika)

1. [https://console.neon.tech](https://console.neon.tech) adresine gidin (veya GitHub hesabınızla giriş yapın).
2. **"Create Project"** butonuna tıklayın:
   - **Project name:** `igeads-production`
   - **Region:** `Frankfurt (eu-central-1)` (Türkiye için en düşük gecikme süresi)
3. Oluşturulduktan sonra ekranda çıkan **Connection String**'i kopyalayın. Şuna benzer olacaktır:
   ```text
   postgresql://neondb_owner:npg_xYz123@ep-cool-mountain-a2b3c4.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```

4. Bilgisayarınızdaki proje terminalinde tek bir komutla Neon veritabanınızı oluşturup tüm başlangıç ajans verilerini (Mandalin Clean, İgeAds, Velvet Couture, kampanyalar, buybox kuralları, ekip üyeleri) yükleyin:

   ```powershell
   npm run neon:deploy -- "postgresql://neondb_owner:npg_xYz123@ep-cool-mountain-a2b3c4.eu-central-1.aws.neon.tech/neondb?sslmode=require"
   ```

   *(Tırnaklar arasına kendi Neon bağlantı adresinizi yapıştırınız)*

   > **Bu komut ne yapar?**
   > - Prisma şemasını PostgreSQL (Neon) moduna alır.
   > - Neon bulut veritabanında tüm tabloları ve yabancı anahtarları (`onDelete: Cascade`) anında oluşturur.
   > - Gerçek ajans mock ve canlı verilerini (`seed.mjs`) Neon'a yükler.

---

## ⚡ Adım 2: Vercel Üzerinde Canlıya Alma (1 Dakika)

### Seçenek A: GitHub ile Otomatik CI/CD (En Pratik ve Önerilen Yol)

1. GitHub üzerinde boş bir repo oluşturun (örn: `igeads`).
2. Terminalinizde reponuzu GitHub'a gönderin:
   ```powershell
   git remote add origin https://github.com/KULLANICI_ADINIZ/igeads.git
   git branch -M main
   git push -u origin main
   ```
3. [https://vercel.com/new](https://vercel.com/new) adresine gidin.
4. `igeads` reponuzu seçip **"Import"** butonuna tıklayın.
5. **Environment Variables** bölümüne şu 2 değişkeni ekleyin:
   - **`DATABASE_URL`**: Adım 1'de aldığınız Neon PostgreSQL bağlantı adresi.
   - **`GEMINI_API_KEY`**: `.env.local` dosyanızda yer alan mevcut Google Gemini API anahtarınız.
6. **"Deploy"** butonuna tıklayın!
   - Vercel `prisma generate` ve `next build` adımlarını otomatik tamamlayacak ve size `https://igeads.vercel.app` şeklinde canlı SSL'li bir domain verecektir.

---

### Seçenek B: Terminal Üzerinden Doğrudan Vercel CLI ile Deploy

1. Terminalde şu komutu çalıştırın:
   ```powershell
   npx vercel
   ```
2. Tarayıcıda açılan Vercel onay ekranına tıklayarak giriş yapın.
3. Proje ayarlarını varsayılan olarak onaylayın (`Y`).
4. Canlıya aktarım (Production) için:
   ```powershell
   npx vercel --prod
   ```
5. Vercel Dashboard -> Proje Ayarları -> **Environment Variables** altından `DATABASE_URL` ve `GEMINI_API_KEY` değişkenlerini ekleyip bir sonraki commit ile veya redeploy ile canlıya alınız.

---

## 🔒 Güvenlik & Notlar
- `.env.local` ve `dev.db` dosyaları `.gitignore` ile korunmaktadır, asla GitHub'a veya kamuya sızmaz.
- Neon Serverless Postgres, bağlantı havuzlama (Connection Pooling) desteği sayesinde Vercel'in anlık binlerce serverless isteğinde bile sıfır bağlantı hatası verir.
- Yerel geliştirme ortamınız (`http://localhost:3000`) kesintisiz çalışmaya devam etmektedir.
