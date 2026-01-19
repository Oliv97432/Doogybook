import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook pour gérer les Web Push Notifications
 * Gère les permissions, l'enregistrement et l'envoi de notifications push
 */
export const useWebPush = () => {
  const { user } = useAuth();
  const [permission, setPermission] = useState('default');
  const [subscription, setSubscription] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si les notifications sont supportées
    const checkSupport = () => {
      const supported =
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window;

      setIsSupported(supported);

      if (supported) {
        setPermission(Notification.permission);
      }

      setLoading(false);
    };

    checkSupport();
  }, []);

  useEffect(() => {
    if (!isSupported || !user?.id) return;

    // Récupérer l'abonnement existant
    getExistingSubscription();
  }, [isSupported, user?.id]);

  /**
   * Récupérer l'abonnement push existant
   */
  const getExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (error) {
      console.error('Erreur récupération subscription:', error);
    }
  };

  /**
   * Demander la permission pour les notifications
   */
  const requestPermission = async () => {
    if (!isSupported) {
      throw new Error('Les notifications push ne sont pas supportées sur cet appareil');
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        await subscribeToPush();
      }

      return result;
    } catch (error) {
      console.error('Erreur demande permission:', error);
      throw error;
    }
  };

  /**
   * S'abonner aux notifications push
   */
  const subscribeToPush = async () => {
    if (!isSupported || permission !== 'granted') {
      throw new Error('Permission non accordée pour les notifications');
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // Clé publique VAPID (vous devrez générer la vôtre)
      // Pour générer: npx web-push generate-vapid-keys
      const vapidPublicKey = 'VOTRE_CLE_PUBLIQUE_VAPID_ICI';

      const options = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      };

      const sub = await registration.pushManager.subscribe(options);
      setSubscription(sub);

      // Sauvegarder l'abonnement dans la base de données
      if (user?.id) {
        await saveSubscription(sub);
      }

      return sub;
    } catch (error) {
      console.error('Erreur subscription push:', error);
      throw error;
    }
  };

  /**
   * Se désabonner des notifications push
   */
  const unsubscribeFromPush = async () => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();

      // Supprimer de la base de données
      if (user?.id) {
        await removeSubscription();
      }

      setSubscription(null);
    } catch (error) {
      console.error('Erreur unsubscribe:', error);
      throw error;
    }
  };

  /**
   * Sauvegarder l'abonnement dans Supabase
   */
  const saveSubscription = async (sub) => {
    try {
      const subscriptionData = {
        user_id: user.id,
        endpoint: sub.endpoint,
        p256dh: arrayBufferToBase64(sub.getKey('p256dh')),
        auth: arrayBufferToBase64(sub.getKey('auth')),
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('push_subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Erreur sauvegarde subscription:', error);
      throw error;
    }
  };

  /**
   * Supprimer l'abonnement de Supabase
   */
  const removeSubscription = async () => {
    try {
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur suppression subscription:', error);
      throw error;
    }
  };

  /**
   * Envoyer une notification de test
   */
  const sendTestNotification = async () => {
    if (!isSupported || permission !== 'granted') {
      throw new Error('Notifications non autorisées');
    }

    try {
      // Afficher une notification locale de test
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification('Test Doogybook', {
        body: 'Les notifications fonctionnent correctement ! 🐕',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: 'test-notification',
        vibrate: [200, 100, 200],
        data: {
          url: '/notifications'
        }
      });
    } catch (error) {
      console.error('Erreur notification test:', error);
      throw error;
    }
  };

  return {
    permission,
    subscription,
    isSupported,
    loading,
    isSubscribed: !!subscription,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush,
    sendTestNotification
  };
};

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================

/**
 * Convertir une clé VAPID base64 en Uint8Array
 */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Convertir un ArrayBuffer en base64
 */
function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
