import React from 'react';
import { Alert } from '../../types';
import { CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useTranslation } from '../../i18n/i18n';
import { getLocalizedProductName } from '../../i18n/product-localization';
import { useApp } from '../../context/AppContext';

interface AlertCardProps {
  alert: Alert;
  onMarkAsRead: () => void;
}

const AlertCard: React.FC<AlertCardProps> = ({ alert, onMarkAsRead }) => {
  const { language } = useApp();
  const { t } = useTranslation();

  const icons = {
    stock: <AlertCircle className="text-yellow-600" size={24} />,
    expiry: <AlertCircle className="text-red-600" size={24} />,
    fastSelling: <TrendingUp className="text-blue-600" size={24} />,
  };

  const productName = getLocalizedProductName({ id: alert.productId } as any, language as 'en' | 'hi' | 'te');
  const displayMessage = alert.type === 'stock'
    ? `${productName} ${t('lowStock')}`
    : alert.type === 'expiry'
    ? `${productName} ${t('expiresSoon')}`
    : `${productName} ${t('fastSelling')}`;

  const severityClasses: Record<string, string> = {
    info: 'bg-blue-50 border-l-4 border-blue-500',
    warning: 'bg-yellow-50 border-l-4 border-yellow-500',
    critical: 'bg-red-50 border-l-4 border-red-500',
  };

  return (
    <div className={`${severityClasses[alert.severity]} rounded-lg p-4 shadow`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {icons[alert.type]}
          <div className="flex-1">
            <p className="font-bold text-gray-800 text-sm">{displayMessage}</p>
            <p className="text-gray-600 text-xs mt-1">
              {new Date(alert.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        {!alert.read && (
          <button
            onClick={onMarkAsRead}
            className="text-green-600 hover:text-green-700 flex-shrink-0"
          >
            <CheckCircle size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertCard;
