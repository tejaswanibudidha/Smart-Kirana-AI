import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Product, SalesRecord, Alert, VendorOrder, VoiceLog } from '../types';
import { mockDB } from '../services/database';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  language: 'en' | 'hi' | 'te';
  setLanguage: (lang: 'en' | 'hi' | 'te') => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  setSales: (sales: SalesRecord[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  sales: SalesRecord[];
  addSale: (sale: SalesRecord) => void;
  alerts: Alert[];
  setAlerts: (alerts: Alert[]) => void;
  addAlert: (alert: Alert) => void;
  markAlertAsRead: (id: string) => void;
  clearAlerts: () => void;
  orders: VendorOrder[];
  setOrders: (orders: VendorOrder[]) => void;
  addOrder: (order: VendorOrder) => void;
  voiceLogs: VoiceLog[];
  addVoiceLog: (log: VoiceLog) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const language = (user?.language as 'en' | 'hi' | 'te') || 'en';
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SalesRecord[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [voiceLogs, setVoiceLogs] = useState<VoiceLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addProduct = useCallback((product: Product) => {
    setProducts(prev => [...prev, product]);
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts(prev =>
      prev.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const addSale = useCallback((sale: SalesRecord) => {
    setSales(prev => [...prev, sale]);
  }, []);

  const addAlert = useCallback((alert: Alert) => {
    setAlerts(prev => [...prev, alert]);
  }, []);

  const markAlertAsRead = useCallback((id: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === id ? { ...a, read: true } : a))
    );
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const addOrder = useCallback((order: VendorOrder) => {
    setOrders(prev => [order, ...prev]);
  }, []);

  const addVoiceLog = useCallback((log: VoiceLog) => {
    setVoiceLogs(prev => [log, ...prev].slice(0, 50));
  }, []);

  const value: AppContextType = {
    user,
    setUser,
    language,
    setLanguage: (lang: 'en' | 'hi' | 'te') => {
      // smooth transition class
      try {
        document.documentElement.classList.add('lang-changing');
      } catch (e) {}

      if (user) {
        try {
          const updated = mockDB.updateUser(user.id, { language: lang });
          setUser(updated);
        } catch (e) {
          // fallback: mutate local user
          setUser(prev => prev ? { ...prev, language: lang } : prev);
        }
      } else {
        // no user yet; just set a local placeholder so `language` derives correctly
        setUser(prev => prev ? { ...prev, language: lang } : null);
      }

      // remove transition class after brief animation
      try {
        setTimeout(() => document.documentElement.classList.remove('lang-changing'), 300);
      } catch (e) {}
    },
    products,
    setProducts,
    setSales,
    addProduct,
    updateProduct,
    deleteProduct,
    sales,
    addSale,
    alerts,
    setAlerts,
    addAlert,
    markAlertAsRead,
    clearAlerts,
    orders,
    setOrders,
    addOrder,
    voiceLogs,
    addVoiceLog,
    searchQuery,
    setSearchQuery,
  };

  // Persist user to localStorage so UI can recover language and other prefs
  React.useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('smartKiranaUser', JSON.stringify(user));
      } else {
        localStorage.removeItem('smartKiranaUser');
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [user]);

  React.useEffect(() => {
    try {
      localStorage.setItem('smartKiranaOrders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  React.useEffect(() => {
    try {
      localStorage.setItem('smartKiranaVoiceLogs', JSON.stringify(voiceLogs));
    } catch (e) {}
  }, [voiceLogs]);

  React.useEffect(() => {
    try {
      const savedOrders = localStorage.getItem('smartKiranaOrders');
      const savedLogs = localStorage.getItem('smartKiranaVoiceLogs');
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedLogs) setVoiceLogs(JSON.parse(savedLogs));
    } catch (e) {}
  }, []);

  // Apply Telugu-specific typography tweaks when language is Telugu
  React.useEffect(() => {
    try {
      const isTe = language === 'te';
      if (isTe) {
        document.documentElement.classList.add('lang-te');
      } else {
        document.documentElement.classList.remove('lang-te');
      }
    } catch (e) {
      // ignore
    }
  }, [language]);

  // Keep the html `lang` attribute in sync with language
  React.useEffect(() => {
    try {
      document.documentElement.lang = language || 'en';
    } catch (e) {
      // ignore
    }
  }, [language]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
