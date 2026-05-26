import { VoiceLang } from './voiceCommandParser';

const speechLanguageMap: Record<VoiceLang, string> = {
  en: 'en-US',
  hi: 'hi-IN',
  te: 'te-IN',
};

export const speakVoiceResponse = (text: string, language: VoiceLang = 'en') => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = speechLanguageMap[language];
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
};

export const stopVoiceResponse = () => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
};
