import { Product, SalesRecord, Prediction } from '../types';

export const calculateDaysLeft = (
  currentQuantity: number,
  dailyAverage: number
): number => {
  if (dailyAverage === 0) return -1;
  return Math.ceil(currentQuantity / dailyAverage);
};

export const generatePrediction = (
  product: Product,
  sales: SalesRecord[]
): Prediction | null => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentSales = sales.filter(
    s => s.productId === product.id && new Date(s.date) > thirtyDaysAgo
  );

  if (recentSales.length === 0) {
    return null;
  }

  const totalSold = recentSales.reduce((sum, s) => sum + s.quantity, 0);
  const dailyAverage = Math.ceil(totalSold / 30);
  
  const daysLeft = calculateDaysLeft(product.quantity, dailyAverage);
  const reorderDate = new Date();
  reorderDate.setDate(reorderDate.getDate() + Math.max(0, daysLeft - 2));

  return {
    productId: product.id,
    daysLeft: Math.max(0, daysLeft),
    reorderDate,
    message: '',
    messageHi: '',
    messageTe: '',
  };
};

export const shouldAlertOnStock = (product: Product, dailyAverage: number): boolean => {
  if (dailyAverage === 0) return false;
  const daysLeft = calculateDaysLeft(product.quantity, dailyAverage);
  return daysLeft <= 5 && daysLeft > 0;
};

export const shouldAlertCritical = (product: Product, dailyAverage: number): boolean => {
  if (dailyAverage === 0) return false;
  const daysLeft = calculateDaysLeft(product.quantity, dailyAverage);
  return daysLeft <= 2;
};

export const shouldAlertOnExpiry = (expiryDate: Date | undefined): boolean => {
  if (!expiryDate) return false;
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= 2 && daysUntilExpiry > 0;
};

export const getStockStatus = (
  product: Product,
  dailyAverage: number
): 'safe' | 'warning' | 'critical' => {
  if (product.minStockLevel !== undefined && product.quantity <= product.minStockLevel) {
    return 'critical';
  }
  if (dailyAverage === 0) return 'safe';
  const daysLeft = calculateDaysLeft(product.quantity, dailyAverage);
  if (daysLeft <= 2) return 'critical';
  if (daysLeft <= 5) return 'warning';
  return 'safe';
};

export const shouldAlertLowStock = (product: Product): boolean => {
  if (product.minStockLevel === undefined) return false;
  return product.quantity <= product.minStockLevel;
};

export const getDefaultUnit = (productName: string): string => {
  const name = productName.toLowerCase();
  
  if (name.includes('milk') || name.includes('dahi') || name.includes('yogurt')) {
    return 'Litres';
  }
  if (name.includes('rice') || name.includes('wheat') || name.includes('flour') || 
      name.includes('dal') || name.includes('sugar') || name.includes('salt')) {
    return 'Kg';
  }
  if (name.includes('oil') || name.includes('ghee')) {
    return 'Litres';
  }
  if (name.includes('egg')) {
    return 'Dozen';
  }
  if (name.includes('bread') || name.includes('bun') || name.includes('pav')) {
    return 'Pieces';
  }
  if (name.includes('butter') || name.includes('jam') || name.includes('honey')) {
    return 'Kg';
  }
  if (name.includes('biscuit') || name.includes('cookie') || name.includes('wafer') || 
      name.includes('chip')) {
    return 'Pieces';
  }
  if (name.includes('apple') || name.includes('orange') || name.includes('mango') || 
      name.includes('banana') || name.includes('tomato') || name.includes('onion')) {
    return 'Kg';
  }
  
  return 'Pieces';
};
