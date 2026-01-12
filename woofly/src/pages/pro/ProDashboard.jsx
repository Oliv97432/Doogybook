import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import TabNavigationPro from '../../components/TabNavigationPro';
import UserMenuPro from '../../components/UserMenuPro';
import ContactListModal from '../../components/ContactListModal';
import VerifiedBadge from '../../components/VerifiedBadge';
import { 
  Plus, Search, Heart, Users, CheckCircle, Clock, 
  TrendingUp, Calendar, Home, AlertCircle
} from 'lucide-react';

// ==========================================
// 🎨 HELPER OPTIMISATION IMAGES
// ==========================================
const getOptimizedImageUrl = (url, width = 800, quality = 75) => {
  if (!url) return null;
  
  if (url.includes('supabase.co') && url.includes('storage/v1/object/public')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width}&quality=${quality}&format=webp`;
  }
  
  return url;
};

// ==========================================
// 🎨 SKELETON SCREENS
// ==========================================
const DogCardSkeleton = () => (
  <div className="bg-card rounded-2xl overflow-hidden shadow-soft border border-border animate-pulse">
    <div className="aspect-square bg-gray-200" />
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-8 bg-gray-200 rounded" />
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div className="bg-gray-100 rounded-xl p-4 border border-gray-200 animate-pulse">
    <div className="flex items-center justify-between mb-2">
      <div className="w-10 h-10 bg-gray-200 rounded-lg" />
    </div>
    <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
    <div className="h-4 bg-gray-200 rounded w-24" />
  </div>
);

// ==========================================
// 🎨 STAT CARD COMPONENT (MEMOIZED)
// ==========================================
const StatCard = memo(({ 
  icon: Icon, 
  label, 
  value, 
  onClick, 
  gradient, 
  iconBg, 
  textColor,
  subtitle 
}) => (
  <button
    onClick={onClick}
    className={`${gradient} rounded-xl p-4 border hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer text-left min-h-[120px]`}
  >
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 ${iconBg} rounded-lg`}>
        <Icon size={20} className="text-white" />
      </div>
      {value > 0 && <TrendingUp size={16} className={textColor} />}
    </div>
    <p className={`text-2xl sm:text-3xl font-bold ${textColor} mb-1`}>{value}</p>
    <p className={`text-xs sm:text-sm ${textColor}`}>{label}</p>
    {subtitle && (
      <p className={`text-xs ${textColor} font-medium mt-1 opacity-80`}>{subtitle}</p>
    )}
  </button>
));

StatCard.displayName = 'StatCard';

