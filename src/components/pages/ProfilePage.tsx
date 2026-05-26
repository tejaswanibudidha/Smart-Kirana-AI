import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useTranslation } from '../../i18n/i18n';
import { mockDB } from '../../services/database';
import { LogOut, User, Phone, MapPin } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, setUser, setLanguage } = useApp();
  const { t, language } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'te'>(language || 'en');

  const handleLanguageChange = (newLang: 'en' | 'hi' | 'te') => {
    setLanguage(newLang);
    setSelectedLanguage(newLang);
  };

  const handleLogout = () => {
    if (confirm(t('confirmAreYouSure'))) {
      setUser(null);
      localStorage.removeItem('smartKiranaUser');
    }
  };

  return (
    <div className="px-4 space-y-4 pb-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg p-6 text-center">
        <div className="text-5xl mb-2">👤</div>
        <h2 className="text-2xl font-bold">{user?.shopName}</h2>
        <p className="text-sm opacity-90 mt-2">{user?.name}</p>
      </div>

      {/* Profile Info Cards */}
      <div className="space-y-3 bg-white rounded-lg p-4">
        <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
          <Phone className="text-blue-500" size={24} />
          <div>
            <p className="text-gray-600 text-xs">{t('phone')}</p>
            <p className="font-bold text-gray-800">{user?.phone}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
          <MapPin className="text-green-500" size={24} />
          <div>
            <p className="text-gray-600 text-xs">{t('shopName')}</p>
            <p className="font-bold text-gray-800">{user?.shopName}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <User className="text-purple-500" size={24} />
          <div>
            <p className="text-gray-600 text-xs">Member Since</p>
            <p className="font-bold text-gray-800">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
            </p>
          </div>
        </div>
      </div>

      {/* Language Selection */}
      <div className="bg-white rounded-lg p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-3">
          {t('selectLanguage')}
        </h3>
        <div className="space-y-2">
          {[
            { code: 'en', name: '🇬🇧 English', label: 'English' },
            { code: 'hi' as const, name: '🇮🇳 हिंदी', label: 'Hindi' },
            { code: 'te' as const, name: '🌟 తెలుగు', label: 'Telugu' },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code as 'en' | 'hi' | 'te')}
              className={`w-full p-3 rounded-lg font-bold text-lg transition ${
                selectedLanguage === lang.code
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">📦</div>
          <p className="text-gray-600 text-xs mt-2">Products</p>
        </div>
        <div className="bg-white rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600">📊</div>
          <p className="text-gray-600 text-xs mt-2">Tracked</p>
        </div>
      </div>

      {/* Logout Button */}
        <button
        onClick={handleLogout}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-4 rounded-lg text-lg transition flex items-center justify-center space-x-2"
      >
        <LogOut size={24} />
        <span>{t('logout')}</span>
      </button>

      {/* About */}
      <div className="text-center text-gray-600 text-xs p-4">
        <p>Smart Kirana AI v1.0</p>
        <p className="mt-2">AI-powered Inventory Management for Shopkeepers</p>
      </div>
    </div>
  );
};

export default ProfilePage;
