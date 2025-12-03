import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import TabNavigation from '../../components/TabNavigation';
import ProfileSwitcher from '../../components/ProfileSwitcher';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Checkbox } from '../../components/ui/Checkbox';
import DogProfileCard from './components/DogProfileCard';
import AddDogCard from './components/AddDogCard';
import BulkActionsBar from './components/BulkActionsBar';
import SearchFilterBar from './components/SearchFilterBar';
import EmptyState from './components/EmptyState';
import AddDogModal from './components/AddDogModal';

const MultiProfileManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dogProfiles, setDogProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBreed, setFilterBreed] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  // Charger les chiens depuis Supabase
  useEffect(() => {
    if (!user?.id) return;

    const fetchDogs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('dogs')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erreur chargement chiens:', error);
          setDogProfiles([]);
        } else {
          const formattedProfiles = data.map(dog => {
            const birthDate = new Date(dog.birth_date);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }

            return {
              id: dog.id,
              name: dog.name,
              breed: dog.breed || 'Race inconnue',
              age: age > 0 ? `${age} an${age > 1 ? 's' : ''}` : 'Moins d\'un an',
              weight: dog.weight ? `${dog.weight} kg` : 'Non renseigné',
              image: dog.photo_url || 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg',
              imageAlt: `${dog.name} - ${dog.breed}`,
              healthStatus: 'good',
              upcomingReminders: [],
              recentActivity: `Dernière mise à jour le ${new Date(dog.updated_at).toLocaleDateString('fr-FR')}`
            };
          });

          setDogProfiles(formattedProfiles);
          if (formattedProfiles.length > 0 && !activeProfileId) {
            setActiveProfileId(formattedProfiles[0].id);
          }
        }
      } catch (err) {
        console.error('Erreur:', err);
        setDogProfiles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, [user?.id]);

  const breedOptions = [
    { value: '', label: 'Toutes les races' },
    { value: 'malinois', label: 'Malinois' },
    { value: 'shih-tzu', label: 'Shih-Tzu' },
    { value: 'american-bully', label: 'American Bully' },
    { value: 'labrador', label: 'Labrador' },
    { value: 'bouledogue-francais', label: 'Bouledogue Français' },
    { value: 'golden-retriever', label: 'Golden Retriever' },
    { value: 'berger-allemand', label: 'Berger Allemand' },
    { value: 'chihuahua', label: 'Chihuahua' },
    { value: 'husky', label: 'Husky Sibérien' },
    { value: 'beagle', label: 'Beagle' },
    { value: 'mixed', label: 'Race Mixte' },
    { value: 'other', label: 'Autre' }
  ];

  const filteredProfiles = dogProfiles?.filter((profile) => {
    const matchesSearch = profile?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesBreed = !filterBreed || profile?.breed?.toLowerCase()?.replace(/\s+/g, '-') === filterBreed;
    return matchesSearch && matchesBreed;
  });

  const handleSelectProfile = (profileId) => {
    if (isBulkMode) {
      setSelectedProfiles((prev) =>
        prev?.includes(profileId)
          ? prev?.filter((id) => id !== profileId)
          : [...prev, profileId]
      );
    } else {
      setActiveProfileId(profileId);
      navigate('/dog-profile');
    }
  };

  const handleEditProfile = (profileId) => {
    setActiveProfileId(profileId);
    navigate('/dog-profile');
  };

  const handleAddDog = async (formData) => {
    try {
      // Calculer la date de naissance
      const calculateBirthDate = (age, ageUnit) => {
        const today = new Date();
        let birthDate = new Date(today);
        
        if (ageUnit === 'years') {
          birthDate.setFullYear(today.getFullYear() - parseInt(age));
        } else {
          birthDate.setMonth(today.getMonth() - parseInt(age));
        }
        
        return birthDate.toISOString().split('T')[0];
      };

      const birthDate = calculateBirthDate(
        formData?.age || 0,
        formData?.ageUnit || 'years'
      );

      // Insérer dans Supabase avec gender et is_sterilized
      const { data, error } = await supabase
        .from('dogs')
        .insert([{
          user_id: user?.id,
          name: formData?.name,
          breed: formData?.breed,
          birth_date: birthDate,
          weight: formData?.weight ? parseFloat(formData.weight) : null,
          gender: formData?.gender, // ✅ AJOUTÉ
          is_sterilized: formData?.isSterilized, // ✅ AJOUTÉ
          photo_url: formData?.image || null,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur ajout chien:', error);
        alert('Erreur lors de l\'ajout du chien. Veuillez réessayer.');
        return;
      }

      // Ajouter le nouveau chien à la liste locale
      const newProfile = {
        id: data.id,
        name: data.name,
        breed: data.breed || 'Race inconnue',
        age: formData?.ageUnit === 'years' 
          ? `${formData.age} an${formData.age > 1 ? 's' : ''}`
          : `${formData.age} mois`,
        weight: data.weight ? `${data.weight} kg` : 'Non renseigné',
        image: data.photo_url || 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg',
        imageAlt: `${data.name} - ${data.breed}`,
        healthStatus: 'good',
        upcomingReminders: [],
        recentActivity: 'Profil créé à l\'instant'
      };

      setDogProfiles((prev) => [...prev, newProfile]);
      setIsAddModalOpen(false);

      // Message de succès
      alert(`✅ ${data.name} a été ajouté avec succès !`);
    } catch (err) {
      console.error('Erreur:', err);
      alert('Une erreur inattendue s\'est produite.');
    }
  };

  const handleScheduleVisit = () => {
    alert(`Planification d'une visite vétérinaire pour ${selectedProfiles?.length} chien(s)`);
  };

  const handleUpdateMedication = () => {
    alert(`Mise à jour des médicaments pour ${selectedProfiles?.length} chien(s)`);
  };

  const activeProfile = dogProfiles?.find((p) => p?.id === activeProfileId);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Chargement de vos chiens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border shadow-soft">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dog-profile')}
                className="text-muted-foreground hover:text-foreground transition-smooth"
                aria-label="Retour"
              >
                <Icon name="ArrowLeft" size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-heading font-semibold text-foreground">
                  Gestion des profils
                </h1>
                <p className="text-sm text-muted-foreground">
                  {dogProfiles?.length} {dogProfiles?.length === 1 ? 'chien enregistré' : 'chiens enregistrés'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {dogProfiles?.length > 0 && (
                <ProfileSwitcher
                  profiles={dogProfiles}
                  currentProfile={activeProfile}
                  onProfileChange={(profile) => setActiveProfileId(profile?.id)}
                />
              )}

              {dogProfiles?.length > 0 && (
                <Button
                  variant={isBulkMode ? 'default' : 'outline'}
                  size="sm"
                  iconName="CheckSquare"
                  iconPosition="left"
                  onClick={() => {
                    setIsBulkMode(!isBulkMode);
                    setSelectedProfiles([]);
                  }}
                >
                  <span className="hidden lg:inline">
                    {isBulkMode ? 'Terminer' : 'Sélection'}
                  </span>
                </Button>
              )}
            </div>
          </div>

          {dogProfiles?.length > 0 && (
            <SearchFilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterBreed={filterBreed}
              onFilterChange={setFilterBreed}
              breeds={breedOptions}
            />
          )}
        </div>
      </div>

      <TabNavigation />

      {/* Main Content */}
      <main className="main-content max-w-screen-xl mx-auto px-4 py-6">
        {filteredProfiles?.length === 0 && !searchQuery && !filterBreed ? (
          <EmptyState onAddDog={() => setIsAddModalOpen(true)} />
        ) : filteredProfiles?.length === 0 ? (
          <div className="text-center py-16">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              Aucun résultat
            </h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles?.map((profile) => (
              <div key={profile?.id} className="relative">
                {isBulkMode && (
                  <div className="absolute top-3 left-3 z-20">
                    <Checkbox
                      checked={selectedProfiles?.includes(profile?.id)}
                      onChange={(e) => {
                        if (e?.target?.checked) {
                          setSelectedProfiles((prev) => [...prev, profile?.id]);
                        } else {
                          setSelectedProfiles((prev) => prev?.filter((id) => id !== profile?.id));
                        }
                      }}
                      size="lg"
                      className="bg-card shadow-elevated"
                    />
                  </div>
                )}
                <DogProfileCard
                  profile={profile}
                  isActive={profile?.id === activeProfileId}
                  onSelect={() => handleSelectProfile(profile?.id)}
                  onEdit={() => handleEditProfile(profile?.id)}
                />
              </div>
            ))}

            <AddDogCard onClick={() => setIsAddModalOpen(true)} />
          </div>
        )}
      </main>

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedProfiles?.length}
        onClearSelection={() => setSelectedProfiles([])}
        onScheduleVisit={handleScheduleVisit}
        onUpdateMedication={handleUpdateMedication}
      />

      {/* Add Dog Modal */}
      <AddDogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDog}
      />
    </div>
  );
};

export default MultiProfileManagement;
