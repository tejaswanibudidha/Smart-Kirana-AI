import React from 'react';
import { Home, LayoutGrid, Bell, ShoppingBag, User } from 'lucide-react';
import { useTranslation } from '../../i18n/i18n';

interface BottomNavBarProps {
  currentPage: 'home' | 'categories' | 'alerts' | 'orders' | 'profile';
  setCurrentPage: (page: 'home' | 'categories' | 'alerts' | 'orders' | 'profile') => void;
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, setCurrentPage }) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'home', icon: Home, label: t('home') },
    { id: 'categories', icon: LayoutGrid, label: t('nav.categories') },
    { id: 'alerts', icon: Bell, label: t('alerts') },
    { id: 'orders', icon: ShoppingBag, label: t('orders') },
    { id: 'profile', icon: User, label: t('profile') },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg max-w-md mx-auto">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as 'home' | 'categories' | 'alerts' | 'orders' | 'profile')}
              className={`flex-1 py-3 px-2 flex flex-col items-center justify-center transition ${
                isActive
                  ? 'text-blue-600 border-t-4 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 font-bold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavBar;
