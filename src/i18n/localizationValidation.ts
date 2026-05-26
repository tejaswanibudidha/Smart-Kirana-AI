type Lang = 'en' | 'hi' | 'te';

const scriptChecks: Record<Lang, RegExp> = {
  en: /[\u0900-\u097F\u0C00-\u0C7F]/,
  hi: /[\u0C00-\u0C7F]/,
  te: /[\u0900-\u097F]/,
};

export const validateLocaleText = (value: string, language: Lang, context = 'localization') => {
  if (!value) return '';
  if (scriptChecks[language].test(value)) {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Mixed-language text blocked in ${context} for ${language}:`, value);
    }
    return '';
  }
  return value;
};
