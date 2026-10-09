import { getGeminiClient, GEMINI_MODELS } from './gemini';

export interface ImageGenerationOptions {
  prompt?: string;
  productName?: string;
  style?: 'studio' | 'lifestyle' | 'luxury' | 'minimal' | 'cyber';
  aspectRatio?: '1:1' | '9:16' | '16:9' | '4:5';
  clientName?: string;
  seed?: number;
}

export interface ImageGenerationResult {
  success: boolean;
  imageUrl: string;
  directUrl: string;
  isBase64: boolean;
  enhancedPrompt: string;
  originalPrompt: string;
  aspectRatio: string;
  dimensions: { width: number; height: number };
  style: string;
  seed: number;
  engine: string;
  error?: string;
}

export function buildBasePrompt(rawPrompt: string, style: string = 'studio', sector: string = ''): string {
  const p = rawPrompt.trim();
  const lower = p.toLowerCase();

  let subjectDesc = p;
  
  if (lower.includes('koltuk') || lower.includes('temizlik') || lower.includes('yıkama') || lower.includes('mandalin') || lower.includes('clean')) {
    subjectDesc = 'Professional high-end upholstery steam cleaning service on a luxurious modern sofa in a bright elegant penthouse living room, water droplet extraction, spotless perfection, pristine hygiene';
  } else if (lower.includes('deri') || lower.includes('ceket') || lower.includes('mont') || lower.includes('giyim') || lower.includes('elbise') || lower.includes('velvet')) {
    subjectDesc = 'High-fashion editorial commercial shoot of luxury bespoke designer jacket on an elegant model, Milan street style, dramatic studio lighting, exquisite fabric texture details';
  } else if (lower.includes('kahve') || lower.includes('coffee')) {
    subjectDesc = 'Artisanal espresso coffee brewing, rich crema pouring into ceramic cup, roasted coffee beans on dark slate, steam rising, warm morning light';
  } else if (lower.includes('diş') || lower.includes('sağlık') || lower.includes('klinik')) {
    subjectDesc = 'Modern luxury dental clinic, confident person with radiant sparkling perfect white smile, high-end medical wellness photography';
  } else if (lower.includes('parfüm') || lower.includes('kozmetik') || lower.includes('krem')) {
    subjectDesc = 'Ultra-luxury perfume glass bottle on marble pedestal with water ripples and subtle botanical accents, soft diffused studio lighting, Vogue advertisement';
  } else if (lower.includes('ige') || lower.includes('ajans') || lower.includes('pazarlama') || lower.includes('yazılım') || lower.includes('dashboard')) {
    subjectDesc = 'Modern high-tech autonomous digital marketing command center, glass monitors with glowing neon holographic performance analytics and charts, cinematic lighting';
  }

  // Style modifiers
  let styleModifier = 'commercial advertising photography, 8k resolution, shot on 85mm f/1.4 lens, master lighting, ultra-realistic, sharp focus, magazine quality';
  if (style === 'lifestyle') {
    styleModifier = 'authentic candid lifestyle photography, natural golden hour sunlight, cozy modern architectural environment, 35mm lens, warm tones, high detail';
  } else if (style === 'luxury') {
    styleModifier = 'ultra-luxury editorial, dramatic rim lighting, gold and deep obsidian shadows, cinematic atmosphere, 8k, shallow depth of field, prestige brand campaign';
  } else if (style === 'minimal') {
    styleModifier = 'clean minimalist Scandinavian aesthetic, soft diffused lighting, pastel and neutral earth tones, crisp details, high-end e-commerce product shot';
  } else if (style === 'cyber') {
    styleModifier = 'vibrant cyberpunk neon lighting, glowing cyan and violet reflections, dark glossy surfaces, dynamic cinematic action, hyper-modern aesthetic';
  }

  return `${subjectDesc}, ${styleModifier}, photorealistic, no text, no watermark, no blur, high definition 8k`;
}

export function getDimensions(aspectRatio: string = '1:1'): { width: number; height: number } {
  switch (aspectRatio) {
    case '9:16':
      return { width: 768, height: 1360 };
    case '16:9':
      return { width: 1280, height: 720 };
    case '4:5':
      return { width: 864, height: 1080 };
    case '1:1':
    default:
      return { width: 1024, height: 1024 };
  }
}

export async function generateAiImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
  const {
    prompt = '',
    productName = '',
    style = 'studio',
    aspectRatio = '1:1',
    clientName = '',
    seed = Math.floor(Math.random() * 999999)
  } = options;

  const rawInput = prompt.trim() || productName.trim() || clientName.trim() || 'Lüks Modern Ürün';

  // 1. Enrich prompt using Gemini if available
  let enhancedPrompt = '';
  const geminiClient = getGeminiClient();

  if (geminiClient) {
    const enrichmentSystemPrompt = `You are an elite commercial advertising photography director and prompt engineer for AI image generators (FLUX/Midjourney).
Convert this user product/service into a single, breathtaking, ultra-realistic commercial advertising photography prompt in English.
Include details about: camera lens (e.g. 85mm f/1.4), studio lighting, surface textures, depth of field, and atmosphere.
Rules:
- Output ONLY the raw prompt in English, nothing else.
- Maximum 35 words.
- Absolutely NO text, words, logos, or letters inside the image. Pure visual photography only.`;

    for (const model of GEMINI_MODELS) {
      try {
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000));
        const aiPromise = geminiClient.models.generateContent({
          model,
          contents: `${enrichmentSystemPrompt}\n\nProduct/Service: "${rawInput}". Desired Style: "${style}".`
        });
        const response: any = await Promise.race([aiPromise, timeoutPromise]);
        const text = response?.text?.trim();
        if (text && text.length > 15) {
          enhancedPrompt = text.replace(/["\n\r]/g, ' ').trim();
          break;
        }
      } catch {
        // Fallback to next model
      }
    }
  }

  // Fallback prompt enrichment
  if (!enhancedPrompt) {
    enhancedPrompt = buildBasePrompt(rawInput, style, clientName);
  }

  // 2. Determine target dimensions
  const { width, height } = getDimensions(aspectRatio);

  // 3. Synthesize via Pollinations FLUX Engine (SOTA Open Weights)
  const encodedPrompt = encodeURIComponent(enhancedPrompt);
  const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&model=flux&nologo=true&seed=${seed}`;

  let base64Image = '';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 16000);
    
    const imgRes = await fetch(pollinationsUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'image/jpeg,image/png,image/*'
      }
    });
    clearTimeout(timeoutId);

    if (imgRes.ok) {
      const buffer = await imgRes.arrayBuffer();
      if (buffer && buffer.byteLength > 1000) {
        const b64 = Buffer.from(buffer).toString('base64');
        const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
        base64Image = `data:${contentType};base64,${b64}`;
      }
    }
  } catch (e: any) {
    console.warn('Pollinations fetch error or timeout:', e.message);
  }

  const finalImageUrl = base64Image || pollinationsUrl;

  return {
    success: true,
    imageUrl: finalImageUrl,
    directUrl: pollinationsUrl,
    isBase64: Boolean(base64Image),
    enhancedPrompt,
    originalPrompt: rawInput,
    aspectRatio,
    dimensions: { width, height },
    style,
    seed,
    engine: 'FLUX.1-Commercial-SOTA'
  };
}
