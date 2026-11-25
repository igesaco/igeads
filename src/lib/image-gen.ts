import { getGeminiClient } from './gemini';

export type ImageStyle = 'studio' | 'lifestyle' | 'luxury' | 'minimal' | 'cyber';

export interface ImageGenerationOptions {
  prompt?: string;
  productName?: string;
  style?: ImageStyle;
  aspectRatio?: string;
  clientName?: string;
  seed?: number;
  /** Optional product photo (data URL) the generated scene must keep the product from. */
  referenceImage?: string;
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

// Gemini native image models, tried in order. Override with GEMINI_IMAGE_MODELS="model-a,model-b"
// when Google renames or retires one.
const DEFAULT_IMAGE_MODELS = ['gemini-nano-banana-2.1', 'gemini-3.1-flash-image', 'gemini-2.5-flash-image'];
const envImageModels = (process.env.GEMINI_IMAGE_MODELS || '').split(',').map(m => m.trim()).filter(Boolean);
export const GEMINI_IMAGE_MODELS = envImageModels.length > 0 ? envImageModels : DEFAULT_IMAGE_MODELS;

const SUPPORTED_RATIOS = ['1:1', '2:3', '3:2', '3:4', '4:3', '4:5', '5:4', '9:16', '16:9', '21:9'];

// Image generation usually takes 10–30 s; the route allows 60 s, so the whole run must stay under that.
const TOTAL_BUDGET_MS = 55_000;

const STYLE_DIRECTIONS: Record<ImageStyle, string> = {
  studio: 'Professional commercial studio photography, 85mm lens, softbox key light with subtle rim light, seamless backdrop, crisp product detail.',
  lifestyle: 'Authentic lifestyle photography in a real, lived-in setting, warm natural window light, 35–50mm lens, candid and believable, not stock-photo-like.',
  luxury: 'Luxury editorial campaign photography, dramatic low-key lighting, deep shadows with warm gold highlights, rich textures, prestige mood.',
  minimal: 'Minimal e-commerce photography, clean pastel or neutral background, soft diffused light, gentle shadows, lots of negative space.',
  cyber: 'Bold futuristic look, vivid cyan and magenta neon lighting, glossy reflective dark surfaces, high contrast.'
};

function layoutHint(aspectRatio: string): string {
  if (aspectRatio === '9:16') {
    return 'Vertical story composition: keep the main subject in the middle of the frame and leave the top 15% and bottom 35% calm and uncluttered so headline and button text can be overlaid.';
  }
  if (aspectRatio === '16:9' || aspectRatio === '21:9') {
    return 'Wide banner composition: place the subject on the right third and keep the left side calm and uncluttered for text overlay.';
  }
  return 'Balanced square composition with the subject clearly centered and some breathing room around it.';
}

export function buildImagePrompt(
  rawPrompt: string,
  style: ImageStyle,
  aspectRatio: string,
  hasReference: boolean
): string {
  const parts = [
    hasReference
      ? `Using the product in the attached photo, create a new commercial advertising photo. Keep the product itself exactly as it is (shape, colors, labels, proportions); change only the scene, lighting and background. Scene: ${rawPrompt}`
      : `Commercial advertising photo. ${rawPrompt}`,
    STYLE_DIRECTIONS[style] || STYLE_DIRECTIONS.studio,
    layoutHint(aspectRatio),
    'Photorealistic, high detail, natural colors.',
    'Do not add any text, letters, numbers, logos, brand names or watermarks to the image.'
  ];
  return parts.join('\n');
}

function parseDataUrl(dataUrl: string): { mimeType: string; data: string } | null {
  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl || '');
  if (!match) return null;
  return { mimeType: match[1], data: match[2] };
}

function dimensionsFor(aspectRatio: string): { width: number; height: number } {
  const [w, h] = aspectRatio.split(':').map(Number);
  if (!w || !h) return { width: 1024, height: 1024 };
  const scale = 1024 / Math.max(w, h);
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      value => { clearTimeout(timer); resolve(value); },
      err => { clearTimeout(timer); reject(err); }
    );
  });
}

