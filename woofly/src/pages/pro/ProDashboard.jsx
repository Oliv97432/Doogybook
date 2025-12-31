import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import TabNavigationPro from '../../components/TabNavigationPro';
import UserMenu from '../../components/UserMenu';
import Footer from '../../components/Footer';
import Icon from '../../components/AppIcon';
import { 
  Plus, TrendingUp, Home, Heart, CheckCircle, 
  Search, Filter, Eye, Edit, UserPlus, UserMinus
} from 'lucide-react';

const ProDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [proAccount, setProAccount] = useState(null);
  const [dogs, setDogs] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    inFoster: 0,
    pending: 0,
    adopted: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (user) {
      fetchProAccount();
    }
  }, [user]);

  const fetchProAccount = async () => {
    try {
      const { data: account, error } = await supabase
        .from('professional_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProAccount(account);
      await fetchDogs(account.id);
    } catch (error) {
      console.error('Erreur chargement compte pro:', error);
    }
  };

  const fetchDogs = async (proAccountId) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select(`
          *,
          foster_user:foster_family_user_id(
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('professional_account_id', proAccountId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const dogsData = data || [];
      setDogs(dogsData);

      const newStats = {
        total: dogsData.length,
        available: dogsData.filter(d => d.adoption_status === 'available' && !d.foster_family_user_id).length,
        inFoster: dogsData.filter(d => d.foster_family_user_id).length,
        pending: dogsData.filter(d => d.adoption_status === 'pending').length,
        adopted: dogsData.filter(d => d.adoption_status === 'adopted').length
      };
      setStats(newStats);

    } catch (error) {
      console.error('Erreur chargement chiens:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (dog) => {
    if (dog.foster_family_user_id) {
      return {
        text: 'En famille d\'accueil',
        color: 'bg-purple-100 text-purple-700',
        icon: 'Home'
      };
    }
    
    switch (dog.adoption_status) {
      case 'available':
        return {
          text: 'Disponible',
          color: 'bg-green-100 text-green-700',
          icon: 'Heart'
        };
      case 'pending':
        return {
          text: 'En cours',
          color: 'bg-orange-100 text-orange-700',
          icon: 'TrendingUp'
        };
      case 'adopted':
        return {
          text: 'Adopté',
          color: 'bg-gray-100 text-gray-700',
          icon: 'CheckCircle'
        };
      default:
        return {
          text: 'Inconnu',
          color: 'bg-gray-100 text-gray-500',
          icon: 'Heart'
        };
    }
  };

  const filteredDogs = dogs.filter(dog => {
    const matchesSearch = dog.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dog.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'foster') return matchesSearch && dog.foster_family_user_id;
    if (filterStatus === 'available') return matchesSearch && dog.adoption_status === 'available' && !dog.foster_family_user_id;
    
    return matchesSearch && dog.adoption_status === filterStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-foreground">
                Tableau de bord
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {proAccount?.organization_name}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => navigate('/pro/dogs/new')}
                className="px-3 sm:px-4 py-2 sm:py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium flex items-center gap-2 transition-smooth min-h-[44px] shadow-md"
              >
                <Plus size={18} className="sm:size-5" />
                <span className="hidden sm:inline">Ajouter un chien</span>
                <span className="sm:hidden">Ajouter</span>
              </button>
              <UserMenu />
            </div>
          </div>
        </div>
      </div>

      <TabNavigationPro />

      <main className="main-content flex-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
          
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Icon name="PawPrint" size={24} className="opacity-80" />
                <div className="text-3xl sm:text-4xl font-bold">{stats.total}</div>
              </div>
              <p className="text-sm sm:text-base font-medium opacity-90">Total chiens</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Heart size={24} className="opacity-80" />
                <div className="text-3xl sm:text-4xl font-bold">{stats.available}</div>
              </div>
              <p className="text-sm sm:text-base font-medium opacity-90">Disponibles</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Home size={24} className="opacity-80" />
                <div className="text-3xl sm:text-4xl font-bold">{stats.inFoster}</div>
              </div>
              <p className="text-sm sm:text-base font-medium opacity-90">En FA</p>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp size={24} className="opacity-80" />
                <div className="text-3xl sm:text-4xl font-bold">{stats.pending}</div>
              </div>
              <p className="text-sm sm:text-base font-medium opacity-90">En cours</p>
            </div>

            <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-4 sm:p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle size={24} className="opacity-80" />
                <div className="text-3xl sm:text-4xl font-bold">{stats.adopted}</div>
              </div>
              <p className="text-sm sm:text-base font-medium opacity-90">Adoptés</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl shadow-soft overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-border">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Rechercher un chien..."
                    className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-background"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base bg-background min-h-[44px]"
                >
                  <option value="all">Tous les chiens</option>
                  <option value="available">Disponibles</option>
                  <option value="foster">En famille d'accueil</option>
                  <option value="pending">En cours d'adoption</option>
                  <option value="adopted">Adoptés</option>
                </select>
              </div>
            </div>

            {filteredDogs.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Dog" size={40} color="var(--color-muted-foreground)" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Aucun chien trouvé</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm ? 'Essayez une autre recherche' : 'Commencez par ajouter votre premier chien'}
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => navigate('/pro/dogs/new')}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-smooth inline-flex items-center gap-2"
                  >
                    <Plus size={20} />
                    Ajouter un chien
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6">
                {filteredDogs.map((dog) => {
                  const status = getStatusBadge(dog);
                  
                  return (
                    <div 
                      key={dog.id}
                      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer"
                      onClick={() => navigate(`/pro/dogs/${dog.id}`)}
                    >
                      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-blue-400 to-purple-500">
                        {dog.photo_url ? (
                          <img 
                            src={dog.photo_url} 
                            alt={dog.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl text-white font-bold">
                              {dog.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        
                        {dog.is_urgent && (
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
                              URGENT
                            </span>
                          </div>
                        )}
                        
                        <div className="absolute top-3 right-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 ${status.color}`}>
                            <Icon name={status.icon} size={14} />
                            {status.text}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-bold text-lg text-foreground mb-1 truncate group-hover:text-primary transition-colors">
                          {dog.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 truncate">{dog.breed}</p>
                        
                        {dog.foster_family_user_id && dog.foster_user && (
                          <div className="mb-3 p-2 bg-purple-50 rounded-lg">
                            <p className="text-xs text-purple-700 flex items-center gap-1">
                              <Home size={12} />
                              FA: {dog.foster_user.first_name} {dog.foster_user.last_name}
                            </p>
                          </div>
                        )}
                        
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/adoption/${dog.id}`);
                            }}
                            className="flex-1 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg flex items-center justify-center gap-1 text-sm transition-smooth min-h-[44px]"
                          >
                            <Eye size={16} />
                            Voir
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/pro/dogs/${dog.id}`);
                            }}
                            className="flex-1 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg flex items-center justify-center gap-1 text-sm transition-smooth min-h-[44px]"
                          >
                            <Edit size={16} />
                            Gérer
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProDashboard;
