import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PLANS } from '@/lib/plans';

/**
 * Yasal metinler. Şirket bilgileri ortam değişkenlerinden okunur (COMPANY_LEGAL_NAME, COMPANY_ADDRESS,
 * COMPANY_TAX_OFFICE, COMPANY_TAX_NO, COMPANY_EMAIL, COMPANY_PHONE, COMPANY_MERSIS_NO).
 * Bu metinler taslaktır; yayına almadan önce bir hukukçuya kontrol ettirilmelidir.
 */

function company() {
  const v = (key: string, fallback: string) => process.env[key]?.trim() || fallback;
  return {
    name: v('COMPANY_LEGAL_NAME', '[Şirket Unvanı]'),
    address: v('COMPANY_ADDRESS', '[Şirket Adresi]'),
    taxOffice: v('COMPANY_TAX_OFFICE', '[Vergi Dairesi]'),
    taxNo: v('COMPANY_TAX_NO', '[Vergi No]'),
    mersis: v('COMPANY_MERSIS_NO', '[MERSİS No]'),
    email: v('COMPANY_EMAIL', '[iletisim@alanadiniz.com]'),
    phone: v('COMPANY_PHONE', '[Telefon]')
  };
}

type Section = { heading: string; body: string[] };
type LegalPage = { title: string; sections: (c: ReturnType<typeof company>) => Section[] };

