import { Product, VendorOrder, VendorOrderItem } from '../types';

const vendorDirectory: Record<string, { name: string; phone: string }> = {
  grocery: { name: 'Kirana Wholesale Hub', phone: '+91-9000000001' },
  snacks: { name: 'SnackMart Distributor', phone: '+91-9000000002' },
  beverages: { name: 'Beverage Supply Co.', phone: '+91-9000000003' },
  personalCare: { name: 'Daily Care Supplies', phone: '+91-9000000004' },
  dairy: { name: 'Fresh Dairy Vendor', phone: '+91-9000000005' },
  household: { name: 'Household Essentials', phone: '+91-9000000006' },
};

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export const getVendorForProduct = (product: Product) => {
  const category = normalize(product.category || 'grocery');
  if (category.includes('snack') || category.includes('biscuit')) return vendorDirectory.snacks;
  if (category.includes('beverage') || category.includes('drink')) return vendorDirectory.beverages;
  if (category.includes('dairy')) return vendorDirectory.dairy;
  if (category.includes('personal')) return vendorDirectory.personalCare;
  if (category.includes('household')) return vendorDirectory.household;
  return vendorDirectory.grocery;
};

export const buildOrderItem = (product: Product, quantity: number): VendorOrderItem => ({
  productId: product.id,
  productName: product.name,
  quantity,
  unit: product.unit,
});

export const createVendorOrder = (items: VendorOrderItem[], product: Product, source: 'voice' | 'manual' = 'voice'): VendorOrder => {
  const vendor = getVendorForProduct(product);
  const now = new Date();

  return {
    id: `ord_${now.getTime()}_${Math.random().toString(36).slice(2, 7)}`,
    vendorName: vendor.name,
    vendorPhone: vendor.phone,
    status: 'pending',
    items,
    source,
    createdAt: now,
    updatedAt: now,
  };
};

export const getOrderLabel = (order: VendorOrder) => `${order.vendorName} • ${order.items.length} item(s)`;
