import { VoiceLang } from './voiceCommandParser';

export interface VoiceRecognitionOptions {
  language: VoiceLang;
  interimResults?: boolean;
  continuous?: boolean;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (message: string) => void;
  onEnd?: () => void;
}

const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  return SpeechRecognition ? new SpeechRecognition() : null;
};

export const isSpeechRecognitionSupported = () => Boolean(getSpeechRecognition());

export const startVoiceRecognition = (options: VoiceRecognitionOptions) => {
  const recognition = getSpeechRecognition();
  if (!recognition) {
    options.onError?.('Speech recognition is not supported in this browser.');
    return null;
  }

  recognition.lang = options.language === 'te' ? 'te-IN' : options.language === 'hi' ? 'hi-IN' : 'en-US';
  recognition.interimResults = options.interimResults ?? true;
  recognition.continuous = options.continuous ?? false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event: any) => {
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      const transcript = result[0]?.transcript?.trim() || '';
      options.onResult(transcript, result.isFinal);
    }
  };

  recognition.onerror = (event: any) => {
    options.onError?.(event?.error || 'speech_error');
  };

  recognition.onend = () => {
    options.onEnd?.();
  };

  recognition.start();
  return recognition;
};