const PAGES: Record<string, LegalPage> = {
  'kullanim-kosullari': {
    title: 'Kullanım Koşulları',
    sections: c => [
      { heading: '1. Taraflar ve kapsam', body: [
        `Bu koşullar, ${c.name} ("Hizmet Sağlayıcı") tarafından sunulan İgeAds yazılım hizmetinin ("Hizmet") kullanımını düzenler. Hesap oluşturan kişi veya kurum ("Kullanıcı") bu koşulları kabul etmiş sayılır.`
      ] },
      { heading: '2. Hesap ve güvenlik', body: [
        'Kullanıcı, kayıt sırasında verdiği bilgilerin doğru olduğunu ve şifresini gizli tutacağını kabul eder. Hesap altında yapılan işlemlerden Kullanıcı sorumludur.',
        'Kullanıcı, ekip üyelerine açtığı hesaplardan ve bu hesaplarla yapılan işlemlerden de sorumludur.'
      ] },
      { heading: '3. Deneme süresi ve abonelik', body: [
        'Yeni hesaplar ücretsiz deneme süresiyle başlar. Deneme sonunda Hizmet\'i değişiklik yaparak kullanmaya devam etmek için ücretli bir paket seçilmelidir; veriler okunabilir durumda kalır.',
        'Abonelik ücretleri, seçilen dönem (aylık veya yıllık) için peşin tahsil edilir. Fiyatlar Paketler sayfasında KDV dahil olarak gösterilir.'
      ] },
      { heading: '4. Üçüncü taraf entegrasyonlar', body: [
        'Meta, Google, Trendyol, Hepsiburada, WhatsApp ve benzeri platformlara bağlantı, Kullanıcı\'nın bu platformlardan aldığı API anahtarları ile kurulur. Bu platformların kurallarına uymak ve anahtarların yetkilerini belirlemek Kullanıcı\'nın sorumluluğundadır.',
        'Hizmet üzerinden yapılan fiyat, stok, bütçe ve mesaj işlemleri Kullanıcı\'nın talimatı ile gerçekleştirilir. Üçüncü taraf platformların kesintilerinden veya kural değişikliklerinden Hizmet Sağlayıcı sorumlu değildir.'
      ] },
      { heading: '5. Yapay zeka çıktıları', body: [
        'Hizmet\'in ürettiği metin, görsel ve öneriler yardımcı niteliktedir. Yayınlanmadan önce kontrol edilmesi Kullanıcı\'nın sorumluluğundadır.'
      ] },
      { heading: '6. Yasaklı kullanım', body: [
        'Hizmet; hukuka aykırı içerik, istenmeyen toplu mesaj (spam), başkalarının hesaplarına yetkisiz erişim veya sistemin güvenliğini bozacak amaçlarla kullanılamaz. Bu durumda hesap askıya alınabilir.'
      ] },
      { heading: '7. Sorumluluğun sınırı', body: [
        'Hizmet Sağlayıcı\'nın toplam sorumluluğu, zararın doğduğu aydan önceki 12 ayda Kullanıcı\'nın ödediği abonelik bedeli ile sınırlıdır.'
      ] },
      { heading: '8. Uygulanacak hukuk', body: [
        'Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda [İl] mahkemeleri ve icra daireleri yetkilidir; tüketici sıfatına sahip Kullanıcılar için Tüketici Hakem Heyetleri ve Tüketici Mahkemeleri yetkilidir.'
      ] },
      { heading: 'İletişim', body: [`${c.name}, ${c.address}. E-posta: ${c.email}, Telefon: ${c.phone}.`] }
    ]
  },
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    sections: c => [
      { heading: 'Veri sorumlusu', body: [
        `6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca veri sorumlusu ${c.name}'dir (${c.address}, MERSİS: ${c.mersis}).`
      ] },
      { heading: 'İşlenen kişisel veriler', body: [
        'Kimlik ve iletişim verileri (ad soyad, e-posta, telefon), hesap ve işlem güvenliği verileri (şifrenin geri döndürülemez özeti, giriş zamanları, IP adresi), müşteri işlem verileri (abonelik ve ödeme kayıtları) ve Kullanıcı\'nın Hizmet\'e yüklediği iş verileri (marka, kampanya, ürün bilgileri).',
        'Kart bilgileri Hizmet Sağlayıcı tarafından saklanmaz; ödemeler lisanslı ödeme kuruluşu iyzico üzerinden alınır.'
      ] },
      { heading: 'İşleme amaçları ve hukuki sebepler', body: [
        'Sözleşmenin kurulması ve ifası (KVKK m.5/2-c), hukuki yükümlülüklerin yerine getirilmesi (m.5/2-ç), meşru menfaat kapsamında hizmet güvenliğinin sağlanması (m.5/2-f).'
      ] },
      { heading: 'Aktarım', body: [
        'Veriler; barındırma ve veritabanı hizmeti aldığımız sağlayıcılara (Vercel, Neon), ödeme kuruluşuna (iyzico), Kullanıcı\'nın bağlamayı seçtiği platformlara (Meta, Google, Trendyol, Hepsiburada) ve yapay zeka hizmeti sağlayıcısına (Google Gemini) hizmetin gerektirdiği ölçüde aktarılabilir. Bu sağlayıcıların bir kısmı yurt dışında bulunduğundan aktarım KVKK m.9 kapsamında yapılır.'
      ] },
      { heading: 'Haklarınız', body: [
        `KVKK m.11 kapsamındaki haklarınızı kullanmak için ${c.email} adresine başvurabilirsiniz. Başvurular en geç 30 gün içinde yanıtlanır.`
      ] }
    ]
  },
  'mesafeli-satis': {
    title: 'Mesafeli Hizmet Satış Sözleşmesi',
    sections: c => [
      { heading: '1. Satıcı', body: [
        `${c.name}, ${c.address}. Vergi Dairesi / No: ${c.taxOffice} / ${c.taxNo}. E-posta: ${c.email}, Telefon: ${c.phone}.`
      ] },
      { heading: '2. Konu', body: [
        'Bu sözleşme, Alıcı\'nın Hizmet Sağlayıcı\'nın internet sitesi üzerinden elektronik ortamda satın aldığı İgeAds yazılım aboneliğinin satışına ilişkin tarafların hak ve yükümlülüklerini 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca düzenler.'
      ] },
      { heading: '3. Hizmet ve bedel', body: [
        ...Object.values(PLANS).map(p => `${p.name}: aylık ${p.monthlyPrice.toLocaleString('tr-TR')} TL, yıllık ödemede aylık ${p.annualMonthlyPrice.toLocaleString('tr-TR')} TL (KDV dahil).`),
        'Bedel, ödeme sırasında seçilen dönem için peşin tahsil edilir. Hizmet, ödeme onayının ardından hemen kullanıma açılır.'
      ] },
      { heading: '4. Cayma hakkı', body: [
        'Mesafeli Sözleşmeler Yönetmeliği m.15/1-ğ uyarınca, elektronik ortamda anında ifa edilen hizmetlerde cayma hakkı kullanılamaz. Alıcı, aboneliğin ödeme onayıyla birlikte hemen başlatılmasını talep ettiğini ve bu nedenle cayma hakkının bulunmadığını kabul eder.'
      ] },
      { heading: '5. Yenileme ve iptal', body: [
        'Abonelik, dönem sonunda Alıcı yeniden ödeme yapmadıkça kendiliğinden yenilenmez. Dönem bitince hesap salt okunur moda geçer; veriler silinmez.'
      ] },
      { heading: '6. Uyuşmazlık', body: [
        'Uyuşmazlıklarda Ticaret Bakanlığınca ilan edilen parasal sınırlar dahilinde Alıcı\'nın yerleşim yerindeki Tüketici Hakem Heyetleri, aşan durumlarda Tüketici Mahkemeleri yetkilidir.'
      ] }
    ]
  },
  iade: {
    title: 'İptal ve İade Politikası',
    sections: c => [
      { heading: 'İptal', body: [
        'Aboneliğiniz otomatik olarak yenilenmez; dönem sonunda yeniden ödeme yapmadığınızda kendiliğinden sona erer. Ayrıca bir iptal işlemi gerekmez.'
      ] },
      { heading: 'İade', body: [
        'Dijital hizmet ödeme anında kullanıma açıldığından kullanılmış dönemler için iade yapılmaz. Hizmet Sağlayıcı kaynaklı, 72 saati aşan kesintilerde kesinti süresine denk gelen tutar iade edilir veya süre uzatılır.',
        `Hatalı veya mükerrer çekimlerde ${c.email} adresine yazmanız halinde tutar 14 gün içinde ödemenin yapıldığı karta iade edilir.`
      ] }
    ]
  }
};

