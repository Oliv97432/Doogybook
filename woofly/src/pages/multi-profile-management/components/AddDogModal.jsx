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
    { value: 'mixed', label: 'Race mixte' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData?.name?.trim()) newErrors.name = 'Le nom est requis';
    if (!formData?.breed) newErrors.breed = 'La race est requise';
    if (!formData?.age?.trim()) newErrors.age = "L'âge est requis";
    if (!formData?.weight?.trim()) newErrors.weight = 'Le poids est requis';
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ name: '', breed: '', age: '', weight: '', image: '' });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-elevated max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Ajouter un nouveau chien
          </h2>
          <button
            onClick={onClose}
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

          <Input
            label="Âge"
            type="text"
            placeholder="Ex: 2 ans, 6 mois..."
            value={formData?.age}
            onChange={(e) => handleChange('age', e?.target?.value)}
            error={errors?.age}
            required
          />

          <Input
            label="Poids"
            type="text"
            placeholder="Ex: 25 kg, 8.5 kg..."
            value={formData?.weight}
            onChange={(e) => handleChange('weight', e?.target?.value)}
            error={errors?.weight}
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
              onClick={onClose}
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