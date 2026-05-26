import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, History, Mic, MicOff, ShoppingBag, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/i18n';
import { shouldAlertLowStock } from '../../utils/predictions';
import { Product, VendorOrder } from '../../types';
import { parseVoiceCommand } from '../../services/voiceCommandParser';
import { executeVoiceCommand } from '../../services/voiceActionExecutor';
import { startVoiceRecognition, isSpeechRecognitionSupported } from '../../services/voiceRecognitionService';
import { speakVoiceResponse, stopVoiceResponse } from '../../services/voiceResponseService';
import { buildOrderItem, createVendorOrder } from '../../services/vendorOrderService';

interface VoiceAssistantDockProps {
  currentPage: 'home' | 'categories' | 'alerts' | 'orders' | 'profile';
  setCurrentPage: (page: 'home' | 'categories' | 'alerts' | 'orders' | 'profile') => void;
}

const getTopLowStockProduct = (products: Product[]) => products.find(product => shouldAlertLowStock(product));

const VoiceAssistantDock: React.FC<VoiceAssistantDockProps> = ({ setCurrentPage }) => {
  const { products, language, setLanguage, setSearchQuery, updateProduct, addOrder, addVoiceLog, voiceLogs } = useApp();
  const { t } = useTranslation();
  const recognitionRef = useRef<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [assistantText, setAssistantText] = useState(t('voiceTapToSpeak'));
  const [pendingOrder, setPendingOrder] = useState<VendorOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const lowStockProduct = useMemo(() => getTopLowStockProduct(products), [products]);

  useEffect(() => {
    setAssistantText(t('voiceTapToSpeak'));
  }, [t]);

  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.abort?.();
      } catch (error) {
        // ignore cleanup issues
      }
      stopVoiceResponse();
    };
  }, []);

  const localizedPageLabel = (page: 'home' | 'categories' | 'alerts' | 'orders' | 'profile') => {
    if (page === 'categories') return t('nav.categories');
    if (page === 'alerts') return t('alerts');
    if (page === 'orders') return t('orders');
    if (page === 'profile') return t('profile');
    return t('home');
  };

  const pushLog = (intent: string, status: 'listening' | 'parsed' | 'executed' | 'failed', text: string, logLanguage = language) => {
    addVoiceLog({
      id: `voice_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      transcript: text,
      language: logLanguage,
      intent,
      status,
      createdAt: new Date(),
    });
  };

  const speak = (text: string, logLanguage = language) => {
    setAssistantText(text);
    speakVoiceResponse(text, logLanguage);
  };

  const finalizeOrder = (order: VendorOrder) => {
    const confirmedOrder: VendorOrder = {
      ...order,
      status: 'ordered',
      updatedAt: new Date(),
    };
    addOrder(confirmedOrder);
    pushLog('confirm', 'executed', `confirmed ${confirmedOrder.id}`);
    setPendingOrder(null);
    setCurrentPage('orders');
    speak(`${t('voiceOrderPlaced')} - ${confirmedOrder.items.map(item => item.productName).join(', ')}`);
  };

  const cancelPendingOrder = () => {
    setPendingOrder(null);
    pushLog('cancel', 'executed', 'cancel pending order');
    speak(t('voiceCancel'));
  };

  const handleTranscript = (value: string) => {
    const text = value.trim();
    if (!text) return;

    setTranscript(text);
    pushLog('listening', 'parsed', text);

    if (pendingOrder) {
      const normalized = text.toLowerCase();
      if (/^(yes|yep|sure|ok|okay|confirm|haan|haanji|అవును|yes please)/i.test(normalized)) {
        finalizeOrder(pendingOrder);
        return;
      }
      if (/^(no|nope|cancel|stop|nah|nahi|లేదు|వద్దు)/i.test(normalized)) {
        cancelPendingOrder();
        return;
      }
    }

    const parsed = parseVoiceCommand(text, products);
    const result = executeVoiceCommand(parsed, {
      products,
      language,
      setLanguage,
      setCurrentPage,
      setSearchQuery,
      updateProduct,
      addOrder,
      addVoiceLog,
      pushAlert: () => undefined,
    });

    if (!result.success) {
      pushLog(parsed.intent, 'failed', text, parsed.language);
      setErrorMessage(t('voiceNotUnderstood'));
      speak(t('voiceNotUnderstood'), parsed.language);
      return;
    }

    pushLog(parsed.intent, 'executed', text, parsed.language);
    setErrorMessage('');

    if (result.followUp === 'confirm_order' && result.pendingOrder) {
      setPendingOrder(result.pendingOrder);
      const firstItem = result.pendingOrder.items[0];
      speak(`${t('voiceConfirmOrder')} ${firstItem.productName}?`, parsed.language);
      return;
    }

    if (parsed.intent === 'navigate' && parsed.page) {
      speak(localizedPageLabel(parsed.page), parsed.language);
      return;
    }

    if (parsed.intent === 'language_switch' && parsed.targetLanguage) {
      speak(t('voiceLanguageChanged'), parsed.targetLanguage);
      return;
    }

    if (parsed.intent === 'adjust_stock') {
      speak(t('voiceQuantityUpdated'), parsed.language);
      return;
    }

    if (parsed.intent === 'search') {
      speak(`${t('searchProducts')}: ${parsed.searchQuery || text}`, parsed.language);
      return;
    }

    speak(t('voiceTapToSpeak'), parsed.language);
  };

  const startListening = () => {
    if (isListening) return;
    setErrorMessage('');
    setTranscript('');
    setIsListening(true);
    pushLog('listening', 'listening', '');
    speak(t('voiceListening'));

    recognitionRef.current = startVoiceRecognition({
      language,
      interimResults: true,
      continuous: false,
      onResult: (value, isFinal) => {
        setTranscript(value);
        if (isFinal) {
          handleTranscript(value);
        }
      },
      onError: message => {
        setIsListening(false);
        setErrorMessage(message);
        speak(t('voiceNotUnderstood'));
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (!recognitionRef.current) {
      setIsListening(false);
      setErrorMessage('Speech recognition is not supported in this browser.');
    }
  };

  const createLowStockOrder = () => {
    if (!lowStockProduct) return;
    const suggestedQuantity = Math.max(1, lowStockProduct.minStockLevel - lowStockProduct.quantity + 2);
    const order = createVendorOrder([buildOrderItem(lowStockProduct, suggestedQuantity)], lowStockProduct, 'voice');
    setPendingOrder(order);
    setIsOpen(true);
    speak(`${t('voiceLowStockSuggest')} ${lowStockProduct.name}.`, language);
  };

  return (
    <>
      {pendingOrder && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-end justify-center px-4 pb-24">
          <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl p-4 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-600 font-bold">{t('voiceAssistant')}</p>
                <h3 className="text-lg font-bold text-gray-900">{t('voiceConfirm')}</h3>
              </div>
              <button onClick={cancelPendingOrder} className="p-2 rounded-full bg-gray-100 text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-blue-700 font-bold">
                <ShoppingBag size={18} />
                <span>{pendingOrder.vendorName}</span>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                {pendingOrder.items.map(item => (
                  <div key={`${pendingOrder.id}-${item.productId}`} className="flex items-center justify-between">
                    <span>{item.productName}</span>
                    <span className="font-semibold">{item.quantity} {item.unit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={cancelPendingOrder}
                className="py-3 rounded-2xl border border-gray-200 text-gray-700 font-bold"
              >
                {t('voiceCancel')}
              </button>
              <button
                onClick={() => finalizeOrder(pendingOrder)}
                className="py-3 rounded-2xl bg-green-600 text-white font-bold flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                {t('voiceConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed right-4 bottom-24 z-30 flex flex-col items-end gap-3 max-w-[calc(100vw-2rem)]">
        {isOpen && (
          <div className="w-[min(22rem,calc(100vw-2rem))] rounded-3xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 text-white p-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] opacity-70">{t('voiceAssistant')}</p>
                <h3 className="text-lg font-bold mt-1">{isListening ? t('voiceListening') : t('voiceTapToSpeak')}</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <button
                onClick={startListening}
                disabled={!isSpeechRecognitionSupported()}
                className={`w-full rounded-3xl px-4 py-4 flex items-center justify-center gap-3 font-bold text-white transition ${
                  isListening ? 'bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'
                } ${!isSpeechRecognitionSupported() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                <span>{isListening ? t('voiceListening') : t('voiceTapToSpeak')}</span>
              </button>

              {errorMessage && (
                <div className="flex items-start gap-2 rounded-2xl bg-red-50 border border-red-100 p-3 text-red-700 text-sm">
                  <AlertTriangle size={16} className="mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="rounded-2xl bg-gray-50 p-3">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Transcript</p>
                <p className="text-sm text-gray-800 mt-1 min-h-[2.5rem]">{transcript || '...'}</p>
              </div>

              <div className="rounded-2xl bg-blue-50 p-3">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Assistant</p>
                <p className="text-sm text-blue-900 mt-1">{assistantText}</p>
              </div>

              {lowStockProduct && (
                <button
                  onClick={createLowStockOrder}
                  className="w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-sm text-amber-900 flex items-center justify-between gap-3"
                >
                  <span>
                    <strong>{lowStockProduct.name}</strong> {t('voiceLowStockSuggest')}
                  </span>
                  <ShoppingBag size={18} />
                </button>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gray-500">
                  <History size={14} />
                  <span>{t('voiceAssistant')}</span>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {voiceLogs.slice(0, 3).map(log => (
                    <div key={log.id} className="rounded-xl bg-gray-50 px-3 py-2 text-xs text-gray-700">
                      <p className="font-semibold truncate">{log.transcript || t('voiceTapToSpeak')}</p>
                      <p className="text-[11px] text-gray-500 uppercase">{log.intent} • {log.status}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(prev => !prev)}
          className={`h-14 w-14 rounded-full shadow-xl flex items-center justify-center text-white transition-transform ${
            isListening ? 'bg-red-600 scale-110' : 'bg-gradient-to-br from-blue-600 to-cyan-500'
          }`}
        >
          <Mic size={24} />
        </button>
      </div>
    </>
  );
};

export default VoiceAssistantDock;
