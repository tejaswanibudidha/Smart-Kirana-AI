import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/i18n';
import AlertCard from '../ui/AlertCard';

const AlertsPage: React.FC = () => {
  const { alerts, markAlertAsRead, clearAlerts } = useApp();
  const { t, language } = useTranslation();

  const unreadAlerts = alerts.filter(a => !a.read);
  const readAlerts = alerts.filter(a => a.read);

  return (
    <div className="px-4 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">🔔 {t('alerts')}</h1>
        {alerts.length > 0 && (
          <button
            onClick={() => clearAlerts()}
            className="text-red-600 hover:text-red-700 font-bold text-sm"
          >
            {t('clearAll')}
          </button>
        )}
      </div>

      {/* Unread Alerts */}
      {unreadAlerts.length > 0 && (
        <div>
              <h2 className="text-lg font-bold text-gray-700 mb-3">{t('alerts')}</h2>
          <div className="space-y-3">
            {unreadAlerts.map(alert => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onMarkAsRead={() => markAlertAsRead(alert.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Read Alerts */}
      {readAlerts.length > 0 && (
        <div>
            <h2 className="text-lg font-bold text-gray-700 mb-3 opacity-60">{t('alerts')}</h2>
          <div className="space-y-3 opacity-60">
            {readAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} onMarkAsRead={() => {}} />
            ))}
          </div>
        </div>
      )}

      {/* No Alerts */}
      {alerts.length === 0 && (
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{t('noAlerts')}</h2>
          <p className="text-gray-600">{t('noAlerts')}</p>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
