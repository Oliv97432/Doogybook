import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const RelatedArticles = ({ articles, onSelectArticle }) => {
  return (
    <div className="bg-card rounded-lg shadow-elevated p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-heading font-semibold text-foreground">
          Articles connexes
        </h3>
        <Icon name="BookOpen" size={20} className="text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {articles?.map((article) => (
          <button
            key={article?.id}
            onClick={() => onSelectArticle(article)}
            className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-smooth text-left"
          >
            <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
              <Image
                src={article?.image}
                alt={article?.imageAlt}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-foreground mb-2 line-clamp-2">
                {article?.title}
              </h4>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {article?.excerpt}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon name="Clock" size={12} />
                <span>{article?.readTime} min de lecture</span>
              </div>
            </div>

            <Icon name="ChevronRight" size={16} className="text-muted-foreground flex-shrink-0 mt-1" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedArticles;