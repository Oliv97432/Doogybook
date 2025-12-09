import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Search, Filter, TrendingUp, 
  Clock, MessageCircle, Heart, Eye
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import TabNavigation from '../../components/TabNavigation';
import Footer from '../../components/Footer';

/**
 * Page ForumDetail - Affiche tous les posts d'un forum spécifique
 */
const ForumDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [forum, setForum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, popular, discussed
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [
    { value: '', label: 'Toutes' },
    { value: 'Santé', label: 'Santé' },
    { value: 'Nutrition', label: 'Nutrition' },
    { value: 'Comportement', label: 'Comportement' },
    { value: 'Education', label: 'Éducation' },
    { value: 'Toilettage', label: 'Toilettage' },
    { value: 'Activités', label: 'Activités' },
    { value: 'Autre', label: 'Autre' }
  ];

  // Charger le forum et ses posts
  useEffect(() => {
    fetchForumData();
  }, [slug]);

  // Filtrer et trier
  useEffect(() => {
    let filtered = [...posts];
    
    // Filtre par recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filtre par catégorie
    if (categoryFilter) {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }
    
    // Tri
    switch (sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.like_count - a.like_count);
        break;
      case 'discussed':
        filtered.sort((a, b) => b.comment_count - a.comment_count);
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }
    
    setFilteredPosts(filtered);
  }, [posts, searchQuery, sortBy, categoryFilter]);

  const fetchForumData = async () => {
    setLoading(true);
    
    try {
      // 1. Charger le forum
      const { data: forumData, error: forumError } = await supabase
        .from('forums')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (forumError) throw forumError;
      setForum(forumData);
      
      // 2. Charger les posts du forum
      const { data: postsData, error: postsError } = await supabase
        .from('forum_posts')
        .select(`
          *,
          author:user_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq('forum_id', forumData.id)
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;
      
      // Formater les posts avec nom d'auteur
      const formattedPosts = postsData.map(post => ({
        ...post,
        authorName: post.author?.raw_user_meta_data?.full_name || 
                    post.author?.email?.split('@')[0] || 
                    'Utilisateur'
      }));
      
      setPosts(formattedPosts);
      
    } catch (error) {
      console.error('Erreur chargement forum:', error);
      alert('❌ Forum introuvable');
      navigate('/forum-hub');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!forum) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/forum-hub')}
                className="p-2 hover:bg-muted rounded-lg transition-smooth"
              >
                <ArrowLeft size={24} className="text-foreground" />
              </button>
              <div>
                <h1 className="text-2xl font-heading font-semibold text-foreground">
                  Forum {forum.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {forum.member_count} membres • {forum.post_count} discussions
                </p>
              </div>
            </div>
            
            {user && (
              <button
                onClick={() => navigate('/create-discussion', { state: { forumId: forum.id } })}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth flex items-center gap-2"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Nouvelle discussion</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <TabNavigation />

      {/* Main content */}
      <main className="main-content flex-1">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          
          {/* Cover image + description */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden mb-6">
            <div 
              className="h-48 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${forum.cover_image_url})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h2 className="text-2xl font-heading font-bold mb-1">{forum.name}</h2>
                <p className="text-white/90">{forum.description}</p>
              </div>
            </div>
          </div>

          {/* Filtres et recherche */}
          <div className="bg-card rounded-2xl border border-border p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Tri */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="recent">Plus récent</option>
                <option value="popular">Plus populaire</option>
                <option value="discussed">Plus commenté</option>
              </select>

              {/* Catégorie */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-2xl font-bold text-primary">{posts.length}</p>
              <p className="text-sm text-muted-foreground">Discussions</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {posts.reduce((sum, p) => sum + p.comment_count, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Commentaires</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {posts.reduce((sum, p) => sum + p.like_count, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Likes</p>
            </div>
          </div>

          {/* Liste des posts */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="bg-card rounded-2xl border border-border p-12 text-center">
                <MessageCircle size={48} className="mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchQuery || categoryFilter ? 'Aucun résultat' : 'Aucune discussion'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery || categoryFilter 
                    ? 'Essayez de modifier vos filtres' 
                    : 'Soyez le premier à lancer une discussion !'}
                </p>
                {user && !searchQuery && !categoryFilter && (
                  <button
                    onClick={() => navigate('/create-discussion', { state: { forumId: forum.id } })}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth"
                  >
                    Créer une discussion
                  </button>
                )}
              </div>
            ) : (
              filteredPosts.map(post => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/discussion/${post.id}`)}
                  className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-smooth cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-2">
                        {post.is_question && (
                          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                            ❓ Question
                          </span>
                        )}
                        {post.is_pinned && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                            📌 Épinglé
                          </span>
                        )}
                        {post.is_expert_post && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            ✓ Expert
                          </span>
                        )}
                        {post.category && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                            {post.category}
                          </span>
                        )}
                      </div>

                      {/* Titre */}
                      <h3 className="text-lg font-heading font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      {/* Preview contenu */}
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                        {post.content}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="font-medium">{post.authorName}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {formatTimeAgo(post.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-6 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Heart size={16} />
                      <span className="text-sm">{post.like_count}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MessageCircle size={16} />
                      <span className="text-sm">{post.comment_count}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Eye size={16} />
                      <span className="text-sm">{post.view_count}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForumDetail;
