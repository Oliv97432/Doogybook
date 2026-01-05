import React from 'react';
import { X, Heart, Check, Sparkles, Coffee } from 'lucide-react';

const DonationModalUser = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleDonate = () => {
    window.open('https://www.buymeacoffee.com/TONPSEUDO', '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-md w-full overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header avec dégradé */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-white relative overflow-hidden">
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
              <Coffee size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-heading font-bold mb-1">
              Offrez-nous un café ☕
            </h2>
            <p className="text-amber-100 text-xs">
              Soutenez le développement de Woofly
            </p>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-5">
          <div className="mb-5">
            <p className="text-foreground mb-4 leading-relaxed text-sm">
              Woofly vous aide à <strong>gérer la santé</strong> de votre chien, suivre ses <strong>vaccins</strong> et <strong>traitements</strong> gratuitement. 🐕
            </p>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 mb-4 border border-amber-100">
              <p className="text-xs text-amber-900 font-medium mb-2">
                Votre café nous permet de :
              </p>
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-amber-800">
                    Améliorer l'application
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-amber-800">
                    Ajouter de nouvelles fonctionnalités
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-amber-800">
                    Garder Woofly gratuit pour vous
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-amber-800">
                    Aider plus de propriétaires de chiens
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-900">
                <strong>💡 100% volontaire !</strong><br/>
                Aucune obligation. Si Woofly vous est utile, un petit café nous motive énormément ! ☕
              </p>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleDonate}
              className="w-full px-4 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold hover:from-amber-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg min-h-[44px] active:scale-[0.98]"
            >
              <Coffee size={18} />
              Offrir un café (3€)
            </button>

            <button
              onClick={onClose}
              className="w-full px-4 py-3 border-2 border-border rounded-lg font-medium hover:bg-muted transition-smooth min-h-[44px] active:bg-muted"
            >
              Peut-être plus tard
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Merci pour votre soutien ! Chaque café compte. 🙏
          </p>
        </div>
      </div>
    </div>
  );
};

export default DonationModalUser;
