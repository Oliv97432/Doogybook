import React from 'react';
import Routes from './Routes';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PWAInstallPrompt from './components/PWAInstallPrompt';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes />
        <PWAInstallPrompt />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
