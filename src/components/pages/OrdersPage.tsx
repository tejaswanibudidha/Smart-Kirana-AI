import React from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/i18n';

const OrdersPage: React.FC = () => {
  const { orders } = useApp();
  const { t } = useTranslation();

  return (
    <div className="px-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{t('vendorOrders')}</h1>
        <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
          {orders.length}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-xl p-6 text-center shadow-sm">
          <p className="text-gray-600 font-medium">{t('noData')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold text-gray-900">{order.vendorName}</h2>
                  <p className="text-xs text-gray-500">{order.vendorPhone}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  order.status === 'ordered'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'confirmed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status}
                </span>
              </div>

              <div className="mt-3 space-y-2">
                {order.items.map(item => (
                  <div key={`${order.id}-${item.productId}`} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                    <div>
                      <p className="font-semibold text-gray-800">{item.productName}</p>
                      <p className="text-xs text-gray-500">{item.quantity} {item.unit}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
