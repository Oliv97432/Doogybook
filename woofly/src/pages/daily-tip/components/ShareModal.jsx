import React from 'react';
import Icon from '../../../components/AppIcon';

const ShareModal = ({ tip, isOpen, onClose }) => {
  if (!isOpen) return null;

  const shareOptions = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: 'MessageCircle',
      color: 'text-green-600',
      action: () => {
        const text = encodeURIComponent(`${tip?.title}\n\n${tip?.content?.substring(0, 100)}...`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: 'Facebook',
      color: 'text-blue-600',
      action: () => {
        const url = encodeURIComponent(window.location?.href);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
      }
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: 'Twitter',
      color: 'text-sky-500',
      action: () => {
        const text = encodeURIComponent(tip?.title);
        const url = encodeURIComponent(window.location?.href);
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      }
    },
    {
      id: 'email',
      name: 'Email',
      icon: 'Mail',
      color: 'text-gray-600',
      action: () => {
        const subject = encodeURIComponent(tip?.title);
        const body = encodeURIComponent(`${tip?.content}\n\nSource: ${tip?.source}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      }
    },
    {
      id: 'copy',
      name: 'Copier le lien',
      icon: 'Link',
      color: 'text-purple-600',
      action: () => {
        navigator.clipboard?.writeText(window.location?.href);
        alert('Lien copié dans le presse-papiers!');
      }
    }
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-lg shadow-elevated max-w-md w-full p-6"
        onClick={(e) => e?.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-heading font-semibold text-foreground">
            Partager ce conseil
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted transition-smooth flex items-center justify-center"
            aria-label="Fermer"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="space-y-2">
          {shareOptions?.map((option) => (
            <button
              key={option?.id}
              onClick={() => {
                option?.action();
                onClose();
              }}
              className="w-full flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth"
            >
              <div className={`w-10 h-10 rounded-full bg-background flex items-center justify-center ${option?.color}`}>
                <Icon name={option?.icon} size={20} />
              </div>
              <span className="text-sm font-medium text-foreground">
                {option?.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;