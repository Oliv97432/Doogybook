import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TabNavigation from '../../components/TabNavigation';
import ProfileSwitcher from '../../components/ProfileSwitcher';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ProfileHeader from './components/ProfileHeader';
import VaccinationCard from './components/VaccinationCard';
import TreatmentCard from './components/TreatmentCard';
import WeightChart from './components/WeightChart';
import HealthNotesSection from './components/HealthNotesSection';
import AddVaccinationModal from './components/AddVaccinationModal';
import AddTreatmentModal from './components/AddTreatmentModal';
import AddWeightModal from './components/AddWeightModal';
import EditProfileModal from './components/EditProfileModal';
import PhotoGalleryModal from './components/PhotoGalleryModal';

const DogProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('vaccinations');

  const [dogProfiles] = useState([
  {
    id: 1,
    name: "Max",
    breed: "Berger Malinois",
    age: "3 ans",
    weight: "28 kg",
    gender: "Mâle",
    sterilized: "Stérilisé",
    image: "https://images.unsplash.com/photo-1551513117-5175afd3f95f",
    imageAlt: "Berger Malinois adulte avec pelage fauve et masque noir assis dans un parc verdoyant"
  },
  {
    id: 2,
    name: "Luna",
    breed: "Shih-Tzu",
    age: "2 ans",
    weight: "6 kg",
    gender: "Femelle",
    sterilized: "Stérilisé",
    image: "https://images.unsplash.com/photo-1688028005019-78d66e7d0528",
    imageAlt: "Shih-Tzu femelle avec long pelage blanc et brun regardant la caméra avec expression douce"
  }]
  );

  const [currentProfile, setCurrentProfile] = useState(dogProfiles?.[0]);

  const [vaccinations, setVaccinations] = useState([
  {
    id: 1,
    name: "Rage",
    lastDate: "15/03/2024",
    nextDate: "15/03/2025"
  },
  {
    id: 2,
    name: "DHPP (Maladie de Carré, Hépatite, Parvovirose, Parainfluenza)",
    lastDate: "10/02/2024",
    nextDate: "10/02/2025"
  },
  {
    id: 3,
    name: "Leptospirose",
    lastDate: "20/04/2024",
    nextDate: "20/04/2025"
  },
  {
    id: 4,
    name: "Toux de chenil (Bordetella)",
    lastDate: "05/01/2024",
    nextDate: "05/01/2025"
  }]
  );

  const [vermifuges, setVermifuges] = useState([
  {
    id: 1,
    product: "Milbemax",
    lastDate: "01/11/2024",
    nextDate: "01/02/2025",
    notes: "Comprimé de 12,5 mg - Administré avec nourriture"
  },
  {
    id: 2,
    product: "Drontal Plus",
    lastDate: "15/08/2024",
    nextDate: "15/11/2024",
    notes: "Traitement préventif trimestriel"
  }]
  );

  const [fleaTreatments, setFleaTreatments] = useState([
  {
    id: 1,
    product: "Frontline Combo",
    lastDate: "15/11/2024",
    nextDate: "15/12/2024",
    notes: "Pipette spot-on - Protection 4 semaines"
  },
  {
    id: 2,
    product: "Bravecto",
    lastDate: "20/09/2024",
    nextDate: "20/12/2024",
    notes: "Comprimé à croquer - Protection 12 semaines"
  }]
  );

  const [weightData, setWeightData] = useState([
  { date: "01/06/2024", weight: 26.5 },
  { date: "01/07/2024", weight: 27.0 },
  { date: "01/08/2024", weight: 27.3 },
  { date: "01/09/2024", weight: 27.8 },
  { date: "01/10/2024", weight: 28.0 },
  { date: "01/11/2024", weight: 28.2 }]
  );

  const [healthNotes, setHealthNotes] = useState({
    allergies: "Poulet, pollen de graminées",
    medications: "Aucun traitement en cours",
    veterinaryNotes: "Chien en excellente santé. Légère sensibilité digestive au poulet détectée en 2023. Recommandation: alimentation à base d\'agneau ou de poisson. Contrôle dentaire annuel recommandé. Dernière visite: 15/10/2024 - RAS.",
    veterinarian: "Dr. Sophie Martin",
    veterinarianPhone: "+33 1 45 67 89 12"
  });

  const [photoGallery] = useState([
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1551513117-5175afd3f95f",
    alt: "Berger Malinois adulte avec pelage fauve et masque noir assis dans un parc verdoyant",
    date: "15/11/2024"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1642559254400-13dbdef21734",
    alt: "Berger Malinois en action courant dans un champ avec expression joyeuse et langue sortie",
    date: "10/11/2024"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1719490871968-def29cc34b6f",
    alt: "Portrait rapproché de Berger Malinois avec regard attentif et oreilles dressées",
    date: "05/11/2024"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1666028362715-3d5d2e442c9f",
    alt: "Berger Malinois jouant avec une balle orange dans un jardin ensoleillé",
    date: "01/11/2024"
  }]
  );

  const [modals, setModals] = useState({
    vaccination: false,
    vermifuge: false,
    flea: false,
    weight: false,
    editProfile: false,
    gallery: false
  });

  const [editingItem, setEditingItem] = useState(null);

  const openModal = (modalName, item = null) => {
    setEditingItem(item);
    setModals({ ...modals, [modalName]: true });
  };

  const closeModal = (modalName) => {
    setModals({ ...modals, [modalName]: false });
    setEditingItem(null);
  };

  const handleSaveVaccination = (data) => {
    if (editingItem) {
      setVaccinations(vaccinations?.map((v) => v?.id === editingItem?.id ? { ...data, id: v?.id } : v));
    } else {
      setVaccinations([...vaccinations, { ...data, id: Date.now() }]);
    }
  };

  const handleDeleteVaccination = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette vaccination ?')) {
      setVaccinations(vaccinations?.filter((v) => v?.id !== id));
    }
  };

  const handleSaveTreatment = (data, type) => {
    if (type === 'vermifuge') {
      if (editingItem) {
        setVermifuges(vermifuges?.map((v) => v?.id === editingItem?.id ? { ...data, id: v?.id } : v));
      } else {
        setVermifuges([...vermifuges, { ...data, id: Date.now() }]);
      }
    } else {
      if (editingItem) {
        setFleaTreatments(fleaTreatments?.map((f) => f?.id === editingItem?.id ? { ...data, id: f?.id } : f));
      } else {
        setFleaTreatments([...fleaTreatments, { ...data, id: Date.now() }]);
      }
    }
  };

  const handleDeleteTreatment = (id, type) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce traitement ?')) {
      if (type === 'vermifuge') {
        setVermifuges(vermifuges?.filter((v) => v?.id !== id));
      } else {
        setFleaTreatments(fleaTreatments?.filter((f) => f?.id !== id));
      }
    }
  };

  const handleSaveWeight = (data) => {
    const formattedDate = new Date(data.date)?.toLocaleDateString('fr-FR');
    setWeightData([...weightData, { date: formattedDate, weight: parseFloat(data?.weight) }]);
  };

  const handleSaveProfile = (data) => {
    setCurrentProfile(data);
  };

  const handleExportPDF = () => {
    alert('Fonctionnalité d\'export PDF en cours de développement. Le fichier PDF sera généré avec toutes les informations de santé de ' + currentProfile?.name + '.');
  };

  const tabs = [
  { id: 'vaccinations', label: 'Vaccinations', icon: 'Syringe' },
  { id: 'vermifuge', label: 'Vermifuge', icon: 'Pill' },
  { id: 'flea', label: 'Anti-puces', icon: 'Bug' },
  { id: 'weight', label: 'Poids', icon: 'TrendingUp' },
  { id: 'notes', label: 'Notes médicales', icon: 'FileText' }];


  return (
    <div className="min-h-screen bg-background">
      <TabNavigation />
      <div className="main-content">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:py-8">
          <div className="flex items-center justify-between mb-6">
            <ProfileSwitcher
              profiles={dogProfiles}
              currentProfile={currentProfile}
              onProfileChange={setCurrentProfile} />

            <Button
              variant="outline"
              iconName="Download"
              iconPosition="left"
              onClick={handleExportPDF}>

              Exporter PDF
            </Button>
          </div>

          <ProfileHeader
            profile={currentProfile}
            onEdit={() => openModal('editProfile')}
            onGallery={() => openModal('gallery')} />


          <div className="mt-6">
            <div className="bg-card rounded-lg shadow-soft overflow-hidden">
              <div className="border-b border-border overflow-x-auto">
                <div className="flex min-w-max">
                  {tabs?.map((tab) =>
                  <button
                    key={tab?.id}
                    onClick={() => setActiveTab(tab?.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-smooth border-b-2 ${
                    activeTab === tab?.id ?
                    'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`
                    }>

                      <Icon name={tab?.icon} size={20} />
                      <span>{tab?.label}</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="p-6">
                {activeTab === 'vaccinations' &&
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-heading font-semibold text-foreground mb-1">
                          Vaccinations
                        </h3>
                        <p className="text-sm text-muted-foreground font-caption">
                          Gérez le calendrier vaccinal de {currentProfile?.name}
                        </p>
                      </div>
                      <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => openModal('vaccination')}>

                        Ajouter
                      </Button>
                    </div>

                    {vaccinations?.length === 0 ?
                  <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon name="Syringe" size={32} color="var(--color-muted-foreground)" />
                        </div>
                        <p className="text-muted-foreground font-caption mb-4">
                          Aucune vaccination enregistrée
                        </p>
                        <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => openModal('vaccination')}>

                          Ajouter une vaccination
                        </Button>
                      </div> :

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {vaccinations?.map((vaccination) =>
                    <VaccinationCard
                      key={vaccination?.id}
                      vaccination={vaccination}
                      onEdit={(item) => openModal('vaccination', item)}
                      onDelete={handleDeleteVaccination} />

                    )}
                      </div>
                  }
                  </div>
                }

                {activeTab === 'vermifuge' &&
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-heading font-semibold text-foreground mb-1">
                          Vermifuge
                        </h3>
                        <p className="text-sm text-muted-foreground font-caption">
                          Suivez les traitements antiparasitaires internes
                        </p>
                      </div>
                      <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => openModal('vermifuge')}>

                        Ajouter
                      </Button>
                    </div>

                    {vermifuges?.length === 0 ?
                  <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon name="Pill" size={32} color="var(--color-muted-foreground)" />
                        </div>
                        <p className="text-muted-foreground font-caption mb-4">
                          Aucun traitement vermifuge enregistré
                        </p>
                        <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => openModal('vermifuge')}>

                          Ajouter un traitement
                        </Button>
                      </div> :

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {vermifuges?.map((treatment) =>
                    <TreatmentCard
                      key={treatment?.id}
                      treatment={treatment}
                      type="vermifuge"
                      onEdit={(item) => openModal('vermifuge', item)}
                      onDelete={(id) => handleDeleteTreatment(id, 'vermifuge')} />

                    )}
                      </div>
                  }
                  </div>
                }

                {activeTab === 'flea' &&
                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-heading font-semibold text-foreground mb-1">
                          Anti-puces et tiques
                        </h3>
                        <p className="text-sm text-muted-foreground font-caption">
                          Gérez les traitements antiparasitaires externes
                        </p>
                      </div>
                      <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => openModal('flea')}>

                        Ajouter
                      </Button>
                    </div>

                    {fleaTreatments?.length === 0 ?
                  <div className="text-center py-12">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon name="Bug" size={32} color="var(--color-muted-foreground)" />
                        </div>
                        <p className="text-muted-foreground font-caption mb-4">
                          Aucun traitement anti-puces enregistré
                        </p>
                        <Button
                      variant="default"
                      iconName="Plus"
                      iconPosition="left"
                      onClick={() => openModal('flea')}>

                          Ajouter un traitement
                        </Button>
                      </div> :

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {fleaTreatments?.map((treatment) =>
                    <TreatmentCard
                      key={treatment?.id}
                      treatment={treatment}
                      type="flea"
                      onEdit={(item) => openModal('flea', item)}
                      onDelete={(id) => handleDeleteTreatment(id, 'flea')} />

                    )}
                      </div>
                  }
                  </div>
                }

                {activeTab === 'weight' &&
                <WeightChart
                  data={weightData}
                  onAddWeight={() => openModal('weight')} />

                }

                {activeTab === 'notes' &&
                <HealthNotesSection
                  notes={healthNotes}
                  onSave={setHealthNotes} />

                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddVaccinationModal
        isOpen={modals?.vaccination}
        onClose={() => closeModal('vaccination')}
        onSave={handleSaveVaccination}
        editData={editingItem} />

      <AddTreatmentModal
        isOpen={modals?.vermifuge}
        onClose={() => closeModal('vermifuge')}
        onSave={(data) => handleSaveTreatment(data, 'vermifuge')}
        editData={editingItem}
        type="vermifuge" />

      <AddTreatmentModal
        isOpen={modals?.flea}
        onClose={() => closeModal('flea')}
        onSave={(data) => handleSaveTreatment(data, 'flea')}
        editData={editingItem}
        type="flea" />

      <AddWeightModal
        isOpen={modals?.weight}
        onClose={() => closeModal('weight')}
        onSave={handleSaveWeight} />

      <EditProfileModal
        isOpen={modals?.editProfile}
        onClose={() => closeModal('editProfile')}
        onSave={handleSaveProfile}
        profile={currentProfile} />

      <PhotoGalleryModal
        isOpen={modals?.gallery}
        onClose={() => closeModal('gallery')}
        photos={photoGallery}
        onAddPhoto={() => alert('Fonctionnalité d\'ajout de photo en cours de développement')} />

    </div>);

};

export default DogProfile;