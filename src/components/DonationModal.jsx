import React from 'react';
import { X, Heart, Check, Sparkles } from 'lucide-react';

const DonationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDonate = () => {
    // À REMPLACER par ton vrai lien PayPal ou Buy Me a Coffee
    window.open('https://www.paypal.com/paypalme/TONPSEUDO', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 xs:p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-xs xs:max-w-sm sm:max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header avec dégradé */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-4 xs:p-5 text-white relative overflow-hidden">
          <div className="absolute top-2 right-2 opacity-20">
            <Sparkles size={80} />
          </div>
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 hover:bg-white/20 rounded-lg transition-smooth w-10 h-10 flex items-center justify-center"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
          
          <div className="relative pt-2">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-3">
              <Heart size={24} className="text-white fill-white" />
            </div>
            <h2 className="text-lg xs:text-xl font-heading font-bold mb-1">
              Soutenez Woofly ❤️
            </h2>
            <p className="text-pink-100 text-xs xs:text-sm">
              Votre don nous aide à aider plus de chiens
            </p>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-4 xs:p-5">
          <div className="mb-5">
            <p className="text-foreground mb-4 leading-relaxed text-sm">
              Woofly vous aide à <strong>gérer vos chiens</strong>, <strong>placer en famille d'accueil</strong> et <strong>trouver des adoptants</strong> gratuitement. 🐕
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-4 border border-purple-100">
              <p className="text-xs text-purple-900 font-medium mb-2">
                Votre don nous permet de :
              </p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-purple-800">
                    Améliorer et maintenir la plateforme
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-purple-800">
                    Ajouter de nouvelles fonctionnalités
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-purple-800">
                    Garder Woofly gratuit pour les refuges
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-purple-800">
                    Aider encore plus de chiens à trouver un foyer
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs text-amber-900">
                <strong>💡 Le don est 100% volontaire.</strong><br/>
                Aucune obligation, aucune pression. Juste un moyen de dire merci si Woofly vous a été utile !
              </p>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDonate}
              className="w-full px-4 py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-bold hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg min-h-[44px] active:scale-[0.98]"
            >
              <Heart size={18} className="fill-white" />
              Faire un don via PayPal
            </button>

            <button
              onClick={onClose}
              className="w-full px-4 py-3 border-2 border-border rounded-lg font-medium hover:bg-muted transition-smooth min-h-[44px] active:bg-muted"
            >
              Peut-être plus tard
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Merci pour votre soutien ! Chaque don compte, quel que soit le montant. 🙏
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
