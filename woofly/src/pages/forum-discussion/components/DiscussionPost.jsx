import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DiscussionPost = ({ 
  post, 
  onLike, 
  onReply, 
  onImageClick,
  isReply = false 
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleReplySubmit = () => {
    if (replyText?.trim()) {
      onReply(post?.id, replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    
    return postDate?.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: postDate?.getFullYear() !== now?.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className={`bg-card ${isReply ? 'ml-8 lg:ml-12 border-l-2 border-primary/20 pl-4' : 'border border-border'} rounded-lg p-4 lg:p-6 shadow-soft`}>
      <div className="flex gap-3 lg:gap-4 mb-4">
        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
          <Image
            src={post?.authorAvatar}
            alt={post?.authorAvatarAlt}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-heading font-semibold text-foreground">
                {post?.authorName}
              </h3>
              <p className="text-sm text-muted-foreground font-caption">
                {formatTimestamp(post?.timestamp)}
              </p>
            </div>
            {post?.isQuestion && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs font-medium">
                <Icon name="HelpCircle" size={14} />
                Question
              </span>
            )}
          </div>

          {!isReply && post?.title && (
            <h2 className="text-lg lg:text-xl font-heading font-semibold text-foreground mb-2">
              {post?.title}
            </h2>
          )}

          <p className="text-foreground whitespace-pre-wrap mb-4">
            {post?.content}
          </p>

          {post?.images && post?.images?.length > 0 && (
            <div className={`grid gap-2 mb-4 ${
              post?.images?.length === 1 ? 'grid-cols-1' : 
              post?.images?.length === 2 ? 'grid-cols-2': 'grid-cols-2 lg:grid-cols-3'
            }`}>
              {post?.images?.map((img, index) => (
                <div 
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-smooth"
                  onClick={() => onImageClick(img)}
                >
                  <Image
                    src={img?.url}
                    alt={img?.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 pt-2 border-t border-border">
            <button
              onClick={() => onLike(post?.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-smooth ${
                post?.isLiked 
                  ? 'text-error bg-error/10' :'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              aria-label={post?.isLiked ? 'Retirer le j\'aime' : 'Aimer'}
            >
              <Icon name={post?.isLiked ? 'Heart' : 'Heart'} size={18} fill={post?.isLiked ? 'currentColor' : 'none'} />
              <span className="text-sm font-medium">{post?.likes}</span>
            </button>

            {!isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth"
                aria-label="Répondre"
              >
                <Icon name="MessageCircle" size={18} />
                <span className="text-sm font-medium">{post?.replyCount || 0}</span>
              </button>
            )}

            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-smooth ml-auto"
              aria-label="Partager"
            >
              <Icon name="Share2" size={18} />
            </button>
          </div>

          {showReplyForm && (
            <div className="mt-4 pt-4 border-t border-border">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e?.target?.value)}
                placeholder="Écrivez votre réponse..."
                className="w-full min-h-[100px] p-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                aria-label="Champ de réponse"
              />
              <div className="flex items-center gap-2 mt-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleReplySubmit}
                  disabled={!replyText?.trim()}
                >
                  Publier
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowReplyForm(false);
                    setReplyText('');
                  }}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionPost;