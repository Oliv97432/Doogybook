import React from 'react';
import PremiumModal from './PremiumModal';
import { usePremiumModal } from '../hooks/usePremiumModal';

/**
 * Composant global pour le modal Premium
 * À placer une seule fois à la racine de l'application
 * Utilise le store Zustand pour gérer l'état global
 * Version: 1.0.1 - Fixed Tailwind animations
 */
const GlobalPremiumModal = () => {
  const { isOpen, reason, closePremiumModal } = usePremiumModal();

  return (
    <PremiumModal
      isOpen={isOpen}
      onClose={closePremiumModal}
      reason={reason}
    />
  );
};

export default GlobalPremiumModal;