export async function generateMetadata({ params }: { params: Promise<{ sayfa: string }> }): Promise<Metadata> {
  const { sayfa } = await params;
  return { title: PAGES[sayfa] ? `${PAGES[sayfa].title} | İgeAds` : 'İgeAds' };
}

export default async function LegalPageView({ params }: { params: Promise<{ sayfa: string }> }) {
  const { sayfa } = await params;
  const page = PAGES[sayfa];
  if (!page) notFound();
  const c = company();

  return (
    <main className="min-h-screen bg-[#080B11] text-slate-200 px-6 py-12">
      <article className="max-w-3xl mx-auto space-y-6">
        <a href="/" className="text-xs text-indigo-400 hover:underline">← İgeAds</a>
        <h1 className="text-2xl font-black text-white">{page.title}</h1>
        {page.sections(c).map(section => (
          <section key={section.heading} className="space-y-2">
            <h2 className="text-sm font-bold text-white">{section.heading}</h2>
            {section.body.map((p, i) => <p key={i} className="text-sm leading-relaxed text-slate-300">{p}</p>)}
          </section>
        ))}
        <nav className="pt-6 border-t border-white/10 flex flex-wrap gap-4 text-xs text-slate-400">
          {Object.entries(PAGES).map(([slug, p]) => (
            <a key={slug} href={`/yasal/${slug}`} className="hover:text-white">{p.title}</a>
          ))}
        </nav>
      </article>
    </main>
  );
}
