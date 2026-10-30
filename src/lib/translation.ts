/**
 * Translation service with Google Cloud Translation API v2 support
 * and intelligent free fallback with in-memory & localStorage caching.
 */

// Cache storage key
const CACHE_STORAGE_KEY = 'bb_translation_cache_v1';
const API_KEY_STORAGE_KEY = 'google_translate_api_key';

// In-memory cache for ultra-fast repeated lookups
const memoryCache = new Map<string, string>();

// Initialize memory cache from localStorage if available
function initCache() {
  if (typeof window === 'undefined') return;
  try {
    const stored = localStorage.getItem(CACHE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.entries(parsed).forEach(([key, val]) => {
        if (typeof val === 'string') {
          memoryCache.set(key, val);
        }
      });
    }
  } catch {
    // Ignore storage parse errors
  }
}

initCache();

function persistCache(key: string, value: string) {
  memoryCache.set(key, value);
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(CACHE_STORAGE_KEY);
    const existing = raw ? JSON.parse(raw) : {};
    existing[key] = value;
    // Limit cache size to 1000 items
    const keys = Object.keys(existing);
    if (keys.length > 1000) {
      delete existing[keys[0]];
    }
    localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // Ignore quota errors
  }
}

function getCacheKey(text: string, targetLang: string, sourceLang: string): string {
  return `${sourceLang}_${targetLang}_${text.trim()}`;
}

/**
 * Get configured Google Translate API key
 */
export function getGoogleTranslateApiKey(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
  if (stored && stored.trim()) return stored.trim();
  const envKey = (import.meta as any).env?.VITE_GOOGLE_TRANSLATE_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim()) return envKey.trim();
  return '';
}

/**
 * Save Google Translate API key in browser settings
 */
export function setGoogleTranslateApiKey(key: string) {
  if (typeof window === 'undefined') return;
  if (key && key.trim()) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

/**
 * Translate using Google Cloud Translation API v2
 */
async function translateViaGoogleCloud(
  text: string,
  apiKey: string,
  targetLang: string,
  sourceLang: string
): Promise<string> {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text',
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData?.error?.message || `Google API error: ${response.status}`);
  }

  const data = await response.json();
  const result = data?.data?.translations?.[0]?.translatedText;
  if (!result) throw new Error('No translation in Google API response');
  return result;
}

/**
 * Translate a single chunk (< 500 chars) via free MyMemory API
 */
async function translateViaFreeEngine(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<string> {
  const clean = text.trim();
  if (!clean) return text;

  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=${sourceLang}|${targetLang}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Free translation error: ${response.status}`);
  }

  const data = await response.json();
  const translated = data?.responseData?.translatedText;
  if (translated && !translated.includes('MYMEMORY WARNING')) {
    return translated;
  }

  // If warning returned or empty, return original text
  return clean;
}

/**
 * Smart paragraph and sentence chunking for large descriptions or news articles
 */
async function translateLargeTextViaFreeEngine(
  text: string,
  targetLang: string,
  sourceLang: string
): Promise<string> {
  // If small enough, translate directly
  if (text.length <= 400) {
    return translateViaFreeEngine(text, targetLang, sourceLang);
  }

  // Split by double newline (paragraphs) first
  const paragraphs = text.split(/\n\n+/);
  const translatedParagraphs: string[] = [];

  for (const para of paragraphs) {
    if (para.length <= 400) {
      try {
        const trans = await translateViaFreeEngine(para, targetLang, sourceLang);
        translatedParagraphs.push(trans);
      } catch {
        translatedParagraphs.push(para);
      }
    } else {
      // Split large paragraph by sentences
      const sentences = para.match(/[^.!?]+[.!?]+|\S+/g) || [para];
      const translatedSentences: string[] = [];
      let currentBatch = '';

      for (const sentence of sentences) {
        if ((currentBatch + ' ' + sentence).length < 350) {
          currentBatch = currentBatch ? `${currentBatch} ${sentence}` : sentence;
        } else {
          if (currentBatch) {
            try {
              const res = await translateViaFreeEngine(currentBatch, targetLang, sourceLang);
              translatedSentences.push(res);
            } catch {
              translatedSentences.push(currentBatch);
            }
          }
          currentBatch = sentence;
        }
      }

      if (currentBatch) {
        try {
          const res = await translateViaFreeEngine(currentBatch, targetLang, sourceLang);
          translatedSentences.push(res);
        } catch {
          translatedSentences.push(currentBatch);
        }
      }

      translatedParagraphs.push(translatedSentences.join(' '));
    }
  }

  return translatedParagraphs.join('\n\n');
}

/**
 * Main translation function: translates text from English to Marathi (or other target)
 * Checks cache first -> Google Cloud API (if key present) -> Free Engine fallback.
 */
export async function translateText(
  text?: string | null,
  targetLang: string = 'mr',
  sourceLang: string = 'en'
): Promise<string> {
  if (!text || !text.trim()) return '';

  const trimmed = text.trim();

  // If source and target are the same, return as is
  if (targetLang === sourceLang) return trimmed;

  const cacheKey = getCacheKey(trimmed, targetLang, sourceLang);

  // 1. Check memory / localStorage cache
  if (memoryCache.has(cacheKey)) {
    return memoryCache.get(cacheKey)!;
  }

  let translated = '';

  // 2. Try Google Cloud Translation API if key is available
  const apiKey = getGoogleTranslateApiKey();
  if (apiKey) {
    try {
      translated = await translateViaGoogleCloud(trimmed, apiKey, targetLang, sourceLang);
    } catch (err) {
      console.warn('Google Cloud Translation API failed, falling back to free engine:', err);
    }
  }

  // 3. Fallback to free engine if Google Cloud API wasn't configured or errored
  if (!translated) {
    try {
      translated = await translateLargeTextViaFreeEngine(trimmed, targetLang, sourceLang);
    } catch (err) {
      console.warn('Free translation engine error:', err);
      translated = trimmed; // Graceful degradation to original text
    }
  }

  if (translated) {
    persistCache(cacheKey, translated);
    return translated;
  }

  return trimmed;
}

/**
 * Synchronous cache lookup helper:
 * Returns translated text immediately if cached, or undefined if not cached yet.
 */
export function getCachedTranslation(
  text?: string | null,
  targetLang: string = 'mr',
  sourceLang: string = 'en'
): string | undefined {
  if (!text || !text.trim()) return '';
  if (targetLang === sourceLang) return text;
  const cacheKey = getCacheKey(text.trim(), targetLang, sourceLang);
  return memoryCache.get(cacheKey);
}

/**
 * Batch translate multiple fields in an object (e.g., in Admin editors)
 */
export async function translateObjectFields<T extends Record<string, string | null | undefined>>(
  fields: T,
  targetLang: string = 'mr',
  sourceLang: string = 'en'
): Promise<Record<keyof T, string>> {
  const result: Record<string, string> = {};
  const entries = Object.entries(fields);

  for (const [key, val] of entries) {
    if (val && typeof val === 'string' && val.trim()) {
      result[key] = await translateText(val, targetLang, sourceLang);
    } else {
      result[key] = '';
    }
  }

  return result as Record<keyof T, string>;
}
