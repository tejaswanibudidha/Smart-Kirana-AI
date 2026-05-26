import { Product } from '../types';
import productCatalog from './products';
import { validateLocaleText } from './localizationValidation';

type Lang = 'en' | 'hi' | 'te';

const currentText = (entry: any, language: Lang, field: 'name' | 'category') => {
  return validateLocaleText(entry?.translations?.[language]?.[field] || '', language, `product.${field}`);
};

export const getLocalizedProductName = (product: Product, language: Lang) => {
  const entry = productCatalog[product.id];
  return currentText(entry, language, 'name');
};

export const getLocalizedProductCategory = (product: Product, language: Lang) => {
  const entry = productCatalog[product.id];
  return currentText(entry, language, 'category');
};

export const getLocalizedProductImage = (product: Product, _language: Lang) => {
  const entry = productCatalog[product.id];
  return entry?.image || '';
};
