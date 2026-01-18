import React from 'react';
import Routes from './Routes';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import GlobalPremiumModal from './components/GlobalPremiumModal';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes />
        <PWAInstallPrompt />
        <GlobalPremiumModal />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
