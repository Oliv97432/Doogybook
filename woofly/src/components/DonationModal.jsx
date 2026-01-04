import React from 'react';
import { X, Heart, Check, Sparkles } from 'lucide-react';

const DonationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDonate = () => {
    // À REMPLACER par ton vrai lien PayPal ou Buy Me a Coffee
    // Exemple PayPal : https://www.paypal.com/paypalme/tonpseudo
    // Exemple Buy Me a Coffee : https://www.buymeacoffee.com/tonpseudo
    window.open('https://www.paypal.com/paypalme/TONPSEUDO', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header avec dégradé */}
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-20">
            <Sparkles size={120} />
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-smooth"
          >
            <X size={20} />
          </button>
          
          <div className="relative">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
              <Heart size={32} className="text-white fill-white" />
            </div>
            <h2 className="text-2xl font-heading font-bold mb-2">
              Soutenez Woofly ❤️
            </h2>
            <p className="text-pink-100 text-sm">
              Votre don nous aide à aider plus de chiens
            </p>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-foreground mb-4 leading-relaxed">
              Woofly vous aide à <strong>gérer vos chiens</strong>, <strong>placer en famille d'accueil</strong> et <strong>trouver des adoptants</strong> gratuitement. 🐕
            </p>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4 border border-purple-100">
              <p className="text-sm text-purple-900 font-medium mb-3">
                Votre don nous permet de :
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-800">
                    Améliorer et maintenir la plateforme
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-800">
                    Ajouter de nouvelles fonctionnalités
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-800">
                    Garder Woofly gratuit pour les refuges
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={18} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-purple-800">
                    Aider encore plus de chiens à trouver un foyer
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-sm text-amber-900">
                <strong>💡 Le don est 100% volontaire.</strong><br/>
                Aucune obligation, aucune pression. Juste un moyen de dire merci si Woofly vous a été utile !
              </p>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDonate}
              className="w-full px-6 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-h-[44px]"
            >
              <Heart size={20} className="fill-white" />
              Faire un don via PayPal
            </button>

            <button
              onClick={onClose}
              className="w-full px-6 py-3 border-2 border-border rounded-xl font-medium hover:bg-muted transition-smooth min-h-[44px]"
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
