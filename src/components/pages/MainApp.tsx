import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { shouldAlertLowStock, shouldAlertOnExpiry } from '../../utils/predictions';
import HomePage from './HomePage';
import CategoriesPage from './CategoriesPage';
import AlertsPage from './AlertsPage';
import OrdersPage from './OrdersPage';
import ProfilePage from './ProfilePage';
import BottomNavBar from '../ui/BottomNavBar';
import VoiceAssistantDock from '../ui/VoiceAssistantDock';
import { mockDB } from '../../services/database';
import { useTranslation } from '../../i18n/i18n';
import { Alert } from '../../types';
import { getLocalizedProductName } from '../../i18n/product-localization';

type Page = 'home' | 'categories' | 'alerts' | 'orders' | 'profile';

const MainApp: React.FC = () => {
  const { user, language, setProducts, setSales, setAlerts } = useApp();
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    // Load user data
    if (user) {
      const products = mockDB.getProducts(user.id);
      const sales = mockDB.getSales(user.id);
      let alerts = mockDB.getAlerts(user.id);

      const notifications: Alert[] = [];

      products.forEach(product => {
        const displayName = getLocalizedProductName(product, language) || '';
        // Check if already has a valid alert for low stock
        const hasLowStockAlert = alerts.some(a => 
          a.productId === product.id && 
          a.type === 'stock' && 
          !a.read
        );
        
        if (shouldAlertLowStock(product) && !hasLowStockAlert) {
          notifications.push({
            id: `alert_${Date.now()}_${product.id}_stock`,
            type: 'stock',
            productId: product.id,
            message: `${displayName} ${t('willRunOut')} (${product.quantity} ${product.unit}).`,
            severity: 'warning',
            createdAt: new Date(),
            read: false,
            userId: user.id,
          });
        }

        // Check if already has a valid alert for expiry
        const hasExpiryAlert = alerts.some(a => 
          a.productId === product.id && 
          a.type === 'expiry' && 
          !a.read
        );
        
        if (shouldAlertOnExpiry(product.expiryDate) && !hasExpiryAlert) {
          notifications.push({
            id: `alert_${Date.now()}_${product.id}_expiry`,
            type: 'expiry',
            productId: product.id,
            message: `${displayName} ${t('expiresSoon')} ${product.expiryDate?.toLocaleDateString()}.`,
            severity: 'critical',
            createdAt: new Date(),
            read: false,
            userId: user.id,
          });
        }
      });

      notifications.forEach(alert => mockDB.addAlert(user.id, alert));
      if (notifications.length > 0) {
        alerts = [...alerts, ...notifications];
      }

      setProducts(products);
      setSales(sales);
      setAlerts(alerts);
    }
  }, [user, t, setProducts, setSales, setAlerts]);

  return (
    <div className="flex flex-col h-screen bg-gray-50 max-w-md mx-auto relative">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 shadow-lg sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">🏪 {user?.shopName}</h1>
            <p className="text-xs opacity-90">Smart Kirana AI</p>
          </div>
          {language && (
            <div className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">
              {language.toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pb-20 pt-4">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'categories' && <CategoriesPage />}
        {currentPage === 'alerts' && <AlertsPage />}
        {currentPage === 'orders' && <OrdersPage />}
        {currentPage === 'profile' && <ProfilePage />}
      </div>

      <VoiceAssistantDock currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Bottom Navigation */}
      <BottomNavBar currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default MainApp;
