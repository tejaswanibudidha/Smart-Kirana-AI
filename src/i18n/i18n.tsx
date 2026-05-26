import en from './en.json';
import hi from './hi.json';
import te from './te.json';
import { useApp } from '../context/AppContext';
import { validateLocaleText } from './localizationValidation';

type Lang = 'en' | 'hi' | 'te';

const translations: Record<Lang, Record<string, any>> = {
  en,
  hi,
  te,
};

const interpolate = (str: string, vars: Record<string, any> = {}) => {
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
};

export const translate = (key: string, lang: Lang = 'en', options?: { count?: number; [k: string]: any }) => {
  const getByPath = (obj: any, path: string) => {
    if (!obj) return undefined;
    const parts = path.split('.');
    let cur = obj;
    for (const p of parts) {
      if (cur == null) return undefined;
      cur = cur[p];
    }
    return cur;
  };

  let raw = getByPath(translations[lang], key);
  if (raw == null) raw = getByPath(translations['en'], key);
  if (raw == null) {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing translation key: ${key} (${lang})`);
    }
    return '';
  }

  // pluralization: formats like "{count} Item | {count} Items"
  if (options && typeof options.count === 'number' && typeof raw === 'string' && raw.includes('|')) {
    const parts = raw.split('|').map(s => s.trim());
    const chosen = options.count === 1 ? parts[0] : parts[1] || parts[0];
    return interpolate(chosen, options);
  }

  if (typeof raw === 'string') return validateLocaleText(interpolate(raw, options), lang, key);

  return String(raw);
};

export const useTranslation = () => {
  const { language, setLanguage } = useApp();

  const t = (key: string, options?: { count?: number; [k: string]: any }) => translate(key, language as Lang, options);

  return { t, language, setLanguage };
};
