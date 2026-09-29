import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'İgeAds | All-in-One Autonomous E-Commerce & Ads Growth SaaS',
  description: 'Meta, Google, TikTok, ChatGPT Ads ve Pazaryeri Entegrasyonlu Otonom Büyüme Platformu',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="dark">
      <body className="min-h-screen bg-[#080B11] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
