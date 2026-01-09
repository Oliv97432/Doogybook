import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import UserMenuPro from '../../components/UserMenuPro';
import { 
  ArrowLeft, Home, Mail, Phone, MapPin, Dog, 
  Plus, Search, X, Check, Circle, Shield, MoreHorizontal
} from 'lucide-react';

const ProFosterFamilies = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [proAccount, setProAccount] = useState(null);
  const [fosterFamilies, setFosterFamilies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFamilyEmail, setNewFamilyEmail] = useState('');
  const [addingFamily, setAddingFamily] = useState(false);
  const [statusFilter, setStatusFilter] = useState('tous');
  const [expandedFamilyId, setExpandedFamilyId] = useState(null);

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
      await fetchFosterFamilies(account.id);
    } catch (error) {
      console.error('Erreur:', error);
      navigate('/pro/register');
    } finally {
      setLoading(false);
    }
  };

  const fetchFosterFamilies = async (proAccountId) => {
    try {
      const { data: families, error } = await supabase
        .from('contacts_with_current_dogs')
        .select('*')
        .eq('professional_account_id', proAccountId)
        .in('type', ['foster_family', 'both'])
        .not('user_id', 'is', null)
        .eq('status', 'active');

      if (error) {
        console.error('Erreur contacts:', error);
        throw error;
      }

      if (!families || families.length === 0) {
        setFosterFamilies([]);
        return;
      }

      const formattedFamilies = families.map(family => {
        const currentCount = family.current_dogs_count || 0;
        const maxCount = family.max_dogs || 1;
        
        let status = 'disponible';
        if (currentCount >= maxCount) {
          status = 'complet';
        } else if (family.on_vacation) {
          status = 'vacances';
        }
        
        return {
          id: family.user_id,
          full_name: family.full_name,
          email: family.email || '',
          phone: family.phone || '',
          address: family.address || '',
          city: family.city || '',
          created_at: family.created_at,
          status: status,
          current_dogs_count: currentCount,
          max_dogs: maxCount,
          on_vacation: family.on_vacation || false,
          is_verified: family.is_verified || false,
          dogs: Array.isArray(family.current_dogs) 
            ? family.current_dogs.map(dog => ({
                id: dog.dog_id,
                name: dog.dog_name,
                breed: dog.dog_breed,
                photo_url: dog.dog_photo_url
              }))
            : []
        };
      });

      setFosterFamilies(formattedFamilies);

    } catch (error) {
      console.error('Erreur chargement familles:', error);
      setFosterFamilies([]);
    }
  };

  const handleAddFamily = async () => {
    if (!newFamilyEmail.trim()) {
      alert('Veuillez entrer un email');
      return;
    }

    setAddingFamily(true);
    try {
      const { data: userProfile, error: findError } = await supabase
        .from('user_profiles')
        .select('id, full_name, email, phone')
        .eq('email', newFamilyEmail.toLowerCase().trim())
        .maybeSingle();

      if (findError) {
        console.error('Erreur recherche user:', findError);
        alert('Erreur lors de la recherche de l\'utilisateur');
        return;
      }

      if (!userProfile) {
        alert('Aucun utilisateur trouvé avec cet email. La personne doit d\'abord créer un compte Doogybook.');
        return;
      }

      const { data: existingContact, error: checkError } = await supabase
        .from('contacts')
        .select('id')
        .eq('professional_account_id', proAccount.id)
        .eq('user_id', userProfile.id)
        .maybeSingle();

      if (checkError) {
        console.error('Erreur vérification contact:', checkError);
        alert('Erreur lors de la vérification');
        return;
      }

      if (existingContact) {
        alert('Cette famille d\'accueil est déjà enregistrée.');
        return;
      }

      const { error: insertError } = await supabase
        .from('contacts')
        .insert({
          professional_account_id: proAccount.id,
          user_id: userProfile.id,
          full_name: userProfile.full_name,
          email: userProfile.email,
          phone: userProfile.phone || null,
          type: 'foster_family',
          status: 'active'
        });

      if (insertError) {
        console.error('Erreur insertion:', insertError);
        alert('Erreur lors de l\'ajout de la famille d\'accueil');
        return;
      }

      alert(`${userProfile.full_name || userProfile.email} a été ajouté(e) comme famille d'accueil.`);
      
      setShowAddModal(false);
      setNewFamilyEmail('');
      
      await fetchFosterFamilies(proAccount.id);
      
    } catch (error) {
      console.error('Erreur ajout famille:', error);
      alert('Erreur lors de l\'ajout de la famille d\'accueil');
    } finally {
      setAddingFamily(false);
    }
  };

  const filteredFamilies = fosterFamilies
    .filter(family => {
      const matchesSearch = 
        family.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.city?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'tous' || family.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

  const stats = {
    total: fosterFamilies.length,
    disponible: fosterFamilies.filter(f => f.status === 'disponible').length,
    complet: fosterFamilies.filter(f => f.status === 'complet').length,
    vacances: fosterFamilies.filter(f => f.status === 'vacances').length,
  };

  const toggleExpandFamily = (familyId) => {
    setExpandedFamilyId(expandedFamilyId === familyId ? null : familyId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/pro/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-700" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Familles d'accueil
                </h1>
                <p className="text-sm text-gray-600">
                  {fosterFamilies.length} famille{fosterFamilies.length > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Ajouter</span>
              </button>
              <UserMenuPro />
            </div>
          </div>

          {/* Barre de recherche et filtres */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une famille..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              />
            </div>

            {/* Filtres par statut */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('tous')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === 'tous' 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter('disponible')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  statusFilter === 'disponible' 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Circle size={10} fill="#10b981" className="text-green-500" />
                Disponible ({stats.disponible})
              </button>
              <button
                onClick={() => setStatusFilter('complet')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  statusFilter === 'complet' 
                    ? 'bg-orange-100 text-orange-800 border border-orange-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Circle size={10} fill="#f97316" className="text-orange-500" />
                Complet ({stats.complet})
              </button>
              <button
                onClick={() => setStatusFilter('vacances')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                  statusFilter === 'vacances' 
                    ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Circle size={10} fill="#3b82f6" className="text-blue-500" />
                En vacances ({stats.vacances})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {filteredFamilies.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Home size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'tous' ? 'Aucune famille trouvée' : 'Aucune famille d\'accueil'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Essayez avec d\'autres mots-clés'
                : statusFilter !== 'tous'
                ? `Aucune famille avec le statut "${statusFilter}"`
                : 'Les familles d\'accueil apparaîtront ici une fois ajoutées'
              }
            </p>
            {!searchTerm && statusFilter === 'tous' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Ajouter une famille d'accueil
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFamilies.map((family) => {
              const isExpanded = expandedFamilyId === family.id;
              const dogsToShow = isExpanded ? family.dogs : family.dogs.slice(0, 3);
              const hasMoreDogs = family.dogs.length > 3;

              return (
                <div
                  key={family.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Carte compacte */}
                  <div className="p-4 sm:p-6">
                    {/* En-tête famille */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-base font-bold">
                          {family.full_name?.charAt(0).toUpperCase() || 'F'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-bold text-gray-900">
                              {family.full_name || 'Famille d\'accueil'}
                            </h2>
                            {family.is_verified && (
                              <span className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                <Shield size={10} />
                                Vérifié
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              family.status === 'disponible' 
                                ? 'bg-green-100 text-green-800 border border-green-300' 
                                : family.status === 'complet'
                                ? 'bg-orange-100 text-orange-800 border border-orange-300'
                                : 'bg-blue-100 text-blue-800 border border-blue-300'
                            }`}>
                              {family.status === 'disponible' 
                                ? 'Disponible' 
                                : family.status === 'complet'
                                ? 'Complet'
                                : 'En vacances'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Informations de contact compactes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        {family.address && (
                          <div className="flex items-start gap-2">
                            <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">Adresse</p>
                              <p className="text-sm text-gray-900 truncate">
                                {family.address}{family.city ? `, ${family.city}` : ''}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {family.email && (
                          <div className="flex items-start gap-2">
                            <Mail size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">Email</p>
                              <a 
                                href={`mailto:${family.email}`}
                                className="text-sm text-blue-600 hover:underline truncate block"
                              >
                                {family.email}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        {family.phone && (
                          <div className="flex items-start gap-2">
                            <Phone size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-gray-500">Téléphone</p>
                              <a 
                                href={`tel:${family.phone}`}
                                className="text-sm text-gray-900 hover:text-blue-600 truncate block"
                              >
                                {family.phone}
                              </a>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-start gap-2">
                          <Dog size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500">Capacité</p>
                            <p className="text-sm text-gray-900 font-medium">
                              {family.current_dogs_count} chien{family.current_dogs_count !== 1 ? 's' : ''} sur {family.max_dogs}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Séparateur */}
                    <div className="border-t border-gray-200 my-4"></div>

                    {/* Section Chiens */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-base font-semibold text-gray-900">
                          Chiens actuellement accueillis
                          <span className="text-sm text-gray-500 font-normal ml-2">
                            ({family.dogs.length} chien{family.dogs.length !== 1 ? 's' : ''})
                          </span>
                        </h3>
                        {hasMoreDogs && (
                          <button
                            onClick={() => toggleExpandFamily(family.id)}
                            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            {isExpanded ? 'Voir moins' : `Voir tous (${family.dogs.length})`}
                            <MoreHorizontal size={16} />
                          </button>
                        )}
                      </div>

                      {family.dogs.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {dogsToShow.map((dog) => (
                            <div
                              key={dog.id}
                              onClick={() => navigate(`/pro/dogs/${dog.id}`)}
                              className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              {/* Photo du chien */}
                              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-green-100 to-blue-100 mb-2">
                                {dog.photo_url ? (
                                  <img
                                    src={dog.photo_url}
                                    alt={dog.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.parentElement.innerHTML = `
                                        <div class="w-full h-full flex items-center justify-center text-lg font-bold text-green-700">
                                          ${dog.name?.charAt(0).toUpperCase() || 'C'}
                                        </div>
                                      `;
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-lg font-bold text-green-700">
                                    {dog.name?.charAt(0).toUpperCase() || 'C'}
                                  </div>
                                )}
                              </div>
                              
                              {/* Infos du chien */}
                              <div className="text-center">
                                <h4 className="font-medium text-gray-900 text-sm truncate">{dog.name}</h4>
                                <p className="text-xs text-gray-600 truncate">{dog.breed || 'Non spécifié'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 bg-gray-50 rounded-lg">
                          <Dog size={32} className="text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-600 font-medium text-sm">Aucun chien actuellement accueilli</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                Ajouter une famille d'accueil
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Entrez l'email d'un utilisateur existant pour l'ajouter comme famille d'accueil.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email de la famille d'accueil
                </label>
                <input
                  type="email"
                  value={newFamilyEmail}
                  onChange={(e) => setNewFamilyEmail(e.target.value)}
                  placeholder="famille@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddFamily()}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleAddFamily}
                  disabled={addingFamily || !newFamilyEmail.trim()}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {addingFamily ? (
                    <>
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Ajouter
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProFosterFamilies;
