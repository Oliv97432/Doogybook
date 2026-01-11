import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme doit être utilisé dans ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger le thème depuis localStorage au démarrage
  useEffect(() => {
    const checkPremiumAndLoadTheme = async () => {
      try {
        // Vérifier le statut Premium
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('subscription_tier')
            .eq('id', user.id)
            .single();

          const premiumTiers = ['premium', 'professional'];
          const userIsPremium = premiumTiers.includes(profile?.subscription_tier);
          setIsPremium(userIsPremium);

          // Charger le thème seulement si Premium
          if (userIsPremium) {
            const savedTheme = localStorage.getItem('woofly-theme') || 'light';
            setTheme(savedTheme);
            
            // Appliquer la classe au HTML
            if (savedTheme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          } else {
            // Forcer le mode clair si pas Premium
            setTheme('light');
            document.documentElement.classList.remove('dark');
            localStorage.removeItem('woofly-theme');
          }
        }
      } catch (error) {
        console.error('Erreur chargement thème:', error);
      } finally {
        setLoading(false);
      }
    };

    checkPremiumAndLoadTheme();
  }, []);

  const toggleTheme = () => {
    if (!isPremium) {
      return; // Ne rien faire si pas Premium
    }

    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('woofly-theme', newTheme);
    
    // Appliquer la classe au HTML
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const value = {
    theme,
    setTheme: toggleTheme,
    isPremium,
    loading
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