// ==========================================
// 🎨 DOG CARD COMPONENT (MEMOIZED + OPTIMIZED)
// ==========================================
const DogCard = memo(({ dog, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const getStatusBadge = () => {
    if (dog.foster_family_contact_id) {
      return {
        text: 'En FA',
        icon: Home,
        color: 'bg-purple-100 text-purple-700 border-purple-200'
      };
    }
    
    switch (dog.adoption_status) {
      case 'available':
        return {
          text: 'Disponible',
          icon: Heart,
          color: 'bg-green-100 text-green-700 border-green-200'
        };
      case 'pending':
        return {
          text: 'En cours',
          icon: Clock,
          color: 'bg-orange-100 text-orange-700 border-orange-200'
        };
      case 'adopted':
        return {
          text: 'Adopté',
          icon: CheckCircle,
          color: 'bg-gray-100 text-gray-700 border-gray-200'
        };
      default:
        return {
          text: 'Inconnu',
          icon: AlertCircle,
          color: 'bg-gray-100 text-gray-500 border-gray-200'
        };
    }
  };

  const badge = getStatusBadge();
  const StatusIcon = badge.icon;
  
  // Calcul de l'âge
  const age = dog.birth_date 
    ? new Date().getFullYear() - new Date(dog.birth_date).getFullYear()
    : null;

  return (
    <div
      onClick={onClick}
      className="group bg-card rounded-2xl overflow-hidden shadow-soft border border-border hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
    >
      {/* Image optimisée avec lazy loading */}
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
        {!imageLoaded && dog.photo_url && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        
        {dog.photo_url ? (
          <img
            src={getOptimizedImageUrl(dog.photo_url, 400, 75)}
            alt={dog.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-bold text-primary/30">
              {dog.name?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Badge URGENT */}
        {dog.is_urgent && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
              URGENT
            </span>
          </div>
        )}

        {/* Badge statut */}
        <div className="absolute top-3 right-3">
          <div className={`px-2.5 py-1.5 rounded-full text-xs font-bold border shadow-lg backdrop-blur-sm ${badge.color}`}>
            <div className="flex items-center gap-1.5">
              <StatusIcon size={14} />
              <span className="hidden sm:inline">{badge.text}</span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Infos chien */}
      <div className="p-4">
        <h3 className="font-heading font-bold text-lg text-foreground mb-1 truncate group-hover:text-primary transition-colors">
          {dog.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 truncate">
          {dog.breed}
        </p>

        {/* FA info */}
        {dog.foster_family_contact_id && dog.foster_family && (
          <div className="flex items-center gap-2 text-xs text-purple-600 bg-purple-50 rounded-lg p-2.5 mb-3">
            <Home size={14} className="flex-shrink-0" />
            <span className="truncate">Chez {dog.foster_family.full_name}</span>
          </div>
        )}

        {/* Détails */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {dog.gender && (
            <div className="flex items-center gap-1">
              <span>{dog.gender === 'male' ? '♂️' : '♀️'}</span>
              <span className="hidden xs:inline">{dog.gender === 'male' ? 'Mâle' : 'Femelle'}</span>
            </div>
          )}
          {age && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{age} an{age > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

DogCard.displayName = 'DogCard';

// ==========================================
// 🎨 APPLICATION CARD (MEMOIZED)
// ==========================================
const ApplicationCard = memo(({ application, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      className="bg-card rounded-xl shadow-soft border border-border p-4 hover:shadow-lg transition-all cursor-pointer min-h-[88px]"
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Photo chien */}
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0">
          {!imageLoaded && application.dog?.photo_url && (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
          
          {application.dog?.photo_url ? (
            <img
              src={getOptimizedImageUrl(application.dog.photo_url, 200, 70)}
              alt={application.dog.name}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary/30">
              {application.dog?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Info candidature */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate mb-1">
            {application.applicant?.full_name}
          </h3>
          <p className="text-sm text-muted-foreground truncate mb-2">
            Pour {application.dog?.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {new Date(application.created_at).toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Badge statut */}
        <div className="flex-shrink-0">
          <span className="px-3 py-1.5 bg-orange-100 text-orange-700 text-xs font-medium rounded-full whitespace-nowrap">
            En attente
          </span>
        </div>
      </div>
    </div>
  );
});

ApplicationCard.displayName = 'ApplicationCard';

// ==========================================
// 🎨 MAIN COMPONENT
// ==========================================
const ProDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [proAccount, setProAccount] = useState(null);
  const [dogs, setDogs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [fosterFamilies, setFosterFamilies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // États modals
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalItems, setModalItems] = useState([]);
  const [modalType, setModalType] = useState('dogs');

  useEffect(() => {
    // Attendre que l'auth soit chargé
    if (authLoading) return;
    
    // Si pas d'utilisateur, rediriger vers login
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchProAccount();
  }, [user, authLoading]);

  const fetchProAccount = async () => {
    try {
      console.log('ProDashboard: Fetching pro account for user:', user.id);
      
      const { data: account, error } = await supabase
        .from('professional_accounts')
        .select('id, organization_name, account_type, is_verified, is_active')
        .eq('user_id', user.id)
        .maybeSingle(); // Utiliser maybeSingle pour éviter les erreurs si pas de résultat

      console.log('ProDashboard: Pro account result:', { account, error });

      if (error) {
        console.error('ProDashboard: Erreur requête:', error);
        navigate('/pro/register');
        return;
      }
      
      if (!account) {
        console.log('ProDashboard: Aucun compte pro trouvé, redirection vers register');
        navigate('/pro/register');
        return;
      }
      
      console.log('ProDashboard: Compte pro trouvé:', account.organization_name);
      setProAccount(account);
      
      await Promise.all([
        fetchDogs(account.id),
        fetchApplications(account.id),
        fetchFosterFamilies(account.id)
      ]);
    } catch (error) {
      console.error('ProDashboard: Erreur générale:', error);
      navigate('/pro/register');
    } finally {
      setLoading(false);
    }
  };

  const fetchDogs = async (proAccountId) => {
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select(`
          id,
          name,
          breed,
          photo_url,
          gender,
          birth_date,
          adoption_status,
          is_urgent,
          foster_family_contact_id,
          foster_family:contacts!dogs_foster_family_contact_id_fkey(
            id,
            full_name
          )
        `)
        .eq('professional_account_id', proAccountId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setDogs(data || []);
    } catch (error) {
      console.error('Erreur chargement chiens:', error);
      setDogs([]);
    }
  };

  const fetchApplications = async (proAccountId) => {
    try {
      const { data: applicationsData, error: appsError } = await supabase
        .from('adoption_applications')
        .select(`
          id,
          user_id,
          created_at,
          status,
          dogs!adoption_applications_dog_id_fkey(id, name, photo_url)
        `)
        .eq('professional_account_id', proAccountId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(20);

      if (appsError) throw appsError;

      if (applicationsData && applicationsData.length > 0) {
        const userIds = applicationsData.map(app => app.user_id);
        
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('id, full_name, email')
          .in('id', userIds);

        const formattedData = applicationsData.map(app => {
          const profile = profiles?.find(p => p.id === app.user_id);
          return {
            ...app,
            dog: app.dogs,
            applicant: profile || { 
              id: app.user_id, 
              full_name: 'Utilisateur inconnu', 
              email: 'N/A' 
            }
          };
        });

        setApplications(formattedData);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error('Erreur chargement candidatures:', error);
      setApplications([]);
    }
  };

  const fetchFosterFamilies = async (proAccountId) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, full_name, type, availability, max_dogs, current_dogs_count')
        .eq('professional_account_id', proAccountId)
        .or('type.eq.foster_family,type.eq.both')
        .order('full_name', { ascending: true });

      if (error) throw error;
      setFosterFamilies(data || []);
    } catch (error) {
      console.error('Erreur chargement familles:', error);
      setFosterFamilies([]);
    }
  };

  // Handlers avec useCallback pour éviter re-renders
  const handleTotalDogsClick = useCallback(() => {
    setModalTitle(`Total chiens (${dogs.length})`);
    setModalItems(dogs);
    setModalType('dogs');
    setShowModal(true);
  }, [dogs]);

  const handleAvailableDogsClick = useCallback(() => {
    const availableDogs = dogs.filter(d => d.adoption_status === 'available' && !d.foster_family_contact_id);
    setModalTitle(`Chiens disponibles (${availableDogs.length})`);
    setModalItems(availableDogs);
    setModalType('dogs');
    setShowModal(true);
  }, [dogs]);

  const handleInFosterClick = useCallback(() => {
    const inFosterDogs = dogs.filter(d => d.foster_family_contact_id);
    setModalTitle(`Chiens en famille d'accueil (${inFosterDogs.length})`);
    setModalItems(inFosterDogs);
    setModalType('dogs');
    setShowModal(true);
  }, [dogs]);

  const handlePendingClick = useCallback(() => {
    const pendingDogs = dogs.filter(d => d.adoption_status === 'pending');
    setModalTitle(`Chiens en cours d'adoption (${pendingDogs.length})`);
    setModalItems(pendingDogs);
    setModalType('dogs');
    setShowModal(true);
  }, [dogs]);

  const handleApplicationsClick = useCallback(() => {
    navigate('/pro/applications');
  }, [navigate]);

  const handleFACardClick = useCallback(() => {
    setModalTitle(`Familles d'accueil (${fosterFamilies.length})`);
    setModalItems(fosterFamilies);
    setModalType('contacts');
    setShowModal(true);
  }, [fosterFamilies]);

  const handleDogClick = useCallback((dogId) => {
    navigate(`/pro/dogs/${dogId}`);
  }, [navigate]);

  const handleApplicationClick = useCallback((appId) => {
    navigate(`/pro/applications/${appId}`);
  }, [navigate]);

  // Stats calculées
  const stats = {
    total: dogs.length,
    available: dogs.filter(d => d.adoption_status === 'available' && !d.foster_family_contact_id).length,
    inFoster: dogs.filter(d => d.foster_family_contact_id).length,
    pending: dogs.filter(d => d.adoption_status === 'pending').length,
    applications: applications.length,
    totalFosterFamilies: fosterFamilies.length,
    availablePlaces: fosterFamilies
      .filter(fa => fa.availability === 'available')
      .reduce((sum, fa) => sum + (fa.max_dogs - (fa.current_dogs_count || 0)), 0)
  };

  // Filtrage optimisé
  const filteredDogs = dogs.filter(dog => {
    const matchesSearch = searchTerm === '' || 
      dog.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dog.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    if (filterStatus === 'available') {
      matchesFilter = dog.adoption_status === 'available' && !dog.foster_family_contact_id;
    } else if (filterStatus === 'foster') {
      matchesFilter = !!dog.foster_family_contact_id;
    } else if (filterStatus === 'pending') {
      matchesFilter = dog.adoption_status === 'pending';
    }
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de votre espace professionnel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header sticky optimisé */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          {/* Titre + Actions */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex-1 min-w-0 mr-3">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold text-foreground mb-1 truncate">
                {proAccount?.organization_name || 'Mon Refuge'}
              </h1>
              <div className="flex items-center gap-2">
                <VerifiedBadge size="sm" />
                <span className="text-xs text-muted-foreground truncate">Compte certifié par Doogybook</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/pro/dogs/new')}
                className="px-3 sm:px-4 lg:px-6 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-smooth flex items-center gap-2 shadow-soft min-h-[44px] text-sm sm:text-base"
              >
                <Plus size={18} className="sm:w-5 sm:h-5" />
                <span className="hidden xs:inline">Nouveau</span>
              </button>
              <UserMenuPro />
            </div>
          </div>

          {/* Stats Cards - Grid responsive */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
              {[...Array(6)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 lg:gap-4">
              <StatCard
                icon={Heart}
                label="Total chiens"
                value={stats.total}
                onClick={handleTotalDogsClick}
                gradient="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
                iconBg="bg-blue-500"
                textColor="text-blue-900"
              />
              
              <StatCard
                icon={Heart}
                label="Disponibles"
                value={stats.available}
                onClick={handleAvailableDogsClick}
                gradient="bg-gradient-to-br from-green-50 to-green-100 border-green-200"
                iconBg="bg-green-500"
                textColor="text-green-900"
              />
              
              <StatCard
                icon={Home}
                label="En FA"
                value={stats.inFoster}
                onClick={handleInFosterClick}
                gradient="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"
                iconBg="bg-purple-500"
                textColor="text-purple-900"
              />
              
              <StatCard
                icon={Clock}
                label="En cours"
                value={stats.pending}
                onClick={handlePendingClick}
                gradient="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
                iconBg="bg-orange-500"
                textColor="text-orange-900"
              />
              
              <StatCard
                icon={Users}
                label="Candidatures"
                value={stats.applications}
                onClick={handleApplicationsClick}
                gradient="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200"
                iconBg="bg-pink-500"
                textColor="text-pink-900"
              />
              
              <StatCard
                icon={Home}
                label="Familles FA"
                value={stats.totalFosterFamilies}
                onClick={handleFACardClick}
                gradient="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200"
                iconBg="bg-teal-500"
                textColor="text-teal-900"
                subtitle={`${stats.availablePlaces} places dispo`}
              />
            </div>
          )}
        </div>
      </div>

      <TabNavigationPro />

      {/* Main Content */}
      <main className="main-content flex-1 pb-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {/* Search + Filters */}
          <div className="bg-card rounded-xl shadow-soft p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher un chien..."
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-sm min-h-[44px]"
                />
              </div>

              {/* Filter buttons */}
              <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-smooth min-h-[44px] ${
                    filterStatus === 'all'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterStatus('available')}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-smooth min-h-[44px] ${
                    filterStatus === 'available'
                      ? 'bg-green-500 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Disponibles
                </button>
                <button
                  onClick={() => setFilterStatus('foster')}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-smooth min-h-[44px] ${
                    filterStatus === 'foster'
                      ? 'bg-purple-500 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  En FA
                </button>
                <button
                  onClick={() => setFilterStatus('pending')}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-smooth min-h-[44px] ${
                    filterStatus === 'pending'
                      ? 'bg-orange-500 text-white'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  En cours
                </button>
              </div>
            </div>
          </div>

          {/* Dogs Grid */}
          {loading ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <DogCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredDogs.length === 0 ? (
            <div className="bg-card rounded-xl shadow-soft p-8 sm:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="sm:w-10 sm:h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-2">
                Aucun chien trouvé
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6">
                {searchTerm 
                  ? 'Essayez avec d\'autres mots-clés'
                  : 'Commencez par ajouter votre premier chien'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => navigate('/pro/dogs/new')}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-smooth inline-flex items-center gap-2 min-h-[44px]"
                >
                  <Plus size={20} />
                  Ajouter un chien
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {filteredDogs.map((dog) => (
                <DogCard
                  key={dog.id}
                  dog={dog}
                  onClick={() => handleDogClick(dog.id)}
                />
              ))}
            </div>
          )}

          {/* Recent Applications */}
          {applications.length > 0 && (
            <div className="mt-6 sm:mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                  Candidatures récentes
                </h2>
                <button
                  onClick={() => navigate('/pro/applications')}
                  className="text-primary hover:text-primary/80 font-medium text-sm min-h-[44px] px-3"
                >
                  Voir tout →
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {applications.slice(0, 4).map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    onClick={() => handleApplicationClick(app.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      <ContactListModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        items={modalItems}
        type={modalType}
      />
    </div>
  );
};

export default ProDashboard;
