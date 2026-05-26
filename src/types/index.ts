// Types
export interface User {
  id: string;
  phone: string;
  name: string;
  language: 'en' | 'hi' | 'te';
  shopName: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  minStockLevel: number;
  image?: string;
  expiryDate?: Date;
  lastRestockDate: Date;
  dailyAverage: number;
  userId: string;
}

export interface SalesRecord {
  id: string;
  productId: string;
  quantity: number;
  date: Date;
  userId: string;
}

export interface Alert {
  id: string;
  type: 'stock' | 'expiry' | 'fastSelling';
  productId: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: Date;
  read: boolean;
  userId: string;
}

export interface SubCategory {
  id: string;
  name: string;
  icon: string;
  image?: string;
  nameHi?: string;
  nameTe?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image?: string;
  nameHi?: string;
  nameTe?: string;
  subCategories?: SubCategory[];
}

export interface Prediction {
  productId: string;
  daysLeft: number;
  reorderDate: Date;
  message: string;
  messageHi: string;
  messageTe: string;
}

export interface VendorOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: string;
}

export interface VendorOrder {
  id: string;
  vendorName: string;
  vendorPhone: string;
  status: 'pending' | 'confirmed' | 'ordered' | 'delivered' | 'cancelled';
  items: VendorOrderItem[];
  source: 'voice' | 'manual';
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  language?: 'en' | 'hi' | 'te';
}

export interface VoiceLog {
  id: string;
  transcript: string;
  language: 'en' | 'hi' | 'te';
  intent: string;
  status: 'listening' | 'parsed' | 'executed' | 'failed';
  createdAt: Date;
}
