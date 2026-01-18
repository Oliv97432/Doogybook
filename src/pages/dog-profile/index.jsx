import React, { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import TabNavigation from '../../components/TabNavigation';
import UserMenu from '../../components/UserMenu';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import VaccinationCard from './components/VaccinationCard';
import TreatmentCard from './components/TreatmentCard';
import WeightChart from './components/WeightChart';
import HealthNotesSection from './components/HealthNotesSection';
import AddVaccinationModal from './components/AddVaccinationModal';
import AddTreatmentModal from './components/AddTreatmentModal';
import AddWeightModal from './components/AddWeightModal';
import EditProfileModal from './components/EditProfileModal';
import PhotoGalleryModal from './components/PhotoGalleryModal';
import WelcomeOnboarding from './components/WelcomeOnboarding';
import CreateDogModal from './components/CreateDogModal';
import Footer from '../../components/Footer';
import usePremiumModal from '../../hooks/usePremiumModal';
import jsPDF from 'jspdf';

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
// 🎨 OPTIMIZED IMAGE COMPONENT
// ==========================================
const OptimizedImage = memo(({ 
  src, 
  alt, 
  width = 800, 
  quality = 75, 
  className = '',
  eager = false 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {!imageError ? (
        <img
          src={getOptimizedImageUrl(src, width, quality)}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          className={`${className} ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
          <span className="text-4xl font-bold text-primary/30">
            {alt?.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// ==========================================
// 🎨 SKELETON SCREENS
// ==========================================
const ProfileSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-40 bg-gray-200" />
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-end gap-4 -mt-12 pb-4">
        <div className="w-24 h-24 bg-gray-300 rounded-full" />
        <div className="flex-1 space-y-2 pb-2">
          <div className="h-6 bg-gray-300 rounded w-40" />
          <div className="h-4 bg-gray-200 rounded w-64" />
        </div>
      </div>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="bg-card rounded-xl p-4 border border-border animate-pulse">
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-5 bg-gray-200 rounded w-32" />
        <div className="h-8 w-8 bg-gray-200 rounded-full" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  </div>
);

const DogProfile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showPremiumModal } = usePremiumModal();
  const [activeTab, setActiveTab] = useState('vaccinations');
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // États pour les données
  const [dogProfiles, setDogProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [vaccinations, setVaccinations] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [weightData, setWeightData] = useState([]);
  const [healthNotes, setHealthNotes] = useState({
    allergies: '',
    medications: '',
    veterinaryNotes: '',
    veterinarian: '',
    veterinarianPhone: ''
  });
  const [photoGallery, setPhotoGallery] = useState([]);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [modals, setModals] = useState({
    vaccination: false,
    vermifuge: false,
    flea: false,
    weight: false,
    editProfile: false,
    gallery: false,
    createDog: false
  });

  const [editingItem, setEditingItem] = useState(null);

  // Vérifier statut Premium
  useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user?.id) return;

      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('subscription_tier')
          .eq('id', user.id)
          .single();

        const premiumTiers = ['premium', 'professional'];
        setIsPremium(premiumTiers.includes(profile?.subscription_tier));
      } catch (error) {
        console.error('Erreur vérification premium:', error);
      }
    };

    checkPremiumStatus();
  }, [user?.id]);

  // Charger les chiens de l'utilisateur - OPTIMISÉ
  useEffect(() => {
    if (!user?.id) return;

    const fetchDogs = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('dogs')
          .select('id, name, breed, birth_date, weight, gender, is_sterilized, photo_url, microchip_number, notes, cover_photo_url')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

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
            gender: dog.gender || 'Non renseigné',
            sterilized: dog.is_sterilized ? 'Stérilisé' : 'Non stérilisé',
            image: dog.photo_url || 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg',
            imageAlt: `${dog.name} - ${dog.breed}`,
            microchip_number: dog.microchip_number,
            notes: dog.notes,
            cover_photo_url: dog.cover_photo_url || null,
            birth_date: dog.birth_date
          };
        });

        setDogProfiles(formattedProfiles);
        if (formattedProfiles.length > 0) {
          setCurrentProfile(formattedProfiles[0]);
        }
      } catch (err) {
        console.error('Erreur chargement chiens:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, [user?.id]);

  // Charger les vaccinations - OPTIMISÉ
  useEffect(() => {
    if (!currentProfile?.id) return;

    const fetchVaccinations = async () => {
      try {
        const { data, error } = await supabase
          .from('vaccinations')
          .select('id, vaccine_name, vaccination_date, next_due_date, veterinarian, notes')
          .eq('dog_id', currentProfile.id)
          .order('next_due_date', { ascending: true })
          .limit(50);

        if (error) throw error;

        const formatted = data.map(vac => ({
          id: vac.id,
          name: vac.vaccine_name,
          lastDate: new Date(vac.vaccination_date).toLocaleDateString('fr-FR'),
          nextDate: vac.next_due_date ? new Date(vac.next_due_date).toLocaleDateString('fr-FR') : 'Non défini',
          veterinarian: vac.veterinarian,
          notes: vac.notes
        }));

        setVaccinations(formatted);
      } catch (err) {
        console.error('Erreur chargement vaccinations:', err);
      }
    };

    fetchVaccinations();
  }, [currentProfile?.id]);

  // Charger les traitements - OPTIMISÉ
  useEffect(() => {
    if (!currentProfile?.id) return;

    const fetchTreatments = async () => {
      try {
        const { data, error } = await supabase
          .from('treatments')
          .select('id, product_name, treatment_date, next_due_date, notes, treatment_type')
          .eq('dog_id', currentProfile.id)
          .order('next_due_date', { ascending: true })
          .limit(50);

        if (error) throw error;

        const formatted = data.map(treat => ({
          id: treat.id,
          product: treat.product_name,
          lastDate: new Date(treat.treatment_date).toLocaleDateString('fr-FR'),
          nextDate: treat.next_due_date ? new Date(treat.next_due_date).toLocaleDateString('fr-FR') : 'Non défini',
          notes: treat.notes,
          type: treat.treatment_type
        }));

        setTreatments(formatted);
      } catch (err) {
        console.error('Erreur chargement traitements:', err);
      }
    };

    fetchTreatments();
  }, [currentProfile?.id]);

  // Charger le poids - OPTIMISÉ
  useEffect(() => {
    if (!currentProfile?.id) return;

    const fetchWeight = async () => {
      try {
        const { data, error } = await supabase
          .from('weight_records')
          .select('measurement_date, weight')
          .eq('dog_id', currentProfile.id)
          .order('measurement_date', { ascending: true })
          .limit(100);

        if (error) throw error;

        const formatted = data.map(record => ({
          date: new Date(record.measurement_date).toLocaleDateString('fr-FR'),
          weight: parseFloat(record.weight)
        }));

        setWeightData(formatted);
      } catch (err) {
        console.error('Erreur chargement poids:', err);
      }
    };

    fetchWeight();
  }, [currentProfile?.id]);

  // Charger les notes de santé
  useEffect(() => {
    if (!currentProfile?.id) return;

    const fetchHealthNotes = async () => {
      try {
        const { data, error } = await supabase
          .from('health_notes')
          .select('description, tags, title')
          .eq('dog_id', currentProfile.id)
          .order('note_date', { ascending: false })
          .limit(1);

        if (error) throw error;

        if (data && data.length > 0) {
          const note = data[0];
          setHealthNotes({
            allergies: note.tags?.includes('allergies') ? note.description : '',
            medications: note.tags?.includes('medications') ? note.description : '',
            veterinaryNotes: note.description || '',
            veterinarian: note.tags?.includes('vet') ? note.title : '',
            veterinarianPhone: ''
          });
        }
      } catch (err) {
        console.error('Erreur chargement notes santé:', err);
      }
    };

    fetchHealthNotes();
  }, [currentProfile?.id]);

  // Charger la galerie photos
  useEffect(() => {
    if (!currentProfile?.id) return;

    const fetchPhotos = async () => {
      try {
        const { data, error } = await supabase
          .from('dog_photos')
          .select('id, photo_url, created_at')
          .eq('dog_id', currentProfile.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        setPhotoGallery(data || []);
      } catch (err) {
        console.error('Erreur chargement photos:', err);
      }
    };

    fetchPhotos();
  }, [currentProfile?.id]);

  // Handlers avec useCallback
  const openModal = useCallback((modalName, item = null) => {
    setEditingItem(item);
    setModals(prev => ({ ...prev, [modalName]: true }));
  }, []);

  const closeModal = useCallback((modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
    setEditingItem(null);
  }, []);

  // Sauvegarder vaccination
  const handleSaveVaccination = useCallback(async (data) => {
    try {
      if (editingItem) {
        const { error } = await supabase
          .from('vaccinations')
          .update({
            vaccine_name: data.name,
            vaccination_date: new Date(data.lastDate).toISOString().split('T')[0],
            next_due_date: data.nextDate ? new Date(data.nextDate).toISOString().split('T')[0] : null,
            veterinarian: data.veterinarian,
            notes: data.notes
          })
          .eq('id', editingItem.id);

        if (error) throw error;

        setVaccinations(prev => prev.map(v => 
          v.id === editingItem.id ? { ...data, id: v.id } : v
        ));
      } else {
        const { data: newVac, error } = await supabase
          .from('vaccinations')
          .insert([{
            dog_id: currentProfile.id,
            vaccine_name: data.name,
            vaccination_date: new Date(data.lastDate).toISOString().split('T')[0],
            next_due_date: data.nextDate ? new Date(data.nextDate).toISOString().split('T')[0] : null,
            veterinarian: data.veterinarian,
            notes: data.notes
          }])
          .select()
          .single();

        if (error) throw error;

        setVaccinations(prev => [...prev, {
          id: newVac.id,
          name: data.name,
          lastDate: new Date(data.lastDate).toLocaleDateString('fr-FR'),
          nextDate: data.nextDate ? new Date(data.nextDate).toLocaleDateString('fr-FR') : 'Non défini',
          veterinarian: data.veterinarian,
          notes: data.notes
        }]);
      }

      closeModal('vaccination');
    } catch (err) {
      console.error('Erreur sauvegarde vaccination:', err);
      alert('Erreur lors de la sauvegarde de la vaccination');
    }
  }, [editingItem, currentProfile, closeModal]);

  const handleDeleteVaccination = useCallback(async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette vaccination ?')) return;

    try {
      const { error } = await supabase
        .from('vaccinations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setVaccinations(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      console.error('Erreur suppression vaccination:', err);
      alert('Erreur lors de la suppression');
    }
  }, []);

  // Sauvegarder traitement
  const handleSaveTreatment = useCallback(async (data, type) => {
    try {
      const treatmentType = type === 'vermifuge' ? 'worm' : 'flea';

      if (editingItem) {
        const { error } = await supabase
          .from('treatments')
          .update({
            product_name: data.product,
            treatment_date: new Date(data.lastDate).toISOString().split('T')[0],
            next_due_date: data.nextDate ? new Date(data.nextDate).toISOString().split('T')[0] : null,
            notes: data.notes,
            treatment_type: treatmentType
          })
          .eq('id', editingItem.id);

        if (error) throw error;

        setTreatments(prev => prev.map(t => 
          t.id === editingItem.id ? { ...data, id: t.id, type: treatmentType } : t
        ));
      } else {
        const { data: newTreat, error } = await supabase
          .from('treatments')
          .insert([{
            dog_id: currentProfile.id,
            product_name: data.product,
            treatment_date: new Date(data.lastDate).toISOString().split('T')[0],
            next_due_date: data.nextDate ? new Date(data.nextDate).toISOString().split('T')[0] : null,
            notes: data.notes,
            treatment_type: treatmentType
          }])
          .select()
          .single();

        if (error) throw error;

        setTreatments(prev => [...prev, {
          id: newTreat.id,
          product: data.product,
          lastDate: new Date(data.lastDate).toLocaleDateString('fr-FR'),
          nextDate: data.nextDate ? new Date(data.nextDate).toLocaleDateString('fr-FR') : 'Non défini',
          notes: data.notes,
          type: treatmentType
        }]);
      }

      closeModal(type);
    } catch (err) {
      console.error('Erreur sauvegarde traitement:', err);
      alert('Erreur lors de la sauvegarde du traitement');
    }
  }, [editingItem, currentProfile, closeModal]);

  const handleDeleteTreatment = useCallback(async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce traitement ?')) return;

    try {
      const { error } = await supabase
        .from('treatments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTreatments(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Erreur suppression traitement:', err);
      alert('Erreur lors de la suppression');
    }
  }, []);

  // Sauvegarder poids
  const handleSaveWeight = useCallback(async (data) => {
    try {
      const { data: newWeight, error } = await supabase
        .from('weight_records')
        .insert([{
          dog_id: currentProfile.id,
          weight: parseFloat(data.weight),
          measurement_date: new Date(data.date).toISOString().split('T')[0]
        }])
        .select()
        .single();

      if (error) throw error;

      setWeightData(prev => [...prev, {
        date: new Date(data.date).toLocaleDateString('fr-FR'),
        weight: parseFloat(data.weight)
      }]);

      closeModal('weight');
    } catch (err) {
      console.error('Erreur sauvegarde poids:', err);
      alert('Erreur lors de la sauvegarde du poids');
    }
  }, [currentProfile, closeModal]);

  // Sauvegarder profil
  const handleSaveProfile = useCallback(async (data) => {
    try {
      const { error } = await supabase
        .from('dogs')
        .update({
          name: data.name,
          breed: data.breed,
          gender: data.gender,
          weight: parseFloat(data.weight.replace(' kg', '')),
          is_sterilized: data.sterilized === 'Stérilisé',
          notes: data.notes,
          microchip_number: data.microchip_number
        })
        .eq('id', currentProfile.id);

      if (error) throw error;

      setCurrentProfile(data);
      setDogProfiles(prev => prev.map(dog => 
        dog.id === currentProfile.id ? data : dog
      ));

      closeModal('editProfile');
    } catch (err) {
      console.error('Erreur sauvegarde profil:', err);
      alert('Erreur lors de la sauvegarde du profil');
    }
  }, [currentProfile, closeModal]);

  // Définir une photo comme photo de profil
  const handleSetProfilePhoto = useCallback(async (photoUrl) => {
    try {
      const { error } = await supabase
        .from('dogs')
        .update({ photo_url: photoUrl })
        .eq('id', currentProfile.id);

      if (error) throw error;

      setCurrentProfile(prev => ({
        ...prev,
        image: photoUrl
      }));

      setDogProfiles(prev => prev.map(dog => 
        dog.id === currentProfile.id 
          ? { ...dog, image: photoUrl }
          : dog
      ));
    } catch (err) {
      console.error('Erreur mise à jour photo de profil:', err);
      alert('❌ Erreur lors de la mise à jour de la photo de profil');
    }
  }, [currentProfile]);

  // Upload cover photo
  const handleCoverPhotoUpload = useCallback(async (e) => {
    const file = e.target.files?.[0];
    
    if (!file) return;

    if (!file.name || typeof file.name !== 'string') {
      alert('⚠️ Fichier invalide');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ L\'image est trop volumineuse (max 5MB)');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('⚠️ Format non supporté. Utilisez JPG, PNG ou WEBP');
      return;
    }

    setIsUploadingCover(true);

    try {
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = `${user.id}/${currentProfile.id}/cover_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('dog-photos')
        .upload(fileName, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('Bucket not found')) {
          alert('⚠️ Le bucket de stockage n\'existe pas.\n\n📋 Instructions:\n1. Va dans Supabase > Storage\n2. Crée un bucket "dog-photos"\n3. Coche "Public bucket"\n4. Réessaye');
          return;
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('dog-photos')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('dogs')
        .update({ cover_photo_url: publicUrl })
        .eq('id', currentProfile.id);

      if (dbError) throw dbError;

      setCurrentProfile(prev => ({
        ...prev,
        cover_photo_url: publicUrl
      }));

      setDogProfiles(prev => prev.map(dog => 
        dog.id === currentProfile.id 
          ? { ...dog, cover_photo_url: publicUrl }
          : dog
      ));
      
      alert('✅ Photo de couverture mise à jour !');
      e.target.value = '';
    } catch (err) {
      console.error('Erreur upload cover:', err);
      alert('❌ Erreur lors de l\'upload: ' + err.message);
    } finally {
      setIsUploadingCover(false);
    }
  }, [user, currentProfile]);

  // Upload photo
  const handleAddPhoto = useCallback(async (file) => {
    if (!file) {
      alert('⚠️ Aucun fichier sélectionné');
      return;
    }

    // Vérifier la limite de 5 photos pour les utilisateurs gratuits
    if (!isPremium && photoGallery.length >= 5) {
      showPremiumModal('photos');
      return;
    }

    if (!file.name || typeof file.name !== 'string') {
      alert('⚠️ Fichier invalide');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('⚠️ L\'image est trop volumineuse (max 5MB)');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('⚠️ Format non supporté. Utilisez JPG, PNG ou WEBP');
      return;
    }

    try {
      const fileExt = file.name.split('.').pop().toLowerCase();
      const fileName = `${user.id}/${currentProfile.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('dog-photos')
        .upload(fileName, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message.includes('Bucket not found')) {
          alert('⚠️ Le bucket de stockage n\'existe pas.\n\n📋 Instructions:\n1. Va dans Supabase > Storage\n2. Crée un bucket "dog-photos"\n3. Coche "Public bucket"\n4. Réessaye');
          return;
        }
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('dog-photos')
        .getPublicUrl(fileName);

      const { data: newPhoto, error: dbError } = await supabase
        .from('dog_photos')
        .insert([{
          dog_id: currentProfile.id,
          photo_url: publicUrl,
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (dbError) {
        if (dbError.message.includes('relation "dog_photos" does not exist')) {
          alert('⚠️ La table dog_photos n\'existe pas.\n\n📋 Exécute le SQL:\n' + 
                'CREATE TABLE dog_photos (\n' +
                '  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),\n' +
                '  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,\n' +
                '  photo_url TEXT NOT NULL,\n' +
                '  created_at TIMESTAMP DEFAULT NOW()\n' +
                ');');
          return;
        }
        throw dbError;
      }

      setPhotoGallery(prev => [newPhoto, ...prev]);
      
      alert('✅ Photo ajoutée avec succès !');
    } catch (err) {
      console.error('Erreur upload photo:', err);
      alert('❌ Erreur lors de l\'upload: ' + err.message);
    }
  }, [user, currentProfile, isPremium, photoGallery.length]);

  // Fonction pour enlever les accents
  const removeAccents = (str) => {
    if (!str) return '';
    
    let normalized = str.normalize('NFD');
    normalized = normalized.replace(/[\u0300-\u036f]/g, '');
    normalized = normalized
      .replace(/œ/g, 'oe')
      .replace(/æ/g, 'ae')
      .replace(/Œ/g, 'OE')
      .replace(/Æ/g, 'AE')
      .replace(/[€£$¥]/g, '')
      .replace(/[«»]/g, '')
      .replace(/[^a-zA-Z0-9\s.,;:!?()\-'"\/&@#%+=_]/g, ' ');
    
    normalized = normalized.replace(/\s+/g, ' ');
    normalized = normalized.trim();
    
    return normalized;
  };

  // Export PDF - ULTRA-SÉCURISÉ
  const handleExportPDF = useCallback(async () => {
    if (!isPremium) {
      showPremiumModal('limit');
      return;
    }

    setGeneratingPDF(true);

    try {
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      let yPos = margin;

      const safeText = (text, x, y, options = {}) => {
        try {
          const cleanText = String(text || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^\x00-\x7F]/g, '');
          
          pdf.text(cleanText, x, y, options);
        } catch (error) {
          console.error('Erreur ajout texte:', error);
          pdf.text('Error', x, y, options);
        }
      };

      // Header
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 50, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      safeText('WOOFLY', margin, 25);
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      safeText('Carnet de Sante', margin, 38);

      yPos = 60;

      // Infos du chien
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(22);
      pdf.setFont('helvetica', 'bold');
      safeText(currentProfile.name, margin, yPos);
      yPos += 10;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      const gender = currentProfile.gender === 'male' ? 'Male' : 'Femelle';
      safeText(`${currentProfile.breed} - ${currentProfile.age} - ${gender}`, margin, yPos);
      yPos += 6;
      
      if (currentProfile.weight !== 'Non renseigne') {
        safeText(`Poids: ${currentProfile.weight}`, margin, yPos);
        yPos += 6;
      }
      
      if (currentProfile.microchip_number) {
        safeText(`Puce: ${currentProfile.microchip_number}`, margin, yPos);
        yPos += 6;
      }

      safeText(`Sterilisation: ${currentProfile.sterilized}`, margin, yPos);
      yPos += 15;

      // Vaccinations
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      safeText('VACCINATIONS', margin, yPos);
      yPos += 8;

      if (vaccinations.length === 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(150, 150, 150);
        safeText('Aucune vaccination enregistree', margin + 5, yPos);
        yPos += 10;
      } else {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        vaccinations.forEach((vac) => {
          if (yPos > pageHeight - 40) {
            pdf.addPage();
            yPos = margin;
          }

          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          safeText(`- ${vac.name}`, margin + 5, yPos);
          yPos += 5;
          
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(80, 80, 80);
          safeText(`  Derniere date: ${vac.lastDate}`, margin + 5, yPos);
          yPos += 5;
          safeText(`  Prochaine date: ${vac.nextDate}`, margin + 5, yPos);
          yPos += 5;
          
          if (vac.veterinarian) {
            safeText(`  Veterinaire: ${vac.veterinarian}`, margin + 5, yPos);
            yPos += 5;
          }
          
          yPos += 3;
        });
      }
      yPos += 8;

      // Traitements
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      safeText('TRAITEMENTS', margin, yPos);
      yPos += 8;

      if (treatments.length === 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(150, 150, 150);
        safeText('Aucun traitement enregistre', margin + 5, yPos);
        yPos += 10;
      } else {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        treatments.forEach((treat) => {
          if (yPos > pageHeight - 40) {
            pdf.addPage();
            yPos = margin;
          }

          const typeLabel = treat.type === 'worm' ? 'Vermifuge' : 'Anti-puces/tiques';
          
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 0, 0);
          safeText(`- ${treat.product} (${typeLabel})`, margin + 5, yPos);
          yPos += 5;
          
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(80, 80, 80);
          safeText(`  Derniere date: ${treat.lastDate}`, margin + 5, yPos);
          yPos += 5;
          safeText(`  Prochaine date: ${treat.nextDate}`, margin + 5, yPos);
          yPos += 8;
        });
      }
      yPos += 8;

      // Poids
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      safeText('EVOLUTION DU POIDS', margin, yPos);
      yPos += 8;

      if (weightData.length === 0) {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(150, 150, 150);
        safeText('Aucune pesee enregistree', margin + 5, yPos);
        yPos += 10;
      } else {
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        
        const recentWeights = weightData.slice(-5);
        recentWeights.forEach((weight) => {
          safeText(`- ${weight.date}: ${weight.weight} kg`, margin + 5, yPos);
          yPos += 5;
        });
        
        if (weightData.length > 5) {
          yPos += 3;
          pdf.setFont('helvetica', 'italic');
          safeText(`(${weightData.length - 5} autres pesees non affichees)`, margin + 5, yPos);
        }
      }
      yPos += 12;

      // Notes médicales
      if (yPos > pageHeight - 80) {
        pdf.addPage();
        yPos = margin;
      }

      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(0, 0, 0);
      safeText('NOTES MEDICALES', margin, yPos);
      yPos += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(80, 80, 80);

      if (healthNotes.allergies) {
        pdf.setFont('helvetica', 'bold');
        safeText('Allergies:', margin + 5, yPos);
        yPos += 5;
        pdf.setFont('helvetica', 'normal');
        const allergiesText = pdf.splitTextToSize(removeAccents(healthNotes.allergies), pageWidth - margin * 2 - 10);
        allergiesText.forEach(line => {
          safeText(line, margin + 5, yPos);
          yPos += 5;
        });
        yPos += 5;
      }

      if (healthNotes.medications) {
        pdf.setFont('helvetica', 'bold');
        safeText('Medicaments:', margin + 5, yPos);
        yPos += 5;
        pdf.setFont('helvetica', 'normal');
        const medsText = pdf.splitTextToSize(removeAccents(healthNotes.medications), pageWidth - margin * 2 - 10);
        medsText.forEach(line => {
          safeText(line, margin + 5, yPos);
          yPos += 5;
        });
        yPos += 5;
      }

      if (healthNotes.veterinarian) {
        pdf.setFont('helvetica', 'bold');
        safeText('Veterinaire:', margin + 5, yPos);
        yPos += 5;
        pdf.setFont('helvetica', 'normal');
        safeText(healthNotes.veterinarian, margin + 5, yPos);
        yPos += 5;
      }

      if (healthNotes.veterinarianPhone) {
        safeText(`Telephone: ${healthNotes.veterinarianPhone}`, margin + 5, yPos);
        yPos += 5;
      }

      if (!healthNotes.allergies && !healthNotes.medications && !healthNotes.veterinarian) {
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(150, 150, 150);
        safeText('Aucune note medicale enregistree', margin + 5, yPos);
      }

      // Footer
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(8);
      safeText('Genere avec Woofly - www.doogybook.com', pageWidth / 2, pageHeight - 10, { align: 'center' });
      safeText(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - margin, pageHeight - 10, { align: 'right' });

      // Télécharger
      const cleanName = currentProfile.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-');
      const fileName = `carnet-sante-${cleanName}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      pdf.save(fileName);

      alert('Carnet de sante telecharge avec succes !');
    } catch (error) {
      console.error('Erreur generation PDF:', error);
      alert('Erreur lors de la generation du PDF: ' + error.message);
    } finally {
      setGeneratingPDF(false);
    }
  }, [isPremium, currentProfile, vaccinations, treatments, weightData, healthNotes]);

  const handleProfileChange = useCallback((profile) => {
    setCurrentProfile(profile);
  }, []);

  const tabs = [
    { id: 'vaccinations', label: 'Vaccinations', icon: 'Syringe' },
    { id: 'vermifuge', label: 'Vermifuge', icon: 'Pill' },
    { id: 'flea', label: 'Anti-puces', icon: 'Bug' },
    { id: 'weight', label: 'Poids', icon: 'TrendingUp' },
    { id: 'photos', label: 'Photos', icon: 'Camera' },
    { id: 'notes', label: 'Notes médicales', icon: 'FileText' }
  ];

  const vermifuges = treatments.filter(t => t.type === 'worm');
  const fleaTreatments = treatments.filter(t => t.type === 'flea' || t.type === 'tick');

  if (loading) {
    return (
      <div className="min-h-[100dvh] sm:min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-[100dvh] sm:min-h-screen bg-background">
        <TabNavigation />
        <WelcomeOnboarding onCreateDog={() => {
          console.log('🐕 Ouverture modal CreateDog');
          setModals(prev => {
            console.log('📋 Modals avant:', prev);
            const newModals = { ...prev, createDog: true };
            console.log('📋 Modals après:', newModals);
            return newModals;
          });
        }} />
        <CreateDogModal
          isOpen={modals.createDog}
          onClose={() => setModals(prev => ({ ...prev, createDog: false }))}
          onSuccess={() => {
            setModals(prev => ({ ...prev, createDog: false }));
            // Recharger les chiens
            window.location.reload();
          }}
          userId={user?.id}
        />
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] sm:min-h-screen bg-background flex flex-col">
      {/* Header sticky - OPTIMISÉ MOBILE */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-soft px-3 sm:px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg sm:text-xl font-heading font-semibold text-foreground truncate flex-1">
            {currentProfile.name}
          </h1>
          
          {/* Bouton PDF Desktop */}
          <button
            onClick={handleExportPDF}
            disabled={generatingPDF}
            className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 min-h-[44px] text-sm"
          >
            {generatingPDF ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Export...</span>
              </>
            ) : (
              <>
                <Icon name="Download" size={16} />
                <span>Carnet PDF</span>
              </>
            )}
          </button>

          <UserMenu />
        </div>
      </div>

      {/* Cover Photo - OPTIMISÉ */}
      <div className="relative">
        <div className="relative h-32 sm:h-40 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
          {currentProfile.cover_photo_url ? (
            <OptimizedImage
              src={currentProfile.cover_photo_url}
              alt={`Couverture de ${currentProfile.name}`}
              width={1200}
              quality={85}
              eager
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30">
              <Icon name="Image" size={24} />
            </div>
          )}
          
          {/* Bouton modifier cover */}
          <label 
            htmlFor="cover-photo-upload-input"
            className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 z-10 bg-white/90 hover:bg-white px-2.5 sm:px-3 py-2 rounded-lg cursor-pointer shadow-lg transition-smooth flex items-center gap-1.5 sm:gap-2 min-h-[44px]"
          >
            <Icon name="Camera" size={16} />
            <span className="font-medium text-xs sm:text-sm">
              {isUploadingCover ? 'Upload...' : 'Modifier'}
            </span>
            <input
              id="cover-photo-upload-input"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleCoverPhotoUpload}
              className="hidden"
              disabled={isUploadingCover}
            />
          </label>
        </div>

        {/* Avatar + Infos */}
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4">
          <div className="flex items-end gap-3 sm:gap-4 -mt-10 sm:-mt-12 pb-3 sm:pb-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-card bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden shadow-xl">
                <OptimizedImage
                  src={currentProfile.image}
                  alt={currentProfile.name}
                  width={200}
                  quality={80}
                  eager
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Bouton modifier avatar */}
              <button
                onClick={() => openModal('gallery')}
                className="absolute bottom-0 right-0 bg-primary hover:bg-primary/90 text-white p-1.5 sm:p-2 rounded-full cursor-pointer shadow-lg transition-smooth min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                <Icon name="Camera" size={14} className="sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* Infos chien */}
            <div className="flex-1 pb-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground truncate">
                {currentProfile.name}
              </h2>
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-muted-foreground text-xs mt-1">
                <span className="flex items-center gap-1">
                  <Icon name="Dog" size={12} />
                  <span className="truncate max-w-[100px] sm:max-w-none">{currentProfile.breed}</span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={12} />
                  <span className="whitespace-nowrap">{currentProfile.age}</span>
                </span>
                <span className="text-gray-300">•</span>
                <span className="flex items-center gap-1">
                  {currentProfile.gender === 'male' ? (
                    <>
                      <Icon name="Mars" size={12} />
                      <span>Mâle</span>
                    </>
                  ) : (
                    <>
                      <Icon name="Venus" size={12} />
                      <span>Femelle</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TabNavigation />
      
      <main className="main-content flex-1 pb-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="mt-3 sm:mt-4">
            <div className="bg-card rounded-lg shadow-soft overflow-hidden">
              {/* Tabs - SCROLL HORIZONTAL MOBILE */}
              <div className="border-b border-border overflow-x-auto">
                <div className="flex min-w-max px-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-3 font-medium transition-smooth border-b-2 text-xs sm:text-sm min-h-[44px] ${
                        activeTab === tab.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon name={tab.icon} size={16} className="sm:w-[18px] sm:h-[18px]" />
                      <span className="whitespace-nowrap">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 sm:p-4">
                {activeTab === 'vaccinations' && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground mb-1">
                          Vaccinations
                        </h3>
                        <p className="text-xs text-muted-foreground font-caption">
                          Gérez le calendrier vaccinal de {currentProfile.name}
                        </p>
                      </div>
                      <Button
                        variant="default"
                        iconName="Plus"
                        iconPosition="left"
                        onClick={() => openModal('vaccination')}
                        size="sm"
                        className="w-full min-h-[44px]"
                      >
                        Ajouter une vaccination
                      </Button>
                    </div>

                    {vaccinations.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon name="Syringe" size={24} color="var(--color-muted-foreground)" />
                        </div>
                        <p className="text-sm text-muted-foreground font-caption mb-4">
                          Aucune vaccination enregistrée
                        </p>
                        <Button
                          variant="default"
                          iconName="Plus"
                          iconPosition="left"
                          onClick={() => openModal('vaccination')}
                          size="sm"
                          className="w-full min-h-[44px]"
                        >
                          Ajouter une vaccination
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {vaccinations.map((vaccination) => (
                          <VaccinationCard
                            key={vaccination.id}
                            vaccination={vaccination}
                            onEdit={(item) => openModal('vaccination', item)}
                            onDelete={handleDeleteVaccination}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'vermifuge' && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground mb-1">
                          Vermifuge
                        </h3>
                        <p className="text-xs text-muted-foreground font-caption">
                          Suivez les traitements antiparasitaires internes
                        </p>
                      </div>
                      <Button
                        variant="default"
                        iconName="Plus"
                        iconPosition="left"
                        onClick={() => openModal('vermifuge')}
                        size="sm"
                        className="w-full min-h-[44px]"
                      >
                        Ajouter un traitement
                      </Button>
                    </div>

                    {vermifuges.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon name="Pill" size={24} color="var(--color-muted-foreground)" />
                        </div>
                        <p className="text-sm text-muted-foreground font-caption mb-4">
                          Aucun traitement vermifuge enregistré
                        </p>
                        <Button
                          variant="default"
                          iconName="Plus"
                          iconPosition="left"
                          onClick={() => openModal('vermifuge')}
                          size="sm"
                          className="w-full min-h-[44px]"
                        >
                          Ajouter un traitement
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {vermifuges.map((treatment) => (
                          <TreatmentCard
                            key={treatment.id}
                            treatment={treatment}
                            type="vermifuge"
                            onEdit={(item) => openModal('vermifuge', item)}
                            onDelete={(id) => handleDeleteTreatment(id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'flea' && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-start justify-between gap-3 mb-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground mb-1">
                          Anti-puces et tiques
                        </h3>
                        <p className="text-xs text-muted-foreground font-caption">
                          Gérez les traitements antiparasitaires externes
                        </p>
                      </div>
                      <Button
                        variant="default"
                        iconName="Plus"
                        iconPosition="left"
                        onClick={() => openModal('flea')}
                        size="sm"
                        className="w-full min-h-[44px]"
                      >
                        Ajouter un traitement
                      </Button>
                    </div>

                    {fleaTreatments.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon name="Bug" size={24} color="var(--color-muted-foreground)" />
                        </div>
                        <p className="text-sm text-muted-foreground font-caption mb-4">
                          Aucun traitement anti-puces enregistré
                        </p>
                        <Button
                          variant="default"
                          iconName="Plus"
                          iconPosition="left"
                          onClick={() => openModal('flea')}
                          size="sm"
                          className="w-full min-h-[44px]"
                        >
                          Ajouter un traitement
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-3">
                        {fleaTreatments.map((treatment) => (
                          <TreatmentCard
                            key={treatment.id}
                            treatment={treatment}
                            type="flea"
                            onEdit={(item) => openModal('flea', item)}
                            onDelete={(id) => handleDeleteTreatment(id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'weight' && (
                  <WeightChart
                    data={weightData}
                    onAddWeight={() => openModal('weight')}
                  />
                )}

                {activeTab === 'photos' && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-start justify-between gap-3 mb-4">
                      <div className="flex-1 w-full">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground">
                            Album Photos
                          </h3>
                          {!isPremium && (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {photoGallery.length}/5 photos
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground font-caption">
                          {isPremium
                            ? `Gérez les photos de ${currentProfile.name} (illimité)`
                            : `Gérez les photos de ${currentProfile.name} (5 max en version gratuite)`
                          }
                        </p>
                      </div>
                      <Button
                        variant="default"
                        iconName="Plus"
                        iconPosition="left"
                        onClick={() => openModal('gallery')}
                        className="w-full sm:w-auto"
                        disabled={!isPremium && photoGallery.length >= 5}
                      >
                        {!isPremium && photoGallery.length >= 5 ? 'Limite atteinte' : 'Ajouter une photo'}
                      </Button>
                    </div>

                    {photoGallery.length === 0 ? (
                      <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                        <div className="flex justify-center mb-4">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                            <Icon name="Camera" size={32} className="text-muted-foreground" />
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Aucune photo pour le moment
                        </p>
                        <Button
                          variant="outline"
                          iconName="Plus"
                          onClick={() => openModal('gallery')}
                        >
                          Ajouter votre première photo
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {photoGallery.map((photo) => (
                            <div
                              key={photo.id}
                              className="aspect-square rounded-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => openModal('gallery')}
                            >
                              <OptimizedImage
                                src={photo.photo_url}
                                alt={`Photo de ${currentProfile.name}`}
                                width={400}
                                quality={80}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Message de limite atteinte */}
                        {!isPremium && photoGallery.length >= 5 && (
                          <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0">
                                <Icon name="Lock" size={20} className="text-orange-600" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-orange-900 mb-1">
                                  Limite de photos atteinte
                                </h4>
                                <p className="text-xs text-orange-700 mb-3">
                                  Vous avez atteint la limite de 5 photos en version gratuite.
                                  Passez à Premium pour ajouter des photos illimitées !
                                </p>
                                <Button
                                  variant="default"
                                  size="sm"
                                  iconName="Sparkles"
                                  onClick={() => showPremiumModal('photos')}
                                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                                >
                                  Passer à Premium
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <HealthNotesSection
                    notes={healthNotes}
                    onSave={setHealthNotes}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bouton PDF flottant mobile */}
      <button
        onClick={handleExportPDF}
        disabled={generatingPDF}
        className="sm:hidden fixed bottom-20 right-3 sm:right-4 z-40 w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-lg flex items-center justify-center disabled:opacity-50"
      >
        {generatingPDF ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
        ) : (
          <Icon name="Download" size={22} />
        )}
      </button>

      {/* Modals */}
      <AddVaccinationModal
        isOpen={modals.vaccination}
        onClose={() => closeModal('vaccination')}
        onSave={handleSaveVaccination}
        editData={editingItem}
      />

      <AddTreatmentModal
        isOpen={modals.vermifuge}
        onClose={() => closeModal('vermifuge')}
        onSave={(data) => handleSaveTreatment(data, 'vermifuge')}
        editData={editingItem}
        type="vermifuge"
      />

      <AddTreatmentModal
        isOpen={modals.flea}
        onClose={() => closeModal('flea')}
        onSave={(data) => handleSaveTreatment(data, 'flea')}
        editData={editingItem}
        type="flea"
      />

      <AddWeightModal
        isOpen={modals.weight}
        onClose={() => closeModal('weight')}
        onSave={handleSaveWeight}
      />

      <EditProfileModal
        isOpen={modals.editProfile}
        onClose={() => closeModal('editProfile')}
        onSave={handleSaveProfile}
        profile={currentProfile}
      />
     
      <PhotoGalleryModal
        isOpen={modals.gallery}
        onClose={() => closeModal('gallery')}
        photos={photoGallery}
        onAddPhoto={handleAddPhoto}
        currentProfilePhotoUrl={currentProfile?.image}
        onSetProfilePhoto={handleSetProfilePhoto}
        isPremium={isPremium}
        onShowPremiumModal={() => showPremiumModal('photos')}
      />

      <Footer />
    </div>
  );
};

export default DogProfile;
