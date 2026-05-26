import React, { useEffect, useState } from 'react';
import { Product, SalesRecord } from '../../types';
import { getStockStatus, shouldAlertOnExpiry } from '../../utils/predictions';
import { useApp } from '../../context/AppContext';
import { mockDB } from '../../services/database';
import { useTranslation } from '../../i18n/i18n';
import { getCategoryKey } from '../../i18n/categories';
import { getProductImageKey, getCategoryFallbackImage } from '../../i18n/product-images';
import { getLocalizedProductName, getLocalizedProductCategory } from '../../i18n/product-localization';
import { Clock, Circle, CalendarDays } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  sales: SalesRecord[];
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, sales, onClick }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentSales = sales.filter(s => s.productId === product.id && new Date(s.date) > thirtyDaysAgo);
  const dailyAverage = recentSales.length > 0 ? Math.ceil(recentSales.reduce((sum, s) => sum + s.quantity, 0) / 30) : 0;

  const status = getStockStatus(product, dailyAverage);
  const isExpiringSoon = shouldAlertOnExpiry(product.expiryDate);

  const statusColors: Record<string, string> = {
    safe: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    critical: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusIndicators: Record<string, string> = {
    safe: 'bg-green-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
  };

  const { user, updateProduct } = useApp();
  const { t, language } = useTranslation();

  const changeQuantity = (delta: number) => {
    if (!user) return;
    const updated: Product = { ...product, quantity: Math.max(0, product.quantity + delta) };
    mockDB.updateProduct(user.id, updated);
    updateProduct(updated);
  };

  const displayName = getLocalizedProductName(product, language) || '';
  const localizedCategory = getLocalizedProductCategory(product, language);
  const displayCategory = localizedCategory || t(`categories.${getCategoryKey(product.category)}`) || '';
  const displayImage = getProductImageKey(product, language, displayName, displayCategory) || product.image || getCategoryFallbackImage(product.category);

  useEffect(() => {
    setImageLoading(true);
  }, [displayImage]);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border-l-4 overflow-hidden ${
        status === 'safe' ? 'border-l-green-500' : status === 'warning' ? 'border-l-yellow-500' : 'border-l-red-500'
      } ${isExpiringSoon ? 'ring-2 ring-orange-400' : ''}`}
    >
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden flex items-center justify-center">
        {imageLoading && <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />}
        <div className="absolute inset-0">
          <img
            src={displayImage}
            alt={displayName}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onLoad={() => setImageLoading(false)}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = getCategoryFallbackImage(product.category);
            }}
          />
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 shadow">
          <Circle size={10} className={`fill-current text-white ${statusIndicators[status]}`} />
          <span className="text-[10px] font-bold text-gray-700 uppercase">{t(status === 'safe' ? 'safeName' : status === 'warning' ? 'warningName' : 'criticalName')}</span>
        </div>
        {isExpiringSoon && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            <span className="inline-flex items-center gap-1"><Clock size={12} />{t('expiresSoon')}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h3 className="font-bold text-gray-800 text-sm">{displayName}</h3>
      <p className="text-gray-600 text-xs mb-2">{displayCategory}</p>

        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-gray-50 rounded p-1.5 flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-xs">{t('quantity')}</p>
              <p className="font-bold text-sm text-gray-800">
                {product.quantity} <span className="text-xs text-gray-600">{t(product.unit.toLowerCase() === 'pieces' ? 'pieces' : product.unit.toLowerCase())}</span>
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => changeQuantity(1)} className="bg-green-100 text-green-700 px-2 rounded">+</button>
              <button onClick={() => changeQuantity(-1)} className="bg-red-100 text-red-700 px-2 rounded">-</button>
            </div>
          </div>
          <div className="bg-gray-50 rounded p-1.5">
            <p className="text-gray-600 text-xs">{t('avgPerDay')}</p>
            <p className="font-bold text-sm text-gray-800">{dailyAverage}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-gray-50 rounded p-1.5">
            <p className="text-gray-600 text-xs">{t('minStockLevelLabel')}</p>
            <p className="font-bold text-sm text-gray-800">{product.minStockLevel}</p>
          </div>
          <div className="bg-gray-50 rounded p-1.5">
            <p className="text-gray-600 text-xs">{t('priceLabel')}</p>
            <p className="font-bold text-sm text-gray-800">₹ {product.price.toFixed(2)}</p>
          </div>
        </div>

        <div className={`rounded p-1.5 text-center ${statusColors[status]} border text-xs`}>
          <p className="font-bold">
            {status === 'safe' ? t('enoughStock') : status === 'warning' ? t('lowStock') : t('criticalStock')}
          </p>
        </div>

        {product.expiryDate && (
          <p className={`text-xs mt-2 font-semibold ${isExpiringSoon ? 'text-red-600' : 'text-orange-600'}`}>
            <CalendarDays size={12} className="inline mr-1" />{new Date(product.expiryDate).toLocaleDateString()}
            {isExpiringSoon && ` - ${t('expiresSoon')}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
