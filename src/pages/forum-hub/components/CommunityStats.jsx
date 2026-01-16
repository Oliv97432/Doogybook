import React from 'react';
import Icon from '../../../components/AppIcon';

const CommunityStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-card rounded-lg p-4 shadow-soft border border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Icon name="Users" size={24} color="var(--color-primary)" />
          </div>
          <div>
            <p className="text-2xl font-heading font-semibold text-foreground">
              {stats?.totalMembers}
            </p>
            <p className="text-sm text-muted-foreground font-caption">Membres actifs</p>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg p-4 shadow-soft border border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <Icon name="MessageSquare" size={24} color="var(--color-secondary)" />
          </div>
          <div>
            <p className="text-2xl font-heading font-semibold text-foreground">
              {stats?.totalPosts}
            </p>
            <p className="text-sm text-muted-foreground font-caption">Discussions</p>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg p-4 shadow-soft border border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
            <Icon name="Heart" size={24} color="var(--color-accent-foreground)" />
          </div>
          <div>
            <p className="text-2xl font-heading font-semibold text-foreground">
              {stats?.totalLikes}
            </p>
            <p className="text-sm text-muted-foreground font-caption">J'aime</p>
          </div>
        </div>
      </div>
      <div className="bg-card rounded-lg p-4 shadow-soft border border-border">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
            <Icon name="TrendingUp" size={24} color="var(--color-success)" />
          </div>
          <div>
            <p className="text-2xl font-heading font-semibold text-foreground">
              {stats?.activeToday}
            </p>
            <p className="text-sm text-muted-foreground font-caption">Actifs aujourd'hui</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityStats;