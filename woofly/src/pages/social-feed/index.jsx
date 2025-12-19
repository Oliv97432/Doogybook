import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Heart, MessageCircle, TrendingUp, Plus, Share2, Send, 
  Bell, Sparkles, Users as UsersIcon, TrendingUp as FireIcon,
  Hash, UserPlus, Settings as SettingsIcon
} from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import TabNavigation from '../../components/TabNavigation';
import UserMenu from '../../components/UserMenu';
import Footer from '../../components/Footer';
import CreatePostModal from '../../components/CreatePostModal';

const SocialFeed = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();
  
  const [posts, setPosts] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedTag, setSelectedTag] = useState('all');
  const [feedType, setFeedType] = useState('explore');
  const [currentProfile, setCurrentProfile] = useState(null);
  const [dogProfiles, setDogProfiles] = useState([]);
  const [userAvatar, setUserAvatar] = useState(null);
  const [userName, setUserName] = useState('');
  const [tagStats, setTagStats] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [userStats, setUserStats] = useState({ posts: 0, followers: 0, following: 0 });
  
  const TAGS = ['all', 'santé', 'chiot', 'alimentation', 'comportement', 'balade', 'astuce'];
  
  // ... (garde tous les useEffect existants)
  useEffect(() => {
    const fetchDogProfiles = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('dogs')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setDogProfiles(data);
          
          const savedProfile = localStorage.getItem('currentDogProfile');
          if (savedProfile) {
            setCurrentProfile(JSON.parse(savedProfile));
          } else {
            setCurrentProfile(data[0]);
            localStorage.setItem('currentDogProfile', JSON.stringify(data[0]));
          }
        }
      } catch (error) {
        console.error('Erreur chargement chiens:', error);
      }
    };
    
    fetchDogProfiles();
  }, [user?.id]);
  
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user?.id) return;
      
      try {
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Erreur chargement profil:', error);
          setUserName(user.email?.split('@')[0] || 'Utilisateur');
          return;
        }
        
        if (profile) {
          setUserName(profile.full_name || user.email?.split('@')[0] || 'Utilisateur');
          
          const avatarPath = profile.avatar_url;
          if (avatarPath) {
            if (avatarPath.startsWith('http')) {
              setUserAvatar(avatarPath);
            } else {
              const { data } = supabase.storage
                .from('user-avatars')
                .getPublicUrl(avatarPath);
              
              setUserAvatar(data.publicUrl);
            }
          }
        }
      } catch (error) {
        console.error('Erreur chargement infos utilisateur:', error);
      }
    };
    
    fetchUserInfo();
  }, [user?.id]);
  
  useEffect(() => {
    fetchTopPosts();
    fetchTagStats();
    fetchSuggestedUsers();
    fetchFollowedUsers();
    fetchUserStats();
  }, [user?.id]);
  
  useEffect(() => {
    fetchPosts();
  }, [selectedTag, feedType, followedUsers]);
  
  const fetchUserStats = async () => {
    if (!user?.id) return;
    
    try {
      // Nombre de posts
      const { count: postsCount } = await supabase
        .from('forum_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('forum_id', null);
      
      // Nombre de followers
      const { count: followersCount } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id);
      
      // Nombre de following
      const { count: followingCount } = await supabase
        .from('user_follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', user.id);
      
      setUserStats({
        posts: postsCount || 0,
        followers: followersCount || 0,
        following: followingCount || 0
      });
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };
  
  const fetchFollowedUsers = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('following_id')
        .eq('follower_id', user.id);
      
      if (error && error.code !== 'PGRST116') {
        console.error('Erreur chargement follows:', error);
        return;
      }
      
      if (data) {
        setFollowedUsers(new Set(data.map(f => f.following_id)));
      }
    } catch (error) {
      console.error('Erreur follows:', error);
    }
  };
  
  const fetchSuggestedUsers = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, avatar_url')
        .neq('id', user.id)
        .limit(5);
      
      if (error) throw error;
      
      const usersWithDogs = await Promise.all(
        (data || []).map(async (profile) => {
          const { data: dogs } = await supabase
            .from('dogs')
            .select('breed')
            .eq('user_id', profile.id)
            .limit(1)
            .single();
          
          return {
            ...profile,
            dogBreed: dogs?.breed || 'Chien'
          };
        })
      );
      
      setSuggestedUsers(usersWithDogs);
    } catch (error) {
      console.error('Erreur suggestions:', error);
    }
  };
  
  const handleFollow = async (userId) => {
    if (!user?.id) return;
    
    try {
      if (followedUsers.has(userId)) {
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
        
        setFollowedUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      } else {
        await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });
        
        await supabase.rpc('create_notification', {
          p_user_id: userId,
          p_actor_id: user.id,
          p_type: 'follow'
        });
        
        setFollowedUsers(prev => new Set(prev).add(userId));
      }
      
      fetchUserStats();
    } catch (error) {
      console.error('Erreur follow:', error);
    }
  };
  
  const fetchTagStats = async () => {
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .select('tags')
        .is('forum_id', null)
        .eq('is_hidden', false);
      
      if (error) throw error;
      
      const tagCount = {};
      data.forEach(post => {
        if (post.tags) {
          post.tags.forEach(tag => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
          });
        }
      });
      
      const stats = Object.entries(tagCount)
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      setTagStats(stats);
    } catch (error) {
      console.error('Erreur stats tags:', error);
    }
  };
  
  const fetchTopPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from('forum_posts')
        .select('*')
        .is('forum_id', null)
        .eq('is_hidden', false)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('like_count', { ascending: false })
        .limit(5);
      
      if (postsError) throw postsError;
      
      const filtered = postsData.filter(post => post.like_count >= 3);
      
      const postsWithAuthors = await Promise.all(
        filtered.map(async (post) => {
          const { data: authorData } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', post.user_id)
            .single();
          
          return {
            ...post,
            author: authorData
          };
        })
      );
      
      setTopPosts(postsWithAuthors);
    } catch (error) {
      console.error('Erreur chargement top posts:', error);
    }
  };
  
  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('forum_posts')
        .select('*')
        .is('forum_id', null)
        .eq('is_hidden', false)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (feedType === 'following' && followedUsers.size > 0) {
        query = query.in('user_id', Array.from(followedUsers));
      }
      
      if (selectedTag !== 'all') {
        query = query.contains('tags', [selectedTag]);
      }
      
      const { data: postsData, error: postsError } = await query;
      
      if (postsError) throw postsError;
      
      const postsWithAuthors = await Promise.all(
        (postsData || []).map(async (post) => {
          try {
            const { data } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', post.user_id)
              .single();
            
            return {
              ...post,
              author: data
            };
          } catch (err) {
            return post;
          }
        })
      );
      
      setPosts(postsWithAuthors);
    } catch (error) {
      console.error('Erreur chargement posts:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleProfileChange = (profile) => {
    setCurrentProfile(profile);
    localStorage.setItem('currentDogProfile', JSON.stringify(profile));
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-heading font-semibold text-foreground">
              Communauté
            </h1>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/notifications')}
                className="relative p-2 hover:bg-muted rounded-full transition-smooth"
              >
                <Bell size={24} className="text-foreground" />
                {unreadCount > 0 && (
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </div>
                )}
              </button>
              
              <UserMenu
                dogProfiles={dogProfiles}
                currentDog={currentProfile}
                onDogChange={handleProfileChange}
              />
            </div>
          </div>
        </div>
      </div>
      
      <TabNavigation />
      
      {/* Layout avec sidebars */}
      <main className="main-content flex-1">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            
            {/* SIDEBAR GAUCHE - Desktop uniquement */}
            <aside className="hidden lg:block lg:w-64 xl:w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                
                {/* Profil résumé */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                  <div className="text-center mb-4">
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={userName}
                        className="w-20 h-20 rounded-full mx-auto object-cover mb-3"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                        {userName?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    )}
                    <h3 className="font-heading font-semibold text-gray-900">{userName}</h3>
                    {currentProfile && (
                      <p className="text-sm text-gray-600">🐕 {currentProfile.name}</p>
                    )}
                  </div>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{userStats.posts}</div>
                      <div className="text-xs text-gray-600">Posts</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{userStats.followers}</div>
                      <div className="text-xs text-gray-600">Abonnés</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-gray-900">{userStats.following}</div>
                      <div className="text-xs text-gray-600">Abonnements</div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate('/settings')}
                    className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-smooth flex items-center justify-center gap-2"
                  >
                    <SettingsIcon size={16} />
                    Paramètres
                  </button>
                </div>
                
              </div>
            </aside>
            
            {/* FEED CENTRAL */}
            <div className="flex-1 max-w-2xl mx-auto space-y-6">
              
              {/* Bouton créer post */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                <button
                  onClick={() => setShowCreatePost(true)}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-smooth text-left"
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="Avatar"
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <span className="text-gray-600">Quoi de neuf avec ton chien ?</span>
                  <Plus size={20} className="ml-auto text-blue-500 flex-shrink-0" />
                </button>
              </div>
              
              {/* Onglets Feed Type */}
              <div className="flex gap-2 bg-white rounded-3xl shadow-sm border border-gray-200 p-2">
                <button
                  onClick={() => setFeedType('following')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-smooth ${
                    feedType === 'following'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Sparkles size={20} />
                  <span>Pour toi</span>
                </button>
                
                <button
                  onClick={() => setFeedType('explore')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-smooth ${
                    feedType === 'explore'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <UsersIcon size={20} />
                  <span>Explorer</span>
                </button>
              </div>
              
              {/* Tags */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-4 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-smooth flex-shrink-0 ${
                      selectedTag === tag
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {tag === 'all' ? 'Tous' : `#${tag}`}
                  </button>
                ))}
              </div>
              
              {/* Posts */}
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                      <p className="text-gray-900">{post.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
                  <p className="text-gray-600">Aucun post pour le moment</p>
                </div>
              )}
            </div>
            
            {/* SIDEBAR DROITE - Tablet et Desktop */}
            <aside className="hidden md:block md:w-72 lg:w-80 flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                
                {/* Qui suivre */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-heading font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <UserPlus size={20} className="text-blue-500" />
                    Qui suivre
                  </h3>
                  <div className="space-y-3">
                    {suggestedUsers.slice(0, 3).map((suggestedUser) => (
                      <div key={suggestedUser.id} className="flex items-center gap-3">
                        {suggestedUser.avatar_url ? (
                          <img
                            src={suggestedUser.avatar_url.startsWith('http') 
                              ? suggestedUser.avatar_url 
                              : supabase.storage.from('user-avatars').getPublicUrl(suggestedUser.avatar_url).data.publicUrl}
                            alt={suggestedUser.full_name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {(suggestedUser.full_name || suggestedUser.email)?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {suggestedUser.full_name || suggestedUser.email?.split('@')[0]}
                          </p>
                          <p className="text-xs text-gray-600 truncate">{suggestedUser.dogBreed}</p>
                        </div>
                        <button
                          onClick={() => handleFollow(suggestedUser.id)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-smooth ${
                            followedUsers.has(suggestedUser.id)
                              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          {followedUsers.has(suggestedUser.id) ? 'Suivi' : 'Suivre'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Tags populaires */}
                {tagStats.length > 0 && (
                  <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                    <h3 className="font-heading font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Hash size={20} className="text-blue-500" />
                      Tags populaires
                    </h3>
                    <div className="space-y-2">
                      {tagStats.map((stat) => (
                        <button
                          key={stat.tag}
                          onClick={() => setSelectedTag(stat.tag)}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-xl transition-smooth text-left"
                        >
                          <span className="text-sm font-medium text-gray-900">#{stat.tag}</span>
                          <span className="text-xs text-gray-600">{stat.count} posts</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Footer links */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                    <Link to="/cgu" className="hover:underline">CGU</Link>
                    <span>·</span>
                    <Link to="/mentions-legales" className="hover:underline">Mentions légales</Link>
                    <span>·</span>
                    <Link to="/politique-confidentialite" className="hover:underline">Confidentialité</Link>
                    <span>·</span>
                    <Link to="/contact" className="hover:underline">Contact</Link>
                  </div>
                  <p className="text-xs text-gray-500 mt-3">© 2024 Doogybook</p>
                </div>
                
              </div>
            </aside>
            
          </div>
        </div>
      </main>
      
      <Footer />
      
      {showCreatePost && (
        <CreatePostModal
          onClose={() => setShowCreatePost(false)}
          onSuccess={() => {
            setShowCreatePost(false);
            fetchPosts();
            fetchTopPosts();
            fetchTagStats();
            fetchUserStats();
          }}
        />
      )}
    </div>
  );
};

export default SocialFeed;
