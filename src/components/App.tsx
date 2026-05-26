import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import LoginScreen from './pages/LoginScreen';
import LanguageSelection from './pages/LanguageSelection';
import MainApp from './pages/MainApp';

const App: React.FC = () => {
  const { user, setUser } = useApp();
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);

  useEffect(() => {
    // Check if user exists in localStorage
    const storedUser = localStorage.getItem('smartKiranaUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setShowLanguageSelection(false);
    }
  }, []);

  if (!user) {
    return <LoginScreen onUserCreated={(newUser) => {
      setUser(newUser);
      localStorage.setItem('smartKiranaUser', JSON.stringify(newUser));
      setShowLanguageSelection(true);
    }} />;
  }

  if (showLanguageSelection) {
    return <LanguageSelection onLanguageSelected={() => {
      setShowLanguageSelection(false);
    }} />;
  }

  return <MainApp />;
};

export default App;
