import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddDogModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    ageUnit: 'years', // 'years' or 'months'
    weight: '',
    image: ''
  });

  const [errors, setErrors] = useState({});

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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      // Envoyer les données dans le bon format
      onSubmit({
        name: formData.name.trim(),
        breed: formData.breed,
        age: parseFloat(formData.age), // Convertir en nombre
        ageUnit: formData.ageUnit,
        weight: parseFloat(formData.weight), // Convertir en nombre
        image: formData.image.trim() || null
      });
      
      // Reset form
      setFormData({ 
        name: '', 
        breed: '', 
        age: '', 
        ageUnit: 'years',
        weight: '', 
        image: '' 
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({ 
      name: '', 
      breed: '', 
      age: '', 
      ageUnit: 'years',
      weight: '', 
      image: '' 
    });
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
          <Input
            label="Nom du chien"
            type="text"
            placeholder="Ex: Max, Luna, Rocky..."
            value={formData?.name}
            onChange={(e) => handleChange('name', e?.target?.value)}
            error={errors?.name}
            required
          />

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

          <Input
            label="Photo (URL)"
            type="url"
            placeholder="https://exemple.com/photo.jpg"
            description="Optionnel - Ajoutez une photo de votre chien"
            value={formData?.image}
            onChange={(e) => handleChange('image', e?.target?.value)}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleClose}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="default"
              fullWidth
              iconName="Check"
              iconPosition="left"
            >
              Ajouter
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDogModal;
