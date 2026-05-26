import React from 'react';
import { useApp } from '../../context/AppContext';
import { mockDB } from '../../services/database';

interface LanguageSelectionProps {
  onLanguageSelected: () => void;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onLanguageSelected }) => {
  const { user, setUser } = useApp();
  const { setLanguage } = useApp();

  const handleLanguageSelect = (language: 'en' | 'hi' | 'te') => {
    setLanguage(language);
    onLanguageSelected();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🌐</div>
          <h1 className="text-3xl font-bold text-gray-800">Select Language</h1>
          <p className="text-gray-600 mt-2">Choose your preferred language</p>
        </div>

        <div className="space-y-4">
          {/* English */}
          <button
            onClick={() => handleLanguageSelect('en')}
            className="w-full bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-6 px-4 rounded-lg text-2xl transition transform hover:scale-105"
          >
            🇬🇧 English
          </button>

          {/* Hindi */}
          <button
            onClick={() => handleLanguageSelect('hi')}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 text-white font-bold py-6 px-4 rounded-lg text-2xl transition transform hover:scale-105"
          >
            🇮🇳 हिंदी
          </button>

          {/* Telugu */}
          <button
            onClick={() => handleLanguageSelect('te')}
            className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-6 px-4 rounded-lg text-2xl transition transform hover:scale-105"
          >
            🌟 తెలుగు
          </button>
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">
          You can change this later in Profile settings
        </p>
      </div>
    </div>
  );
};

export default LanguageSelection;
