import { Product } from '../types';

export type VoiceLang = 'en' | 'hi' | 'te';
export type VoiceIntent =
  | 'order'
  | 'adjust_stock'
  | 'navigate'
  | 'search'
  | 'language_switch'
  | 'confirm'
  | 'cancel'
  | 'unknown';

export interface ParsedVoiceCommand {
  intent: VoiceIntent;
  language: VoiceLang;
  productId?: string;
  quantity?: number;
  delta?: number;
  page?: 'home' | 'categories' | 'alerts' | 'orders' | 'profile';
  searchQuery?: string;
  targetLanguage?: VoiceLang;
  confidence: number;
  transcript: string;
}

const normalize = (value: string) => value
  .toLowerCase()
  .replace(/[.,!?;:\-_/\\()[\]{}"'`~@#$%^*+=<>|]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const stripSpaces = (value: string) => normalize(value).replace(/\s+/g, '');

const languagePatterns: Record<VoiceLang, RegExp> = {
  en: /[\u0900-\u097F\u0C00-\u0C7F]/,
  hi: /[\u0C00-\u0C7F]/,
  te: /[\u0900-\u097F]/,
};

const yesWords = ['yes', 'sure', 'ok', 'okay', 'confirm', 'haan', 'haanji', 'haan ji', 'haan kar do', 'అవును', 'అవును చేయి', 'yes please'];
const noWords = ['no', 'cancel', 'stop', 'nah', 'nahi', 'nahi chahiye', 'లేదు', 'వద్దు'];

const numberWords: Record<string, number> = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  hundred: 100,
  ek: 1,
  do: 2,
  teen: 3,
  चार: 4,
  पांच: 5,
  छह: 6,
  सात: 7,
  आठ: 8,
  नौ: 9,
  दस: 10,
  ఒంటి: 1,
  రెండు: 2,
  మూడు: 3,
  నాలుగు: 4,
  ఐదు: 5,
  ఆరు: 6,
  ఏడు: 7,
  ఎనిమిది: 8,
  తొమ్మిది: 9,
  పది: 10,
};

const productAliases: Record<string, string[]> = {
  prod_001: ['milk', 'amul milk', 'amul fresh milk', 'milk packet', 'పాలు', 'milk packet', 'दूध', 'दूध पैकेट'],
  prod_002: ['butter', 'amul butter', 'అమూల్ వెన్న', 'मक्खन'],
  prod_003: ['dahi', 'yogurt', 'curd', 'దహి', 'दही'],
  prod_004: ['paneer', 'పనీర్', 'पनीर'],
  prod_005: ['cheese', 'amul cheese', 'చీజ్', 'पनीर'],
  prod_006: ['marie biscuit', 'britannia marie', 'marie gold', 'బిస్కెట్లు', 'बिस्कुट'],
  prod_007: ['parle g', 'parle g biscuit', 'parle g biscuits', 'parle-g', 'పార్లే జీ', 'पार्ले जी'],
  prod_008: ['lays chips', 'lays', 'లేస్', 'चिप्स'],
  prod_009: ['hide and seek', 'hide seek', 'hide & seek', 'హైడ్ అండ్ సీక్', 'हाइड एंड सीक'],
  prod_010: ['kurkure', 'kurkure snacks', 'కుర్కురే', 'कुरकुरे'],
  prod_011: ['rice', 'basmati rice', 'బియ్యం', 'चावल'],
  prod_012: ['flour', 'wheat flour', 'atta', 'గోధుమ పిండి', 'आटा'],
  prod_013: ['oil', 'sunflower oil', 'cooking oil', 'నూనె', 'तेल'],
  prod_014: ['sugar', 'చక్కెర', 'चीनी'],
  prod_015: ['dal', 'pulses', 'toor dal', 'masoor dal', 'పప్పు', 'दाल'],
  prod_016: ['turmeric', 'turmeric powder', 'పసుపు', 'हल्दी'],
  prod_017: ['red chili', 'chili powder', 'కారం', 'मिर्च'],
  prod_018: ['garlic', 'వెల్లులి', 'लहसुन'],
  prod_019: ['salt', 'tata salt', 'ఉప్పు', 'नमक'],
  prod_029: ['sprite', 'స్ప్రైట్', 'स्प्राइट'],
  prod_030: ['coca cola', 'coke', 'కోకా కోలా', 'कोका कोला'],
  prod_031: ['fanta', 'ఫంటా', 'फांटा'],
  prod_032: ['tropicana', 'orange juice', 'ఆరెంజ్ జ్యూస్', 'जूस'],
  prod_033: ['lassi', 'లస్సీ', 'लस्सी'],
  prod_034: ['tea', 'tea powder', 'chai powder', 'టీ'],
  prod_035: ['coffee', 'coffee powder', 'కాఫీ'],
  prod_036: ['horlicks', 'హార్లిక్స్', 'हॉर्लिक्स'],
};

const targetPages: Array<{ words: string[]; page: ParsedVoiceCommand['page'] }> = [
  { words: ['open alerts', 'show alerts', 'alerts', 'అలర్ట్స్', 'अलर्ट'], page: 'alerts' },
  { words: ['go to profile', 'open profile', 'profile', 'ప్రొఫైల్', 'प्रोफाइल'], page: 'profile' },
  { words: ['go home', 'home page', 'home', 'హోమ్', 'होम'], page: 'home' },
  { words: ['open categories', 'categories', 'వర్గాలు', 'श्रेणियाँ'], page: 'categories' },
  { words: ['open orders', 'orders page', 'show orders', 'ఆర్డర్లు', 'ऑर्डर'], page: 'orders' },
];

const languageTargets: Array<{ words: string[]; language: VoiceLang }> = [
  { words: ['switch language to telugu', 'telugu', 'తెలుగు'], language: 'te' },
  { words: ['switch language to hindi', 'hindi', 'हिंदी'], language: 'hi' },
  { words: ['switch language to english', 'english', 'inglish'], language: 'en' },
];

export const detectVoiceLanguage = (text: string): VoiceLang => {
  if (languagePatterns.te.test(text)) return 'te';
  if (languagePatterns.hi.test(text)) return 'hi';
  return 'en';
};

const findNumber = (text: string) => {
  const digitMatch = text.match(/\b(\d{1,3})\b/);
  if (digitMatch) return parseInt(digitMatch[1], 10);

  const words = normalize(text).split(' ');
  for (const word of words) {
    if (numberWords[word] !== undefined) return numberWords[word];
  }

  return undefined;
};

const matchProductId = (text: string, products: Product[]) => {
  const normalized = normalize(text);
  const collapsed = stripSpaces(text);
  let best: { id: string; score: number } | null = null;

  const allAliases = Object.entries(productAliases).flatMap(([id, aliases]) =>
    aliases.map(alias => ({ id, alias: normalize(alias), aliasCompact: stripSpaces(alias) }))
  );

  for (const { id, alias, aliasCompact } of allAliases) {
    let score = 0;
    if (normalized === alias || collapsed === aliasCompact) score = 100;
    else if (normalized.includes(alias) || collapsed.includes(aliasCompact)) score = 90;
    else if (alias && normalized.split(' ').some(token => alias.includes(token) || token.includes(alias))) score = 70;

    if (score > 0 && (!best || score > best.score)) {
      best = { id, score };
    }
  }

  if (best && products.some(product => product.id === best!.id)) return best.id;

  const fallback = products.find(product => {
    const productName = normalize(product.name);
    return normalized.includes(productName) || productName.includes(normalized);
  });

  return fallback?.id;
};

export const parseVoiceCommand = (transcript: string, products: Product[]): ParsedVoiceCommand => {
  const language = detectVoiceLanguage(transcript);
  const normalized = normalize(transcript);

  if (yesWords.some(word => normalized.includes(normalize(word)))) {
    return { intent: 'confirm', language, confidence: 0.98, transcript };
  }

  if (noWords.some(word => normalized.includes(normalize(word)))) {
    return { intent: 'cancel', language, confidence: 0.98, transcript };
  }

  for (const target of languageTargets) {
    if (target.words.some(word => normalized.includes(normalize(word)))) {
      return { intent: 'language_switch', language, targetLanguage: target.language, confidence: 0.95, transcript };
    }
  }

  for (const target of targetPages) {
    if (target.words.some(word => normalized.includes(normalize(word)))) {
      return { intent: 'navigate', language, page: target.page, confidence: 0.9, transcript };
    }
  }

  if (/search|find|show me|రెండు|వెతుకు|खोज|search for/.test(normalized)) {
    const productId = matchProductId(transcript, products);
    return {
      intent: 'search',
      language,
      productId,
      searchQuery: transcript.replace(/^(search|find|show me|search for|వెతుకు|खोज)\s*/i, '').trim(),
      confidence: productId ? 0.8 : 0.6,
      transcript,
    };
  }

  const quantity = findNumber(transcript);
  const productId = matchProductId(transcript, products);
  const hasIncrease = /\b(add|increase|more|increase by|పెంచు|పెంచండి|बढ़ाओ|ज्यादा)\b/i.test(transcript);
  const hasDecrease = /\b(reduce|decrease|less|remove|decrease by|తగ్గించు|తగ్గించండి|घटाओ|कम)\b/i.test(transcript);
  const hasOrder = /\b(order|reorder|buy|get|ఆర్డర్|ఆర్డరు|ऑर्डर)\b/i.test(transcript);

  if (hasOrder || (/packet|packets|bottle|bottles|bag|bags|box|boxes|ప్యాకెట్లు|బాటిళ్లు|బ్యాగులు|पैकेट|बोतल|बैग/.test(normalized) && productId)) {
    return {
      intent: 'order',
      language,
      productId,
      quantity: quantity || 1,
      confidence: productId ? 0.93 : 0.55,
      transcript,
    };
  }

  if ((hasIncrease || hasDecrease) && productId) {
    return {
      intent: 'adjust_stock',
      language,
      productId,
      delta: (hasDecrease ? -1 : 1) * (quantity || 1),
      confidence: 0.9,
      transcript,
    };
  }

  if (productId) {
    return {
      intent: 'search',
      language,
      productId,
      searchQuery: transcript,
      confidence: 0.7,
      transcript,
    };
  }

  return { intent: 'unknown', language, confidence: 0.1, transcript };
};
