import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/i18n';
import { shouldAlertLowStock, shouldAlertOnExpiry } from '../../utils/predictions';
import SummaryCard from '../ui/SummaryCard';
import AlertBanner from '../ui/AlertBanner';
import ProductCard from '../ui/ProductCard';
import { getLocalizedProductName, getLocalizedProductCategory } from '../../i18n/product-localization';

const HomePage: React.FC = () => {
  const { products, alerts, sales, searchQuery, setSearchQuery } = useApp();
  const { t, language } = useTranslation();

  // Calculate summary data
  const totalProducts = products.length;
  const lowStockItems = products.filter(p => shouldAlertLowStock(p)).length;

  const expiringSoon = products.filter(p => shouldAlertOnExpiry(p.expiryDate)).length;

  const dynamicAlerts = Math.max(alerts.filter(a => !a.read).length, lowStockItems + expiringSoon);

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && !a.read).length;

  const filteredProducts = products.filter(product => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    const displayName = getLocalizedProductName(product, language)?.toLowerCase() || '';
    const displayCategory = getLocalizedProductCategory(product, language)?.toLowerCase() || '';
    return [product.name, product.category, displayName, displayCategory].some(value => value.includes(query));
  });

  return (
    <div className="px-4 space-y-4">
      <div className="bg-white rounded-2xl shadow-sm p-3 border border-gray-100">
        <input
          value={searchQuery}
          onChange={event => setSearchQuery(event.target.value)}
          placeholder={t('searchProducts')}
          className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-gray-800 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Critical Alert Banner */}
      {criticalAlerts > 0 && (
        <AlertBanner
          severity="critical"
          message={`${criticalAlerts} ${t('criticalAlert')}`}
        />
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <SummaryCard icon="📦" title={t('totalProducts')} value={totalProducts} color="blue" />
        <SummaryCard icon="⚠️" title={t('lowStockItems')} value={lowStockItems} color="yellow" />
        <SummaryCard icon="⏰" title={t('expiringSoon')} value={expiringSoon} color="red" />
        <SummaryCard icon="🔔" title={t('alerts')} value={dynamicAlerts} color="purple" />
      </div>

      {/* Recent Products */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-3">{t('products')}</h2>
        {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg p-6 text-center">
            <p className="text-gray-600">{t('noData')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.slice(0, 12).map(product => (
              <ProductCard key={product.id} product={product} sales={sales} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Action */}
      <div className="flex gap-3 py-4">
        <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition">
          ➕ {t('addProduct')}
        </button>
        <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition">
          📊 {t('recordSales')}
        </button>
      </div>
    </div>
  );
};

export default HomePage;
