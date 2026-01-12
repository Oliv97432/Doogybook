import React from 'react';
import Routes from './Routes';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import { useA11y } from './utils/accessibility';

function App() {
  // Hook d'accessibilité
  useA11y();
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <div role="main">
          <Routes />
          <PWAInstallPrompt />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
