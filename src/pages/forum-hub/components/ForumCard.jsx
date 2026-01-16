import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ForumCard = ({ forum }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate('/forum-discussion', { state: { forumId: forum?.id, forumName: forum?.name } });
  };

  const handleKeyDown = (event) => {
    if (event?.key === 'Enter' || event?.key === ' ') {
      event?.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="bg-card rounded-lg shadow-soft hover:shadow-elevated transition-smooth cursor-pointer overflow-hidden border border-border"
      aria-label={`Accéder au forum ${forum?.name}`}
    >
      <div className="relative h-40 overflow-hidden">
        <Image
          src={forum?.image}
          alt={forum?.imageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-heading font-semibold text-white mb-1">
            {forum?.name}
          </h3>
          <p className="text-sm text-white/90 font-caption">
            {forum?.description}
          </p>
        </div>
        {forum?.isActive && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-success/90 text-success-foreground px-2 py-1 rounded-full">
            <div className="w-2 h-2 bg-success-foreground rounded-full animate-pulse" />
            <span className="text-xs font-medium">Actif</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Icon name="Users" size={16} />
              <span className="text-sm font-caption">{forum?.memberCount} membres</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Icon name="MessageSquare" size={16} />
              <span className="text-sm font-caption">{forum?.postCount} posts</span>
            </div>
          </div>
        </div>

        {forum?.latestPost && (
          <div className="border-t border-border pt-3">
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
                <Image
                  src={forum?.latestPost?.authorAvatar}
                  alt={forum?.latestPost?.authorAvatarAlt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {forum?.latestPost?.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Par {forum?.latestPost?.author} • {forum?.latestPost?.timeAgo}
                </p>
              </div>
            </div>
          </div>
        )}

        {forum?.trendingTopics && forum?.trendingTopics?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {forum?.trendingTopics?.map((topic, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-accent/20 text-accent-foreground rounded-full text-xs font-caption"
              >
                <Icon name="TrendingUp" size={12} />
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumCard;