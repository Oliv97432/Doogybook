import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const FeaturedDiscussion = ({ discussion }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/forum-discussion', { state: { discussionId: discussion?.id } });
  };

  const handleKeyDown = (event) => {
    if (event?.key === 'Enter' || event?.key === ' ') {
      event?.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className="bg-card rounded-lg p-4 shadow-soft hover:shadow-elevated transition-smooth cursor-pointer border border-border"
      aria-label={`Lire la discussion: ${discussion?.title}`}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
          <Image
            src={discussion?.authorAvatar}
            alt={discussion?.authorAvatarAlt}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-heading font-semibold text-foreground line-clamp-2">
              {discussion?.title}
            </h4>
            {discussion?.isExpert && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium flex-shrink-0">
                <Icon name="Award" size={12} />
                Expert
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 font-caption">
            {discussion?.preview}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="text-xs font-caption">
                Par {discussion?.author} • {discussion?.timeAgo}
              </span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Icon name="Heart" size={14} />
                  <span className="text-xs font-caption">{discussion?.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="MessageSquare" size={14} />
                  <span className="text-xs font-caption">{discussion?.replies}</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-primary font-medium">{discussion?.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedDiscussion;