'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Palette, 
  Sparkles, 
  Download, 
  Layers, 
  Smartphone, 
  Monitor, 
  Image as ImageIcon,
  Zap,
  Sliders,
  Send,
  CheckCircle2,
  Camera,
  RefreshCw,
  Wand2,
  Eye,
  SlidersHorizontal,
  Flame,
  Check,
  Upload
} from 'lucide-react';

interface CreativeStudioHubProps {
  activeClientName?: string;
}

interface GeneratedImageItem {
  id: string;
  url: string;
  prompt: string;
  style: string;
  timestamp: string;
  isBase64?: boolean;
}

export default function CreativeStudioHub({ activeClientName = '' }: CreativeStudioHubProps) {
  const [customProductTitle, setCustomProductTitle] = useState('Yeni Hizmet / Ürün');
  const [adFormat, setAdFormat] = useState<'story' | 'feed' | 'banner'>('story');
  const [themeStyle, setThemeStyle] = useState<'luxury_dark' | 'neon_cyber' | 'minimalist_clean'>('minimalist_clean');
  const [headline, setHeadline] = useState('Koltuklarınızda Fabrika Çıkışı Temizliği');
  const [subheading, setSubheading] = useState('Alman teknolojisi derin vakum ve antialerjik solüsyonlarla evinizde otel ferahlığı.');
  const [ctaText, setCtaText] = useState('Hemen Randevu Al / Fiyat Öğren');
  const [badgeText, setBadgeText] = useState('AYNI GÜN HİZMET');
  const [offerBadge, setOfferBadge] = useState('Koltuk Başı Hizmet: ₺499');
  
  // AI Text & Workflow states
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);
  const [aiHooks, setAiHooks] = useState<string[]>([
    'Bize bu koltuğu çöpe atılacak diye verdiler, ama...',
    'Hafta sonunuzu temizlikle heba etmekten yorulmadınız mı?',
    'Evinize temizlik ekibi çağırmadan önce bu 3 kuralı bilin!'
  ]);

  // Real Image Generation states
  const [activeImageUrl, setActiveImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&auto=format&fit=crop&q=85'
  );
  const [imagePrompt, setImagePrompt] = useState<string>('Lüks salonda profesyonel buharlı koltuk yıkama, tertemiz parlak kumaş dokusu, 8K stüdyo ışığı');
  const [photoStyle, setPhotoStyle] = useState<'studio' | 'lifestyle' | 'luxury' | 'minimal' | 'cyber'>('studio');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingFullCreative, setIsGeneratingFullCreative] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [lastEnhancedPrompt, setLastEnhancedPrompt] = useState<string | null>(null);
  const [imageGallery, setImageGallery] = useState<GeneratedImageItem[]>([
    {
      id: 'default-1',
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&auto=format&fit=crop&q=85',
      prompt: 'Lüks salonda buharlı koltuk temizliği (Zümrüt Yeşili Koltuk)',
      style: 'studio',
      timestamp: 'Stüdyo 4K'
    },
    {
      id: 'default-2',
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&auto=format&fit=crop&q=85',
      prompt: 'Modern berjer temizliği ve kumaş bakımı',
      style: 'studio',
      timestamp: 'Detay 4K'
    },
    {
      id: 'default-3',
      url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1400&auto=format&fit=crop&q=85',
      prompt: 'Ferah rezidans oturma odası hijyeni',
      style: 'lifestyle',
      timestamp: 'Lifestyle 4K'
    }
  ]);

  // Sync presets when activeClientName changes
  useEffect(() => {
    if (!activeClientName || activeClientName === 'Tüm Müşteriler') {
      setCustomProductTitle('Mandalin Clean Temizlik');
      setHeadline('Koltuklarınızda Fabrika Çıkışı Hijyen');
      setSubheading('Alman teknolojisi derin vakum ve antialerjik solüsyonlarla evinizde ferahlık.');
      setCtaText('Hemen Fiyat Al / Randevu Oluştur');
      setBadgeText('AYNI GÜN HİZMET');
      setOfferBadge('Koltuk Başı Hizmet: ₺499');
      setImagePrompt('Lüks salonda profesyonel buharlı koltuk yıkama hizmeti, tertemiz kumaş, 8k stüdyo çekimi');
      setAiHooks([
        'Bize bu koltuğu asla temizlenmez diye getirdiler, ama...',
        'Hafta sonunuzu saatlerce temizlikle heba etmekten yorulmadınız mı?',
        'Evinize temizlik ekibi çağırmadan önce bu 3 kritik kuralı bilin!'
      ]);
      return;
    }

    const lower = activeClientName.toLowerCase();
    setCustomProductTitle(activeClientName);

    if (lower.includes('mandalin') || lower.includes('temizlik') || lower.includes('koltuk')) {
      setHeadline('Koltuklarınızda Fabrika Çıkışı Hijyen');
      setSubheading('Alman teknolojisi derin vakum ve antialerjik solüsyonlarla evinizde ferahlık.');
      setCtaText('Hemen Fiyat Al / Randevu Oluştur');
      setBadgeText('AYNI GÜN HİZMET');
      setOfferBadge('Koltuk Başı Hizmet: ₺499');
      setImagePrompt('Professional upholstery steam cleaning on luxury sofa, modern living room, spotless clean, commercial advertising 8k photography');
      setAiHooks([
        'Bize bu koltuğu asla temizlenmez diye getirdiler, ama...',
        'Hafta sonunuzu temizlikle heba etmekten yorulmadınız mı?',
        'Evinize temizlik ekibi çağırmadan önce bu 3 kuralı bilin!'
      ]);
    } else if (lower.includes('velvet') || lower.includes('couture') || lower.includes('giyim') || lower.includes('ceket')) {
      setHeadline('Zarafet ve Kusursuz İşçilik: 2026 Koleksiyonu');
      setSubheading('Özel kalıp ve premium kumaş işçiliğiyle tarzınıza prestij katın. Sınırlı stok.');
      setCtaText('Koleksiyonu Keşfet / Sipariş Ver');
      setBadgeText('ÖZEL KOLEKSİYON');
      setOfferBadge('%30 Lansman İndirimi');
      setImagePrompt('High fashion editorial shoot of luxury bespoke designer jacket on elegant model, Milan fashion week street, dramatic golden hour 8k');
      setAiHooks([
        'Sıradan kıyafetlerin ilk yıkamada formunu kaybetmesinden bıktınız mı?',
        'Gardırobunuzun en şık parçası olacak özel tasarım ceketler sınırlı stokla satışta!',
        'POV: Giydiğin anda ortamdaki tüm bakışların sana döndüğü o özel tasarım...'
      ]);
    } else if (lower.includes('ige') || lower.includes('ads') || lower.includes('pazarlama')) {
      setHeadline('Reklam Bütçenizi İsraftan Kurtarın: 2 Hafta ROAS');
      setSubheading('Canlı POAS takibi ve otonom bütçe kaydırma ile reklam harcamanızı net kâra dönüştürün.');
      setCtaText('Ücretsiz Büyüme Analizi Başlat');
      setBadgeText('YAPAY ZEKA MOTORU');
      setOfferBadge('Garanti Kâr Optimizasyonu');
      setImagePrompt('Modern futuristic autonomous marketing analytics command center, glowing holographic graphs, high-tech dark studio, 8k render');
      setAiHooks([
        'Meta ve Google Ads bütçenizi tüketip sıfır dönüşüm almaktan sıkılmadınız mı?',
        'ROAS oranınızı 2 haftada 2 katına çıkaracak yapay zeka reklam stratejisi!',
        'E-ticaret markaları 2026\'da neden manuel reklamı bırakıp otonom sisteme geçiyor?'
      ]);
    } else {
      setHeadline(`${activeClientName} İle Farkı Yaşayın`);
      setSubheading(`${activeClientName} kalitesi ve avantajlı teklifleriyle tanışın.`);
      setCtaText('Hemen İncele / Keşfet');
      setBadgeText('GÜNCEL FIRSAT');
      setOfferBadge('Özel Kampanya');
      setImagePrompt(`Commercial advertising studio photography of ${activeClientName} premium product, ultra sharp details, 8k resolution`);
      setAiHooks([
        `${activeClientName} arayışında olanların %90'ının yaptığı o büyük hata...`,
        'İşte sektörün sır gibi sakladığı o yenilikçi yöntem!',
        'En yüksek kalite ve güveni arıyorsanız tanışma zamanınız geldi.'
      ]);
    }
  }, [activeClientName]);

  // Sync aspect ratio with format
  const getAspectRatioString = () => {
    if (adFormat === 'story') return '9:16';
    if (adFormat === 'feed') return '1:1';
    return '16:9';
  };

  // Generate real AI Photo via our /api/generate-image endpoint
  const handleGenerateAIPhoto = async (customP?: string) => {
    setIsGeneratingImage(true);
    try {
      const activePrompt = customP || imagePrompt || customProductTitle;
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          productName: customProductTitle,
          style: photoStyle,
          aspectRatio: getAspectRatioString(),
          clientName: activeClientName,
          seed: Math.floor(Math.random() * 999999)
        })
      });

      const json = await res.json();
      if (json.success && json.imageUrl) {
        setActiveImageUrl(json.imageUrl);
        setLastEnhancedPrompt(json.enhancedPrompt || null);

        // Add to history gallery
        const newItem: GeneratedImageItem = {
          id: `gen-${Date.now()}`,
          url: json.imageUrl,
          prompt: activePrompt,
          style: photoStyle,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBase64: json.isBase64
        };
        setImageGallery(prev => [newItem, ...prev.slice(0, 7)]);
      }
    } catch (err) {
      console.error('Image generation failed:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  // Generate Text Copy & Hooks via Gemini
  const handleGenerateAICopy = async () => {
    setIsGeneratingAI(true);
    try {
      const activeTitle = customProductTitle.trim() || 'Yeni Kampanya & Ürün';
      const res = await fetch('/api/creative-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: activeTitle,
          platform: adFormat === 'story' ? 'Instagram Story (9:16) & TikTok' : adFormat === 'feed' ? 'Instagram Feed (1:1)' : 'Google Display Banner',
          tone: themeStyle === 'luxury_dark' ? 'Prestige & Lüks' : themeStyle === 'neon_cyber' ? 'Genç & Enerjik' : 'Minimalist & Doğal'
        })
      });
      const json = await res.json();
      if (json?.data) {
        if (json.data.headline) setHeadline(json.data.headline);
        if (json.data.primaryText) setSubheading(json.data.primaryText);
        if (json.data.cta) setCtaText(json.data.cta);
        if (Array.isArray(json.data.hooks)) setAiHooks(json.data.hooks);
      }
    } catch (e) {
      console.error('AI creative generation failed:', e);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Full-suite Generation: Photo + Copy in Parallel
  const handleGenerateFullCreative = async () => {
    setIsGeneratingFullCreative(true);
    try {
      await Promise.all([
        handleGenerateAICopy(),
        handleGenerateAIPhoto()
      ]);
    } finally {
      setIsGeneratingFullCreative(false);
    }
  };

  // Dispatch to Agency Workflow
  const handleDispatchToAgencyWorkflow = async () => {
    setIsDispatching(true);
    try {
      const titleLower = customProductTitle.toLowerCase();
      let clientSlug = 'mandalinclean';
      let clientName = 'Mandalin Clean';

      if (titleLower.includes('velvet') || titleLower.includes('ceket')) {
        clientSlug = 'velvetcouture';
        clientName = 'Velvet Couture';
      } else if (titleLower.includes('ige') || titleLower.includes('ajans') || titleLower.includes('pazarlama') || titleLower.includes('roas')) {
        clientSlug = 'igesaturkiye';
        clientName = 'İgeAds / igesaturkiye';
      }

      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${clientName}: ${headline}`,
          description: `Format: ${adFormat.toUpperCase()} | Stil: ${photoStyle}\nMetin: ${subheading}\nCTA: ${ctaText}\nGörsel URL: ${activeImageUrl.substring(0, 100)}...`,
          clientSlug,
          clientName,
          assignedTo: 'Cansu Demir (Kreatif & Metin Yazarı)',
          stage: 'review',
          priority: 'high',
          creativeHook: headline,
          channel: adFormat === 'story' ? 'reels' : 'meta'
        })
      });

      const json = await res.json();
      if (json.success) {
        setDispatchSuccessMsg(`"${headline}" kurgusu ve üretilen fotoğraf ${clientName} Müşteri Onay Masasına iletildi!`);
        setTimeout(() => setDispatchSuccessMsg(null), 4500);
      }
    } catch (e) {
      console.error('Dispatch failed:', e);
    } finally {
      setIsDispatching(false);
    }
  };

  // Real Canvas Renderer & File Downloader (4K / High Res)
  const handleDownloadMockup = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      const width = adFormat === 'story' ? 1080 : adFormat === 'feed' ? 1080 : 1920;
      const height = adFormat === 'story' ? 1920 : adFormat === 'feed' ? 1080 : 1080;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw Background Image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = activeImageUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve; // Continue if error
      });

      if (img.width && img.height) {
        const scale = Math.max(width / img.width, height / img.height);
        const x = (width - img.width * scale) / 2;
        const y = (height - img.height * scale) / 2;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Draw Gradient Overlays for High Legibility
      const bottomGrad = ctx.createLinearGradient(0, height * 0.35, 0, height);
      bottomGrad.addColorStop(0, 'rgba(8, 11, 17, 0)');
      bottomGrad.addColorStop(0.4, 'rgba(8, 11, 17, 0.7)');
      bottomGrad.addColorStop(1, 'rgba(8, 11, 17, 0.96)');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, 0, width, height);

      // Top bar gradient
      const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.2);
      topGrad.addColorStop(0, 'rgba(8, 11, 17, 0.85)');
      topGrad.addColorStop(1, 'rgba(8, 11, 17, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, width, height * 0.2);

      // 3. Top Brand & Badge
      const pad = width * 0.06;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(customProductTitle.toUpperCase(), pad, pad + 35);

      // Right top badge
      ctx.font = 'bold 24px sans-serif';
      const badgeWidth = ctx.measureText(badgeText).width + 36;
      ctx.fillStyle = 'rgba(147, 51, 234, 0.8)';
      ctx.beginPath();
      ctx.roundRect(width - pad - badgeWidth, pad, badgeWidth, 48, 24);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, width - pad - (badgeWidth / 2), pad + 33);

      // 4. Offer Pill
      let bottomY = height - pad - 20;
      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.textAlign = 'center';
      ctx.fillText('Aynı Gün Hizmet • Memnuniyet Garantisi • İgeAds AI Creative', width / 2, bottomY);
      bottomY -= 60;

      // 5. CTA Button
      const btnHeight = 90;
      const btnWidth = width - (pad * 2);
      const btnX = pad;
      const btnY = bottomY - btnHeight;

      const btnGrad = ctx.createLinearGradient(btnX, 0, btnX + btnWidth, 0);
      btnGrad.addColorStop(0, '#6366f1');
      btnGrad.addColorStop(0.5, '#a855f7');
      btnGrad.addColorStop(1, '#06b6d4');
      ctx.fillStyle = btnGrad;
      ctx.beginPath();
      ctx.roundRect(btnX, btnY, btnWidth, btnHeight, 26);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ctaText, width / 2, btnY + 58);
      bottomY = btnY - 45;

      // 6. Subheading Text (Word wrapped)
      ctx.font = 'normal 30px sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.textAlign = 'left';
      const wrapText = (text: string, maxWidth: number) => {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = words[0] || '';
        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + ' ' + words[i];
          if (ctx.measureText(testLine).width < maxWidth) {
            currentLine = testLine;
          } else {
            lines.push(currentLine);
            currentLine = words[i];
          }
        }
        lines.push(currentLine);
        return lines;
      };

      const subLines = wrapText(subheading, width - (pad * 2)).slice(0, 2);
      for (let i = subLines.length - 1; i >= 0; i--) {
        ctx.fillText(subLines[i], pad, bottomY);
        bottomY -= 42;
      }
      bottomY -= 15;

      // 7. Headline Text (Bold, Larger)
      ctx.font = '900 48px sans-serif';
      ctx.fillStyle = '#ffffff';
      const headLines = wrapText(headline, width - (pad * 2)).slice(0, 3);
      for (let i = headLines.length - 1; i >= 0; i--) {
        ctx.fillText(headLines[i], pad, bottomY);
        bottomY -= 62;
      }

      // 8. Offer Pill above headline
      if (offerBadge) {
        bottomY -= 10;
        ctx.font = 'bold 26px sans-serif';
        const offerWidth = ctx.measureText(offerBadge).width + 36;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(pad, bottomY - 38, offerWidth, 48, 12);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#34d399';
        ctx.textAlign = 'left';
        ctx.fillText(offerBadge, pad + 18, bottomY - 4);
      }

      // 9. Trigger real file download
      const link = document.createElement('a');
      link.download = `igeads-${customProductTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${adFormat}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error('Mockup render failed:', e);
    } finally {
      setIsExporting(false);
    }
  };

  // Direct Raw Photo Downloader (Forces direct file download, NEVER opens external tabs)
  const handleDownloadRawPhoto = async () => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = activeImageUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
        img.onerror = resolve;
      });

      if (img.width && img.height) {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
        const link = document.createElement('a');
        link.download = `igeads-urun-fotografi-${Date.now()}.jpg`;
        link.href = dataUrl;
        link.click();
        return;
      }
    } catch (e) {
      console.warn('Canvas raw photo download fallback:', e);
    }

    try {
      const res = await fetch(activeImageUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `igeads-urun-fotografi-${Date.now()}.jpg`;
      link.href = blobUrl;
      link.click();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
    } catch {
      const link = document.createElement('a');
      link.download = `igeads-urun-fotografi-${Date.now()}.jpg`;
      link.href = activeImageUrl;
      link.click();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Camera className="w-3 h-3 text-cyan-400" />
              SOTA AI FOTOĞRAF & REKLAM FABRİKASI
            </span>
            <span className="text-xs text-slate-400">| FLUX.1 & Gemini Prompt Engine ile Gerçek Fotoğraf Üretimi</span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-400" />
            <span>AI Fotoğraf Stüdyosu & Reklam Mockup Atölyesi</span>
          </h1>
          <p className="text-xs text-slate-400">
            Ürününüz veya hizmetiniz için sıfırdan ultra gerçekçi ticari reklam fotoğrafları üretin, Instagram Story (9:16), Feed (1:1) ve Banner mockup&apos;larını tek tıkla 4K PNG olarak indirin.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Master 1-Click Button */}
          <button
            onClick={handleGenerateFullCreative}
            disabled={isGeneratingFullCreative || isGeneratingImage || isGeneratingAI}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-purple-600/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isGeneratingFullCreative ? 'animate-spin' : ''}`} />
            <span>{isGeneratingFullCreative ? 'Tüm Kreatif Üretiliyor...' : '✨ Tek Tıkla Tam Kampanya (Metin + Fotoğraf)'}</span>
          </button>

          <button 
            onClick={handleDispatchToAgencyWorkflow}
            disabled={isDispatching}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-xs font-bold text-white shadow-md shadow-cyan-600/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Send className={`w-3.5 h-3.5 ${isDispatching ? 'animate-spin' : ''}`} />
            <span>{isDispatching ? 'İletiliyor...' : '📋 Müşteri Onayına Gönder'}</span>
          </button>

          <button 
            onClick={handleDownloadMockup}
            disabled={isExporting}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-md shadow-emerald-600/25 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-spin' : ''}`} />
            <span>{isExporting ? 'Mockup Hazırlanıyor...' : 'Mockup&apos;ı İndir (4K PNG)'}</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {dispatchSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{dispatchSuccessMsg}</span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Creative Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* SECTION 1: REAL AI PHOTO GENERATOR */}
          <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#101726]/80 to-[#0b0f19]/90 space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>1. Yapay Zeka Fotoğraf Üretim Motoru</span>
              </h2>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                4K Stüdyo & AI
              </span>
            </div>

            {/* Photo Prompt Input & Actions */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs text-slate-300 font-semibold flex items-center gap-1">
                  <span>Fotoğraf Açıklaması / Konsepti:</span>
                </label>
                <div className="flex items-center gap-2">
                  <label className="text-[10px] text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3 h-3" />
                    <span>Fotoğraf Yükle</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const b64 = event.target?.result as string;
                            if (b64) {
                              setActiveImageUrl(b64);
                              setImageGallery(prev => [{
                                id: `upload-${Date.now()}`,
                                url: b64,
                                prompt: file.name,
                                style: 'Özel Yükleme',
                                timestamp: 'Yüklendi',
                                isBase64: true
                              }, ...prev]);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <span className="text-slate-600">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      const preset = customProductTitle.toLowerCase().includes('koltuk') || customProductTitle.toLowerCase().includes('temizlik')
                        ? 'Lüks geniş salonda buharlı profesyonel koltuk yıkama, pırıl pırıl temiz kumaş, 8k stüdyo çekimi'
                        : customProductTitle.toLowerCase().includes('ceket') || customProductTitle.toLowerCase().includes('giyim')
                        ? 'İtalyan tasarım lüks deri ceket, şık manken üzerinde Milano sokak çekimi, sinematik ışık, 8k'
                        : `Ultra-realistic commercial product photography of ${customProductTitle}, luxury studio lighting, 8k`;
                      setImagePrompt(preset);
                    }}
                    className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                  >
                    Şablon Doldur
                  </button>
                </div>
              </div>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                rows={3}
                placeholder="Örn: Lüks oturma odasında buharlı koltuk yıkama, tertemiz kumaş dokusu, 8K reklam stüdyosu çekimi..."
                className="w-full bg-[#121826] border border-[#1f293d] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium resize-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                İster Türkçe ister İngilizce yazın; Gemini motoru promptu FLUX için otomatik optimize eder.
              </p>
            </div>

            {/* Photo Style Selection */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">Fotoğraf Çekim Tarzı:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'studio', label: '📸 Stüdyo Reklamı', desc: 'Ticari & 85mm Lens' },
                  { id: 'lifestyle', label: '🌿 Doğal Yaşam', desc: 'Sıcak & Yaşam Alanı' },
                  { id: 'luxury', label: '💎 Lüks & Prestij', desc: 'Karanlık & Altın Işık' },
                  { id: 'minimal', label: '🤍 Minimal E-Ticaret', desc: 'Sade & Pastel Fon' },
                  { id: 'cyber', label: '⚡ Siber & Neon', desc: 'Fütüristik & Canlı' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setPhotoStyle(s.id as any)}
                    className={`p-2 rounded-xl border text-left cursor-pointer transition-all ${
                      photoStyle === s.id
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md shadow-cyan-500/20'
                        : 'bg-[#121826] border-[#1f293d] text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="block text-[11px] font-bold">{s.label}</span>
                    <span className="block text-[9px] text-slate-400">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Generation Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleGenerateAIPhoto()}
                disabled={isGeneratingImage}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 via-teal-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Camera className={`w-4 h-4 ${isGeneratingImage ? 'animate-spin' : ''}`} />
                <span>{isGeneratingImage ? 'Fotoğraf Üretiliyor (FLUX)...' : '📸 Gerçek Fotoğrafı Üret'}</span>
              </button>

              <button
                type="button"
                title="Farklı varyasyon üret"
                onClick={() => handleGenerateAIPhoto()}
                disabled={isGeneratingImage}
                className="p-2.5 rounded-xl bg-[#141b2a] border border-[#232e44] hover:border-cyan-500 text-slate-300 hover:text-white cursor-pointer disabled:opacity-50 transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isGeneratingImage ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Last Enhanced Prompt Accordion/Badge */}
            {lastEnhancedPrompt && (
              <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-[10px] text-slate-300 leading-snug">
                <span className="font-bold text-cyan-300 block mb-0.5">🔍 Gemini Optimize Ettiği Kamera Promptu:</span>
                <span className="text-slate-400 italic font-mono">{lastEnhancedPrompt}</span>
              </div>
            )}
          </div>

          {/* SECTION 2: AD COPY & HOOK ENGINE */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                <span>2. Reklam Metinleri, Kancalar & Başlıklar</span>
              </h2>
              <button
                type="button"
                onClick={handleGenerateAICopy}
                disabled={isGeneratingAI}
                className="text-[11px] font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                <span>{isGeneratingAI ? 'Yazılıyor...' : 'Yapay Zeka İle Yaz'}</span>
              </button>
            </div>

            {/* Product / Service Input */}
            <div>
              <label className="text-xs text-slate-300 block mb-1 font-semibold">Hedef Ürün veya Hizmet Adı:</label>
              <input
                type="text"
                value={customProductTitle}
                onChange={(e) => setCustomProductTitle(e.target.value)}
                placeholder="Örn: Mandalin Clean Koltuk Yıkama, Kaşmir Mont..."
                className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
              />
            </div>

            {/* Format selector */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5 font-medium">Reklam & Görsel Boyutu:</label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setAdFormat('story')}
                  className={`p-2 rounded-xl border font-bold text-[11px] flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    adFormat === 'story' ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-[#121826] border-[#1f293d] text-slate-400'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Story (9:16)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdFormat('feed')}
                  className={`p-2 rounded-xl border font-bold text-[11px] flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    adFormat === 'feed' ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-[#121826] border-[#1f293d] text-slate-400'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Feed (1:1)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdFormat('banner')}
                  className={`p-2 rounded-xl border font-bold text-[11px] flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    adFormat === 'banner' ? 'bg-purple-600/30 border-purple-500 text-white' : 'bg-[#121826] border-[#1f293d] text-slate-400'
                  }`}
                >
                  <Monitor className="w-4 h-4" />
                  <span>Banner (16:9)</span>
                </button>
              </div>
            </div>

            {/* AI Suggested Hooks */}
            {aiHooks.length > 0 && (
              <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/25 space-y-2">
                <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block">
                  ⚡ Önerilen Kancalar (Tıklayarak Başlığa Aktar):
                </span>
                <div className="space-y-1.5">
                  {aiHooks.map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setHeadline(h)}
                      className="w-full text-left p-2 rounded-lg bg-[#141b2a] hover:bg-purple-900/40 text-slate-200 hover:text-white text-[11px] border border-purple-500/20 hover:border-purple-400 transition-all flex items-start gap-1.5 cursor-pointer"
                    >
                      <span className="text-purple-400 font-bold shrink-0">{i + 1}.</span>
                      <span className="leading-snug">{h}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Headline input */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">Ana Başlık (Viral Hook):</label>
              <input 
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Subheading */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-medium">Açıklama (Değer Teklifi):</label>
              <textarea 
                rows={2}
                value={subheading}
                onChange={(e) => setSubheading(e.target.value)}
                className="w-full bg-[#121826] border border-[#1f293d] rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500 resize-none leading-relaxed"
              />
            </div>

            {/* CTA, Badge & Offer */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Buton Yazısı (CTA):</label>
                <input 
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1 font-medium">Fiyat / Teklif Rozeti:</label>
                <input 
                  type="text"
                  value={offerBadge}
                  onChange={(e) => setOfferBadge(e.target.value)}
                  className="w-full bg-[#121826] border border-[#1f293d] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Visual Canvas Mockup & Photo Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden border border-slate-800">
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Canlı Reklam Önizleme ({adFormat.toUpperCase()})</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Canlı Fotoğraf Entegre
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadRawPhoto}
                  className="px-2.5 py-1 rounded-lg bg-[#141b2a] hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300 hover:text-white transition-all flex items-center gap-1 cursor-pointer"
                  title="Yalnızca üretilen saf fotoğrafı indir"
                >
                  <Camera className="w-3 h-3 text-cyan-400" />
                  <span>Saf Fotoğrafı İndir</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadMockup}
                  disabled={isExporting}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-[11px] text-emerald-300 font-bold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-3 h-3 text-emerald-400" />
                  <span>{isExporting ? 'İndiriliyor...' : 'Mockup İndir'}</span>
                </button>
              </div>
            </div>

            {/* THE CANVAS FRAME */}
            <div className={`transition-all duration-300 rounded-3xl overflow-hidden relative shadow-2xl border ${
              adFormat === 'story' ? 'w-80 h-[560px]' :
              adFormat === 'feed' ? 'w-96 h-96' : 'w-full max-w-xl h-80'
            } ${
              themeStyle === 'luxury_dark' ? 'bg-[#0a0d14] border-slate-800' :
              themeStyle === 'neon_cyber' ? 'bg-[#08051a] border-purple-500/40 ring-2 ring-purple-500/20' :
              'bg-slate-900 border-slate-700'
            }`}>
              
              {/* Background Product Image */}
              <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={activeImageUrl} 
                  alt="Creative Generated Photography" 
                  className={`w-full h-full object-cover transition-opacity duration-500 ${isGeneratingImage ? 'opacity-40 filter blur-sm' : 'opacity-100'}`}
                />
                
                {/* Visual dark gradient overlay to ensure crystal clear typography readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-[#080B11]/60 to-transparent"></div>
                <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#080B11]/70 to-transparent"></div>

                {/* Loading state spinner over image */}
                {isGeneratingImage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20 space-y-2">
                    <Camera className="w-8 h-8 text-cyan-400 animate-spin" />
                    <span className="text-xs font-bold text-white tracking-wide">Yapay Zeka Fotoğrafı Çekiyor...</span>
                    <span className="text-[10px] text-slate-300">FLUX.1 8K stüdyo renderlanıyor</span>
                  </div>
                )}
              </div>

              {/* Content Overlay */}
              <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                
                {/* Top Bar: Brand & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
                      {customProductTitle.charAt(0) || 'A'}
                    </div>
                    <span className="text-xs font-black tracking-wide text-white uppercase drop-shadow-md">
                      {customProductTitle}
                    </span>
                  </div>

                  <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-full bg-purple-500/40 text-purple-200 border border-purple-500/50 uppercase tracking-wider shadow-sm">
                    {badgeText}
                  </span>
                </div>

                {/* Center / Bottom Info */}
                <div className="space-y-2.5 mt-auto">
                  
                  {/* Offer badge */}
                  {offerBadge && (
                    <div className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 text-[10px] font-bold shadow-md">
                      {offerBadge}
                    </div>
                  )}

                  {/* Headline */}
                  <h3 className="text-base font-black text-white leading-snug drop-shadow-lg line-clamp-3">
                    {headline}
                  </h3>

                  {/* Subheading */}
                  <p className="text-[11px] text-slate-200 line-clamp-2 leading-relaxed drop-shadow-md">
                    {subheading}
                  </p>

                  {/* Simulated CTA Button */}
                  <div className="pt-1.5">
                    <div className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-black text-xs text-center shadow-xl shadow-indigo-600/40 tracking-wide uppercase">
                      {ctaText}
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-300 text-center pt-0.5 drop-shadow">
                    Aynı Gün Hizmet • Memnuniyet Garantisi • İgeAds AI
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Dispatch Bar below preview */}
            <div className="mt-4 p-4 rounded-2xl bg-[#0e1320] border border-[#1e2940] flex items-center justify-between gap-3 max-w-xl w-full">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Hedef Marka & Portal</span>
                <span className="text-xs font-black text-white">
                  {customProductTitle || activeClientName || 'Yeni Kampanya'}
                </span>
              </div>
              <button
                onClick={handleDispatchToAgencyWorkflow}
                disabled={isDispatching}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-md shadow-cyan-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isDispatching ? 'İletiliyor...' : 'Müşteri Onay Masasına Gönder'}</span>
              </button>
            </div>
          </div>

          {/* Generated Photos Gallery / History */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                <span>Bu Oturumda Üretilen Fotoğraflar ({imageGallery.length})</span>
              </span>
              <span className="text-[10px] text-slate-400">
                Seçmek için üzerine tıklayın
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {imageGallery.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveImageUrl(item.url)}
                  className={`aspect-square rounded-xl overflow-hidden relative border transition-all cursor-pointer group ${
                    activeImageUrl === item.url 
                      ? 'border-cyan-400 ring-2 ring-cyan-400/30 scale-105' 
                      : 'border-slate-800 hover:border-slate-600 opacity-75 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.url} alt={item.prompt} className="w-full h-full object-cover" />
                  {activeImageUrl === item.url && (
                    <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cyan-500 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-black/70 p-0.5 text-[8px] text-white truncate text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.timestamp}
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
