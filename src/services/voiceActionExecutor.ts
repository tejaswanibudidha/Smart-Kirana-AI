import { Product, VendorOrder, VoiceLog } from '../types';
import { ParsedVoiceCommand, VoiceLang } from './voiceCommandParser';
import { buildOrderItem, createVendorOrder } from './vendorOrderService';

export interface VoiceExecutionContext {
  products: Product[];
  language: VoiceLang;
  setLanguage: (lang: VoiceLang) => void;
  setCurrentPage: (page: 'home' | 'categories' | 'alerts' | 'orders' | 'profile') => void;
  setSearchQuery: (query: string) => void;
  updateProduct: (product: Product) => void;
  addOrder: (order: VendorOrder) => void;
  addVoiceLog: (log: VoiceLog) => void;
  pushAlert: (message: string, type?: 'info' | 'warning' | 'critical') => void;
}

export interface VoiceExecutionResult {
  success: boolean;
  response: string;
  followUp?: 'confirm_order';
  pendingOrder?: VendorOrder;
}

const productById = (products: Product[], productId?: string) => products.find(product => product.id === productId);

export const executeVoiceCommand = (command: ParsedVoiceCommand, context: VoiceExecutionContext): VoiceExecutionResult => {
  const product = productById(context.products, command.productId);

  if (command.intent === 'language_switch' && command.targetLanguage) {
    context.setLanguage(command.targetLanguage);
    return { success: true, response: `Language changed to ${command.targetLanguage === 'te' ? 'Telugu' : command.targetLanguage === 'hi' ? 'Hindi' : 'English'}.` };
  }

  if (command.intent === 'navigate' && command.page) {
    context.setCurrentPage(command.page);
    return { success: true, response: `Opened ${command.page}.` };
  }

  if (command.intent === 'search') {
    context.setSearchQuery(command.searchQuery || product?.name || '');
    if (product) context.setCurrentPage('home');
    return { success: true, response: product ? `Showing ${product.name}.` : `Searching for ${command.searchQuery || ''}.` };
  }

  if (command.intent === 'adjust_stock' && product && typeof command.delta === 'number') {
    const updated = { ...product, quantity: Math.max(0, product.quantity + command.delta) };
    context.updateProduct(updated);
    context.addVoiceLog({ id: `voice_${Date.now()}`, transcript: command.transcript, language: command.language, intent: command.intent, status: 'executed', createdAt: new Date() });
    context.pushAlert('Quantity updated', 'info');
    return { success: true, response: `Quantity updated for ${product.name}.` };
  }

  if (command.intent === 'order' && product) {
    const quantity = Math.max(1, command.quantity || 1);
    const order = createVendorOrder([buildOrderItem(product, quantity)], product, 'voice');
    context.addVoiceLog({ id: `voice_${Date.now()}`, transcript: command.transcript, language: command.language, intent: command.intent, status: 'executed', createdAt: new Date() });
    return {
      success: true,
      followUp: 'confirm_order',
      pendingOrder: order,
      response: '',
    };
  }

  if (command.intent === 'confirm') {
    return { success: true, response: 'Confirmed.' };
  }

  if (command.intent === 'cancel') {
    return { success: true, response: 'Cancelled.' };
  }

  return { success: false, response: 'Sorry, I did not understand the command.' };
};
