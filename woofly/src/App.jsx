import React, { useEffect } from 'react';
import Routes from './Routes';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import PWAInstallPrompt from './components/PWAInstallPrompt';

function App() {
  // Hook d'accessibilité simple
  useEffect(() => {
    // Ajouter role="main" au contenu principal si absent
    const mainContent = document.querySelector('#root > div');
    if (mainContent && !mainContent.getAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
  }, []);
  
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
