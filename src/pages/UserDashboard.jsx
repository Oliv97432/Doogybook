import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import TabNavigation from '../components/TabNavigation';
import UserMenu from '../components/UserMenu';
import Icon from '../components/AppIcon';
import CreateDogModal from './dog-profile/components/CreateDogModal';

const UserDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [showCreateDogModal, setShowCreateDogModal] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Charger les chiens avec toutes leurs données
      const { data: dogsData, error: dogsError } = await supabase
        .from('dogs')
        .select(`
          *,
          vaccinations (count),
          treatments (count),
          weight_records (count),
          dog_photos (count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (dogsError) throw dogsError;

      // Pour chaque chien, calculer des statistiques
      const dogsWithStats = await Promise.all(
        (dogsData || []).map(async (dog) => {
          // Récupérer le dernier poids
          const { data: lastWeight } = await supabase
            .from('weight_records')
            .select('weight, date')
            .eq('dog_id', dog.id)
            .order('date', { ascending: false })
            .limit(1)
            .single();

          // Récupérer les prochains vaccins à venir
          const { data: upcomingVaccinations } = await supabase
            .from('vaccinations')
            .select('*')
            .eq('dog_id', dog.id)
            .gte('next_due_date', new Date().toISOString().split('T')[0])
            .order('next_due_date', { ascending: true })
            .limit(2);

          // Récupérer les prochains traitements à venir
          const { data: upcomingTreatments } = await supabase
            .from('treatments')
            .select('*')
            .eq('dog_id', dog.id)
            .gte('next_due_date', new Date().toISOString().split('T')[0])
            .order('next_due_date', { ascending: true })
            .limit(2);

          // Calculer l'âge
          const birthDate = new Date(dog.birth_date);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const monthDiff = today.getMonth() - birthDate.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }

          return {
            ...dog,
            age,
            lastWeight: lastWeight?.weight || dog.weight,
            upcomingVaccinations: upcomingVaccinations || [],
            upcomingTreatments: upcomingTreatments || [],
            totalVaccinations: dog.vaccinations?.[0]?.count || 0,
            totalTreatments: dog.treatments?.[0]?.count || 0,
            totalWeights: dog.weight_records?.[0]?.count || 0,
            totalPhotos: dog.dog_photos?.[0]?.count || 0
          };
        })
      );

      setDogs(dogsWithStats);

      // Statistiques globales
      setStats({
        totalDogs: dogsWithStats.length,
        totalPhotos: dogsWithStats.reduce((sum, dog) => sum + dog.totalPhotos, 0),
        totalVaccinations: dogsWithStats.reduce((sum, dog) => sum + dog.totalVaccinations, 0),
        totalTreatments: dogsWithStats.reduce((sum, dog) => sum + dog.totalTreatments, 0)
      });
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGenderIcon = (gender) => {
    return gender === 'male' ? '♂' : '♀';
  };

  const getGenderColor = (gender) => {
    return gender === 'male' ? 'text-blue-600' : 'text-pink-600';
  };

  const getSizeLabel = (size) => {
    const labels = {
      small: 'Petit',
      medium: 'Moyen',
      large: 'Grand'
    };
    return labels[size] || size;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mon Tableau de Bord</h1>
              <p className="text-sm text-gray-600 mt-1">
                Gérez vos {dogs.length} {dogs.length > 1 ? 'compagnons' : 'compagnon'}
              </p>
            </div>
            <UserMenu />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistiques globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => dogs.length > 0 && navigate(`/dog-profile/${dogs[0].id}`)}
            disabled={dogs.length === 0}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all text-left disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chiens</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDogs}</p>
              </div>
              <div className="text-3xl">🐕</div>
            </div>
          </button>

          <button
            onClick={() => dogs.length > 0 && navigate(`/dog-profile/${dogs[0].id}`)}
            disabled={dogs.length === 0}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all text-left disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Photos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPhotos}</p>
              </div>
              <div className="text-3xl">📸</div>
            </div>
          </button>

          <button
            onClick={() => dogs.length > 0 && navigate(`/dog-profile/${dogs[0].id}`)}
            disabled={dogs.length === 0}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all text-left disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vaccins</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVaccinations}</p>
              </div>
              <div className="text-3xl">💉</div>
            </div>
          </button>

          <button
            onClick={() => dogs.length > 0 && navigate(`/dog-profile/${dogs[0].id}`)}
            disabled={dogs.length === 0}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-indigo-200 transition-all text-left disabled:cursor-not-allowed disabled:hover:shadow-sm disabled:hover:border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Traitements</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTreatments}</p>
              </div>
              <div className="text-3xl">💊</div>
            </div>
          </button>
        </div>

        {/* Bouton ajouter un chien */}
        <div className="mb-6">
          <button
            onClick={() => {
              console.log('🐕 UserDashboard: Clic sur Ajouter un chien');
              setShowCreateDogModal(true);
            }}
            className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Icon name="add" className="w-5 h-5" />
            Ajouter un chien
          </button>
        </div>

        {/* Liste des chiens */}
        {dogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">🐕</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Aucun chien enregistré
            </h2>
            <p className="text-gray-600 mb-6">
              Commencez par ajouter votre premier compagnon
            </p>
            <button
              onClick={() => {
                console.log('🐕 UserDashboard: Clic sur Ajouter mon premier chien');
                setShowCreateDogModal(true);
              }}
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Ajouter mon premier chien
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {dogs.map((dog) => (
              <div
                key={dog.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100"
              >
                {/* Cover photo */}
                <div className="relative h-32 bg-gradient-to-r from-indigo-400 to-purple-400">
                  {dog.cover_photo_url && (
                    <img
                      src={dog.cover_photo_url}
                      alt="Couverture"
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => navigate(`/dog-profile/${dog.id}`)}
                      className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-sm font-medium text-gray-700 rounded-lg hover:bg-white transition-colors"
                    >
                      Gérer
                    </button>
                  </div>
                </div>

                {/* Profile content */}
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Avatar */}
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border-4 border-white -mt-10 shadow-lg">
                      {dog.photo_url ? (
                        <img
                          src={dog.photo_url}
                          alt={dog.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                          🐕
                        </div>
                      )}
                    </div>

                    {/* Name and breed */}
                    <div className="flex-1 pt-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-gray-900">{dog.name}</h3>
                        <span className={`text-2xl ${getGenderColor(dog.gender)}`}>
                          {getGenderIcon(dog.gender)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{dog.breed}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span>{dog.age} an{dog.age > 1 ? 's' : ''}</span>
                        <span>•</span>
                        <span>{getSizeLabel(dog.size)}</span>
                        <span>•</span>
                        <span>{dog.lastWeight} kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Photos</p>
                      <p className="text-lg font-bold text-gray-900">{dog.totalPhotos}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Vaccins</p>
                      <p className="text-lg font-bold text-gray-900">{dog.totalVaccinations}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Soins</p>
                      <p className="text-lg font-bold text-gray-900">{dog.totalTreatments}</p>
                    </div>
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Pesées</p>
                      <p className="text-lg font-bold text-gray-900">{dog.totalWeights}</p>
                    </div>
                  </div>

                  {/* Upcoming events */}
                  {(dog.upcomingVaccinations.length > 0 || dog.upcomingTreatments.length > 0) && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-600 uppercase">À venir</p>
                      {dog.upcomingVaccinations.slice(0, 2).map((vaccination) => (
                        <div
                          key={vaccination.id}
                          className="flex items-center gap-2 text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded-lg"
                        >
                          <span>💉</span>
                          <span>{vaccination.vaccine_name}</span>
                          <span className="ml-auto text-xs">
                            {new Date(vaccination.next_due_date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      ))}
                      {dog.upcomingTreatments.slice(0, 2).map((treatment) => (
                        <div
                          key={treatment.id}
                          className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-3 py-2 rounded-lg"
                        >
                          <span>💊</span>
                          <span>{treatment.treatment_type === 'vermifuge' ? 'Vermifuge' : 'Anti-puces'}</span>
                          <span className="ml-auto text-xs">
                            {new Date(treatment.next_due_date).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <TabNavigation />

      {/* Modal de création de chien */}
      <CreateDogModal
        isOpen={showCreateDogModal}
        onClose={() => setShowCreateDogModal(false)}
        onSuccess={() => {
          setShowCreateDogModal(false);
          // Recharger les données du dashboard
          loadDashboardData();
        }}
        userId={user?.id}
      />
    </div>
  );
};

export default UserDashboard;
