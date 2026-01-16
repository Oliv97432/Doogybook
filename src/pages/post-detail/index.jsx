import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Heart, MessageSquare, Send, Award, MoreVertical, Trash2, Edit } from 'lucide-react';
import TabNavigation from '../../components/TabNavigation';
import UserMenu from '../../components/UserMenu';
import Footer from '../../components/Footer';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  
  useEffect(() => {
    fetchPost();
    fetchComments();
    if (user) {
      checkIfLiked();
    }
    // Incrémenter view_count
    incrementViewCount();
  }, [id, user]);
  
  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select(`
          *,
          author:user_id (
            id,
            email,
            raw_user_meta_data
          ),
          forum:forum_id (
            id,
            name,
            slug
          ),
          images:forum_post_images (
            image_url,
            caption,
            display_order
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Erreur chargement post:', error);
      navigate('/forum-hub');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_comments')
        .select(`
          *,
          author:user_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq('post_id', id)
        .is('parent_id', null) // Seulement les commentaires racine
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Erreur chargement commentaires:', error);
    }
  };
  
  const checkIfLiked = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('forum_likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .maybeSingle();
      
      setHasLiked(!!data);
    } catch (error) {
      console.error('Erreur vérification like:', error);
    }
  };
  
  const incrementViewCount = async () => {
    try {
      await supabase.rpc('increment_post_views', { post_id: id });
    } catch (error) {
      // Silencieux - pas critique
    }
  };
  
  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      if (hasLiked) {
        // Unlike
        await supabase
          .from('forum_likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);
        
        setHasLiked(false);
        setPost(prev => ({ ...prev, like_count: prev.like_count - 1 }));
      } else {
        // Like
        await supabase
          .from('forum_likes')
          .insert({
            post_id: id,
            user_id: user.id
          });
        
        setHasLiked(true);
        setPost(prev => ({ ...prev, like_count: prev.like_count + 1 }));
      }
    } catch (error) {
      console.error('Erreur like:', error);
      alert('❌ Erreur lors du like');
    }
  };
  
  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    if (!user) {
      navigate('/login');
      return;
    }
    
    setSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('forum_comments')
        .insert({
          post_id: id,
          user_id: user.id,
          content: newComment.trim()
        });
      
      if (error) throw error;
      
      setNewComment('');
      fetchComments();
      setPost(prev => ({ ...prev, comment_count: prev.comment_count + 1 }));
    } catch (error) {
      console.error('Erreur création commentaire:', error);
      alert('❌ Erreur lors de la publication du commentaire');
    } finally {
      setSubmittingComment(false);
    }
  };
  
  const handleDeletePost = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) return;
    
    try {
      const { error } = await supabase
        .from('forum_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      alert('✅ Post supprimé');
      navigate(`/forum/${post.forum.slug}`);
    } catch (error) {
      console.error('Erreur suppression post:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!post) return null;
  
  const authorName = post.author?.raw_user_meta_data?.full_name || 
                     post.author?.email?.split('@')[0] || 
                     'Utilisateur';
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/forum/${post.forum.slug}`)}
              className="text-muted-foreground hover:text-foreground"
            >
              ← {post.forum.name}
            </button>
            <UserMenu />
          </div>
        </div>
      </div>
      
      <TabNavigation />
      
      <main className="main-content">
        <div className="max-w-4xl mx-auto px-4 py-6">
          
          {/* Post principal */}
          <div className="bg-card border border-border rounded-3xl p-6 mb-6">
            {/* Header du post */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{authorName}</span>
                    {post.is_expert_post && (
                      <Award size={16} className="text-yellow-500" title="Expert" />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(post.created_at)}
                  </span>
                </div>
              </div>
              
              {user?.id === post.user_id && (
                <div className="relative group">
                  <button className="p-2 hover:bg-muted rounded-xl transition-smooth">
                    <MoreVertical size={20} />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-elevated hidden group-hover:block">
                    <button
                      onClick={handleDeletePost}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-destructive/10 text-destructive rounded-xl"
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Catégorie */}
            {post.category && (
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                {post.category}
              </span>
            )}
            
            {/* Titre */}
            <h1 className="text-2xl font-heading font-bold mb-4">{post.title}</h1>
            
            {/* Contenu */}
            <div className="prose prose-sm max-w-none mb-6">
              <p className="whitespace-pre-wrap text-foreground">{post.content}</p>
            </div>
            
            {/* Images */}
            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {post.images
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((img, idx) => (
                    <div key={idx}>
                      <img
                        src={img.image_url}
                        alt={img.caption || ''}
                        className="w-full rounded-2xl object-cover"
                      />
                      {img.caption && (
                        <p className="text-sm text-muted-foreground mt-2">{img.caption}</p>
                      )}
                    </div>
                  ))}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center gap-6 pt-4 border-t border-border">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-smooth ${
                  hasLiked
                    ? 'bg-red-100 text-red-600'
                    : 'hover:bg-muted'
                }`}
              >
                <Heart size={20} fill={hasLiked ? 'currentColor' : 'none'} />
                <span>{post.like_count || 0}</span>
              </button>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageSquare size={20} />
                <span>{post.comment_count || 0} commentaires</span>
              </div>
            </div>
          </div>
          
          {/* Section commentaires */}
          <div className="bg-card border border-border rounded-3xl p-6">
            <h2 className="text-xl font-heading font-bold mb-6">
              Commentaires ({comments.length})
            </h2>
            
            {/* Formulaire nouveau commentaire */}
            {user ? (
              <form onSubmit={handleSubmitComment} className="mb-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Écrivez un commentaire..."
                      rows={3}
                      className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary resize-none mb-2"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim() || submittingComment}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-smooth disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send size={16} />
                      {submittingComment ? 'Publication...' : 'Publier'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-muted rounded-xl p-6 text-center mb-6">
                <p className="text-muted-foreground mb-3">
                  Connectez-vous pour commenter
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-smooth"
                >
                  Se connecter
                </button>
              </div>
            )}
            
            {/* Liste des commentaires */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  currentUserId={user?.id}
                  onDelete={() => fetchComments()}
                />
              ))}
              
              {comments.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Aucun commentaire pour le moment. Soyez le premier à commenter !
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Composant CommentCard
const CommentCard = ({ comment, currentUserId, onDelete }) => {
  const authorName = comment.author?.raw_user_meta_data?.full_name || 
                     comment.author?.email?.split('@')[0] || 
                     'Utilisateur';
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days < 7) return `Il y a ${days}j`;
    return date.toLocaleDateString('fr-FR');
  };
  
  const handleDelete = async () => {
    if (!confirm('Supprimer ce commentaire ?')) return;
    
    try {
      const { error } = await supabase
        .from('forum_comments')
        .delete()
        .eq('id', comment.id);
      
      if (error) throw error;
      
      onDelete();
    } catch (error) {
      console.error('Erreur suppression commentaire:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };
  
  return (
    <div className="flex gap-3 p-4 rounded-xl hover:bg-muted/50 transition-smooth">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
        {authorName.charAt(0).toUpperCase()}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="font-medium">{authorName}</span>
            {comment.is_expert_comment && (
              <Award size={14} className="text-yellow-500" title="Expert" />
            )}
            <span className="text-muted-foreground text-sm">
              {formatDate(comment.created_at)}
            </span>
          </div>
          
          {currentUserId === comment.user_id && (
            <button
              onClick={handleDelete}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
        
        <p className="text-foreground whitespace-pre-wrap">{comment.content}</p>
        
        {comment.like_count > 0 && (
          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
            <Heart size={14} />
            <span>{comment.like_count}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