function describeError(err: any): string {
  const message = String(err?.message || err || '');
  if (message === 'timeout') return 'Gemini zamanında yanıt vermedi.';
  if (/quota|RESOURCE_EXHAUSTED|429/i.test(message)) return 'Gemini görsel kotası doldu veya API anahtarının görsel üretim yetkisi yok.';
  if (/SAFETY|blocked|PROHIBITED/i.test(message)) return 'Gemini bu açıklamayı güvenlik kuralları nedeniyle reddetti.';
  if (/not found|404|is not supported/i.test(message)) return 'Görsel modeli bulunamadı.';
  return message.slice(0, 200) || 'Bilinmeyen hata.';
}

/**
 * Generates an ad photo with a Gemini image model. Never falls back to stock photos: when no model returns
 * an image, the result has success=false and an error the UI shows to the user.
 */
export async function generateAiImage(options: ImageGenerationOptions): Promise<ImageGenerationResult> {
  const style: ImageStyle = (options.style && options.style in STYLE_DIRECTIONS ? options.style : 'studio') as ImageStyle;
  const aspectRatio = SUPPORTED_RATIOS.includes(options.aspectRatio || '') ? (options.aspectRatio as string) : '1:1';
  const seed = options.seed ?? Math.floor(Math.random() * 999999);
  const rawInput = (options.prompt || '').trim() || (options.productName || '').trim() || (options.clientName || '').trim();
  const reference = options.referenceImage ? parseDataUrl(options.referenceImage) : null;

  const base: ImageGenerationResult = {
    success: false,
    imageUrl: '',
    directUrl: '',
    isBase64: false,
    enhancedPrompt: '',
    originalPrompt: rawInput,
    aspectRatio,
    dimensions: dimensionsFor(aspectRatio),
    style,
    seed,
    engine: ''
  };

  if (!rawInput) {
    return { ...base, error: 'Lütfen üretilecek fotoğrafı tarif eden bir açıklama yazın.' };
  }

  const client = getGeminiClient();
  if (!client) {
    return { ...base, error: 'GEMINI_API_KEY tanımlı değil; görsel üretilemiyor.' };
  }

  const prompt = buildImagePrompt(rawInput, style, aspectRatio, Boolean(reference));
  base.enhancedPrompt = prompt;

  const contents = reference
    ? [{ role: 'user', parts: [{ inlineData: reference }, { text: prompt }] }]
    : prompt;

  const startedAt = Date.now();
  let lastError = '';

  for (const model of GEMINI_IMAGE_MODELS) {
    const remaining = TOTAL_BUDGET_MS - (Date.now() - startedAt);
    if (remaining < 5_000) break;
    try {
      const response: any = await withTimeout(
        client.models.generateContent({
          model,
          contents,
          config: {
            responseModalities: ['IMAGE'],
            imageConfig: { aspectRatio }
          }
        }),
        remaining
      );

      const parts = response?.candidates?.[0]?.content?.parts || [];
      const imagePart = parts.find((p: any) => p?.inlineData?.data);
      if (imagePart) {
        const mime = imagePart.inlineData.mimeType || 'image/png';
        const dataUrl = `data:${mime};base64,${imagePart.inlineData.data}`;
        return {
          ...base,
          success: true,
          imageUrl: dataUrl,
          directUrl: dataUrl,
          isBase64: true,
          engine: `Google Gemini (${model})`
        };
      }

      const finishReason = response?.candidates?.[0]?.finishReason || response?.promptFeedback?.blockReason;
      lastError = finishReason ? `Gemini görsel döndürmedi (${finishReason}).` : 'Gemini görsel döndürmedi.';
      console.warn(`Image model ${model} returned no image`, finishReason || '');
    } catch (err: any) {
      lastError = describeError(err);
      console.warn(`Image model ${model} failed:`, err?.message || err);
      if (lastError === 'Gemini zamanında yanıt vermedi.') break;
    }
  }

  return { ...base, error: `Fotoğraf üretilemedi. ${lastError} Lütfen tekrar deneyin.`.trim() };
}
