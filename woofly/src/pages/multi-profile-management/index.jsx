import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [dogProfiles, setDogProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBreed, setFilterBreed] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);

  useEffect(() => {
    const mockProfiles = [
    {
      id: 1,
      name: 'Max',
      breed: 'Malinois',
      age: '3 ans',
      weight: '32 kg',
      image: "https://images.unsplash.com/photo-1713917032646-4703f3feffde",
      imageAlt: 'Malinois adulte au pelage fauve et noir assis dans un parc verdoyant avec un regard attentif',
      healthStatus: 'excellent',
      upcomingReminders: ['Vaccination antirabique - 15/12/2025', 'Vermifuge - 20/12/2025'],
      recentActivity: 'Dernière mise à jour il y a 2 jours'
    },
    {
      id: 2,
      name: 'Luna',
      breed: 'Shih-Tzu',
      age: '5 ans',
      weight: '6.5 kg',
      image: "https://images.unsplash.com/photo-1592336167298-e12e4e556f09",
      imageAlt: 'Shih-Tzu femelle au pelage blanc et doré avec nœud rose dans les cheveux regardant la caméra',
      healthStatus: 'good',
      upcomingReminders: ['Traitement anti-puces - 10/12/2025'],
      recentActivity: 'Dernière mise à jour il y a 5 jours'
    },
    {
      id: 3,
      name: 'Rocky',
      breed: 'American Bully',
      age: '2 ans',
      weight: '28 kg',
      image: "https://images.unsplash.com/photo-1558641480-8f9c31eea530",
      imageAlt: 'American Bully musclé au pelage gris avec collier rouge posant fièrement dans un jardin',
      healthStatus: 'attention',
      upcomingReminders: ['Visite vétérinaire - 08/12/2025', 'Vaccination - 12/12/2025', 'Vermifuge - 18/12/2025'],
      recentActivity: 'Dernière mise à jour il y a 1 jour'
    },
    {
      id: 4,
      name: 'Bella',
      breed: 'Labrador',
      age: '4 ans',
      weight: '29 kg',
      image: "https://images.unsplash.com/photo-1690469019639-1827f83f6c62",
      imageAlt: 'Labrador retriever femelle au pelage doré courant joyeusement dans un champ avec la langue sortie',
      healthStatus: 'excellent',
      upcomingReminders: [],
      recentActivity: 'Dernière mise à jour il y a 3 jours'
    },
    {
      id: 5,
      name: 'Charlie',
      breed: 'Bouledogue Français',
      age: '1 an',
      weight: '12 kg',
      image: "https://images.unsplash.com/photo-1583252224982-f5064eb19ece",
      imageAlt: 'Bouledogue français au pelage fauve avec masque noir assis sur un canapé beige',
      healthStatus: 'good',
      upcomingReminders: ['Stérilisation - 22/12/2025'],
      recentActivity: 'Dernière mise à jour il y a 1 semaine'
    }];


    setDogProfiles(mockProfiles);
    setActiveProfileId(mockProfiles?.[0]?.id || null);
  }, []);

  const breedOptions = [
  { value: '', label: 'Toutes les races' },
  { value: 'malinois', label: 'Malinois' },
  { value: 'shih-tzu', label: 'Shih-Tzu' },
  { value: 'american-bully', label: 'American Bully' },
  { value: 'labrador', label: 'Labrador' },
  { value: 'bouledogue-francais', label: 'Bouledogue Français' }];


  const filteredProfiles = dogProfiles?.filter((profile) => {
    const matchesSearch = profile?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesBreed = !filterBreed || profile?.breed?.toLowerCase()?.replace(/\s+/g, '-') === filterBreed;
    return matchesSearch && matchesBreed;
  });

  const handleSelectProfile = (profileId) => {
    if (isBulkMode) {
      setSelectedProfiles((prev) =>
      prev?.includes(profileId) ?
      prev?.filter((id) => id !== profileId) :
      [...prev, profileId]
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

  const handleAddDog = (formData) => {
    const newProfile = {
      id: dogProfiles?.length + 1,
      name: formData?.name,
      breed: formData?.breed,
      age: formData?.age,
      weight: formData?.weight,
      image: formData?.image || 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg',
      imageAlt: `${formData?.name} - ${formData?.breed} de ${formData?.age} pesant ${formData?.weight}`,
      healthStatus: 'good',
      upcomingReminders: [],
      recentActivity: 'Profil créé à l\'instant'
    };

    setDogProfiles((prev) => [...prev, newProfile]);
    setIsAddModalOpen(false);
  };

  const handleScheduleVisit = () => {
    alert(`Planification d'une visite vétérinaire pour ${selectedProfiles?.length} chien(s)`);
  };

  const handleUpdateMedication = () => {
    alert(`Mise à jour des médicaments pour ${selectedProfiles?.length} chien(s)`);
  };

  const activeProfile = dogProfiles?.find((p) => p?.id === activeProfileId);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-40 bg-card border-b border-border shadow-soft">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dog-profile')}
                className="text-muted-foreground hover:text-foreground transition-smooth"
                aria-label="Retour">

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
              <ProfileSwitcher
                profiles={dogProfiles}
                currentProfile={activeProfile}
                onProfileChange={(profile) => setActiveProfileId(profile?.id)} />

              
              <Button
                variant={isBulkMode ? 'default' : 'outline'}
                size="sm"
                iconName="CheckSquare"
                iconPosition="left"
                onClick={() => {
                  setIsBulkMode(!isBulkMode);
                  setSelectedProfiles([]);
                }}>

                <span className="hidden lg:inline">
                  {isBulkMode ? 'Terminer' : 'Sélection'}
                </span>
              </Button>
            </div>
          </div>

          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterBreed={filterBreed}
            onFilterChange={setFilterBreed}
            breeds={breedOptions} />

        </div>
      </div>
      <TabNavigation />
      <main className="main-content max-w-screen-xl mx-auto px-4 py-6">
        {filteredProfiles?.length === 0 && !searchQuery && !filterBreed ?
        <EmptyState onAddDog={() => setIsAddModalOpen(true)} /> :
        filteredProfiles?.length === 0 ?
        <div className="text-center py-16">
            <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
              Aucun résultat
            </h3>
            <p className="text-muted-foreground">
              Essayez de modifier vos critères de recherche
            </p>
          </div> :

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles?.map((profile) =>
          <div key={profile?.id} className="relative">
                {isBulkMode &&
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
                className="bg-card shadow-elevated" />

                  </div>
            }
                <DogProfileCard
              profile={profile}
              isActive={profile?.id === activeProfileId}
              onSelect={() => handleSelectProfile(profile?.id)}
              onEdit={() => handleEditProfile(profile?.id)} />

              </div>
          )}

            <AddDogCard onClick={() => setIsAddModalOpen(true)} />
          </div>
        }
      </main>
      <BulkActionsBar
        selectedCount={selectedProfiles?.length}
        onClearSelection={() => setSelectedProfiles([])}
        onScheduleVisit={handleScheduleVisit}
        onUpdateMedication={handleUpdateMedication} />

      <AddDogModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddDog} />

    </div>);

};

export default MultiProfileManagement;