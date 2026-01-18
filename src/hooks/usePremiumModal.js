import { create } from 'zustand';

/**
 * Hook global pour gérer l'affichage du modal Premium
 * Permet d'afficher le modal depuis n'importe où dans l'app
 *
 * Usage:
 * const { showPremiumModal } = usePremiumModal();
 * showPremiumModal('dogs'); // Affiche le modal avec la raison 'dogs'
 * showPremiumModal('photos'); // Affiche le modal avec la raison 'photos'
 * showPremiumModal(); // Affiche le modal avec la raison par défaut 'limit'
 */
const usePremiumModal = create((set) => ({
  isOpen: false,
  reason: 'limit',

  showPremiumModal: (reason = 'limit') => {
    set({ isOpen: true, reason });
  },

  closePremiumModal: () => {
    set({ isOpen: false });
  },
}));

export default usePremiumModal;
