import React, { useState } from 'react';
import { supabase } from '../../../lib/supabase';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddDogModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    ageUnit: 'years',
    weight: '',
    gender: '',
    isSterilized: 'no',
    image: ''
  });

  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  const breedOptions = [
    { value: 'malinois', label: 'Malinois' },
    { value: 'shih-tzu', label: 'Shih-Tzu' },
    { value: 'american-bully', label: 'American Bully' },
    { value: 'labrador', label: 'Labrador' },
    { value: 'golden-retriever', label: 'Golden Retriever' },
    { value: 'berger-allemand', label: 'Berger Allemand' },
    { value: 'bouledogue-francais', label: 'Bouledogue Français' },
    { value: 'chihuahua', label: 'Chihuahua' },
    { value: 'husky', label: 'Husky Sibérien' },
    { value: 'beagle', label: 'Beagle' },
    { value: 'mixed', label: 'Race mixte' },
    { value: 'other', label: 'Autre' }
  ];

  const ageUnitOptions = [
    { value: 'months', label: 'Mois' },
    { value: 'years', label: 'Ans' }
  ];

  const genderOptions = [
    { value: 'male', label: 'Mâle' },
    { value: 'female', label: 'Femelle' }
  ];

  const sterilizedOptions = [
    { value: 'yes', label: 'Oui' },
    { value: 'no', label: 'Non' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, photo: 'Veuillez sélectionner une image' }));
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'L\'image ne doit pas dépasser 5 MB' }));
        return;
      }

      setPhotoFile(file);
      setErrors(prev => ({ ...prev, photo: '' }));

      // Créer une preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async (userId) => {
    if (!photoFile) return { success: true, url: null };

    try {
      // Créer un nom de fichier unique
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      console.log('📸 Upload photo vers:', fileName);

      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from('dog-photos')
        .upload(fileName, photoFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Erreur upload photo:', error);
        return {
          success: false,
          error: error.message || 'Erreur lors de l\'upload de la photo'
        };
      }

      console.log('✅ Photo uploadée:', data);

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from('dog-photos')
        .getPublicUrl(fileName);

      console.log('🔗 URL publique:', urlData.publicUrl);

      return { success: true, url: urlData.publicUrl };
    } catch (err) {
      console.error('❌ Erreur upload:', err);
      return {
        success: false,
        error: 'Une erreur inattendue est survenue lors de l\'upload'
      };
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData?.breed) {
      newErrors.breed = 'La race est requise';
    }

    if (!formData?.gender) {
      newErrors.gender = 'Le sexe est requis';
    }
    
    if (!formData?.age?.trim()) {
      newErrors.age = "L'âge est requis";
    } else if (isNaN(formData?.age) || formData?.age < 0) {
      newErrors.age = "Veuillez entrer un nombre valide";
    } else if (formData?.ageUnit === 'years' && formData?.age > 30) {
      newErrors.age = "L'âge maximum est de 30 ans";
    } else if (formData?.ageUnit === 'months' && formData?.age > 360) {
      newErrors.age = "L'âge maximum est de 360 mois";
    }
    
    if (!formData?.weight?.trim()) {
      newErrors.weight = 'Le poids est requis';
    } else if (isNaN(formData?.weight) || formData?.weight <= 0) {
      newErrors.weight = "Veuillez entrer un poids valide";
    } else if (formData?.weight > 100) {
      newErrors.weight = "Le poids maximum est de 100 kg";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    if (!validateForm()) return;

    setUploading(true);

    try {
      // Upload la photo si présente
      let photoUrl = null;
      if (photoFile) {
        const { data: { user } } = await supabase.auth.getUser();
        const uploadResult = await uploadPhoto(user?.id);

        // Vérifier si l'upload a réussi
        if (!uploadResult.success) {
          alert(`❌ Erreur d'upload de la photo: ${uploadResult.error}`);
          setUploading(false);
          return;
        }

        photoUrl = uploadResult.url;
      }

      // Envoyer les données
      onSubmit({
        name: formData.name.trim(),
        breed: formData.breed,
        age: parseFloat(formData.age),
        ageUnit: formData.ageUnit,
        weight: parseFloat(formData.weight),
        gender: formData.gender,
        isSterilized: formData.isSterilized === 'yes',
        image: photoUrl || formData.image.trim() || null
      });

      // Reset form
      setFormData({
        name: '',
        breed: '',
        age: '',
        ageUnit: 'years',
        weight: '',
        gender: '',
        isSterilized: 'no',
        image: ''
      });
      setPhotoFile(null);
      setErrors({});
    } catch (err) {
      console.error('Erreur soumission:', err);
      alert('Une erreur est survenue lors de l\'ajout du chien');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFormData({ 
      name: '', 
      breed: '', 
      age: '', 
      ageUnit: 'years',
      weight: '',
      gender: '',
      isSterilized: 'no',
      image: '' 
    });
    setPhotoFile(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-elevated max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Ajouter un nouveau chien
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-smooth"
            aria-label="Fermer"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Photo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Photo du chien
            </label>
            
            {/* Preview */}
            {formData.image && (
              <div className="relative w-32 h-32 mx-auto mb-3">
                <img
                  src={formData.image}
                  alt="Aperçu"
                  className="w-full h-full object-cover rounded-full border-2 border-border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, image: '' }));
                    setPhotoFile(null);
                  }}
                  className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 hover:bg-destructive/90"
                >
                  <Icon name="X" size={16} />
                </button>
              </div>
            )}

            {/* Upload button */}
            <div className="flex gap-3">
              <label className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <div className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted cursor-pointer transition-smooth">
                  <Icon name="Upload" size={20} />
                  <span className="text-sm">
                    {photoFile ? 'Changer la photo' : 'Choisir une photo'}
                  </span>
                </div>
              </label>
            </div>
            {errors?.photo && (
              <p className="text-xs text-destructive mt-1">{errors.photo}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Format: JPG, PNG, WEBP • Max: 5 MB
            </p>
          </div>

          {/* Nom */}
          <Input
            label="Nom du chien"
            type="text"
            placeholder="Ex: Max, Luna, Rocky..."
            value={formData?.name}
            onChange={(e) => handleChange('name', e?.target?.value)}
            error={errors?.name}
            required
          />

          {/* Race */}
          <Select
            label="Race"
            placeholder="Sélectionnez une race"
            options={breedOptions}
            value={formData?.breed}
            onChange={(value) => handleChange('breed', value)}
            error={errors?.breed}
            required
            searchable
          />

          {/* Sexe */}
          <Select
            label="Sexe"
            placeholder="Sélectionnez le sexe"
            options={genderOptions}
            value={formData?.gender}
            onChange={(value) => handleChange('gender', value)}
            error={errors?.gender}
            required
          />

          {/* Stérilisé */}
          <Select
            label="Stérilisé(e)"
            options={sterilizedOptions}
            value={formData?.isSterilized}
            onChange={(value) => handleChange('isSterilized', value)}
            required
          />

          {/* Âge */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Âge <span className="text-destructive">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Ex: 2"
                value={formData?.age}
                onChange={(e) => handleChange('age', e?.target?.value)}
                min="0"
                max={formData?.ageUnit === 'years' ? "30" : "360"}
                step="0.1"
                required
              />
              <Select
                options={ageUnitOptions}
                value={formData?.ageUnit}
                onChange={(value) => handleChange('ageUnit', value)}
                required
              />
            </div>
            {errors?.age && (
              <p className="text-xs text-destructive mt-1">{errors.age}</p>
            )}
          </div>

          {/* Poids */}
          <Input
            label="Poids (kg)"
            type="number"
            placeholder="Ex: 25 ou 8.5"
            value={formData?.weight}
            onChange={(e) => handleChange('weight', e?.target?.value)}
            error={errors?.weight}
            min="0"
            max="100"
            step="0.1"
            required
          />

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleClose}
              disabled={uploading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="default"
              fullWidth
              iconName={uploading ? "Loader" : "Check"}
              iconPosition="left"
              disabled={uploading}
            >
              {uploading ? 'Ajout en cours...' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDogModal;
