import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const EditProfileModal = ({ isOpen, onClose, onSave, profile }) => {
  const [formData, setFormData] = useState(profile || {
    name: '',
    breed: '',
    age: '',
    weight: '',
    gender: '',
    sterilized: '',
    image: ''
  });

  const genderOptions = [
    { value: 'Mâle', label: 'Mâle' },
    { value: 'Femelle', label: 'Femelle' }
  ];

  const sterilizedOptions = [
    { value: 'Stérilisé', label: 'Stérilisé' },
    { value: 'Non stérilisé', label: 'Non stérilisé' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
      <div className="bg-popover rounded-lg shadow-elevated w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-popover border-b border-border p-6 flex items-center justify-between">
          <h3 className="text-xl font-heading font-semibold text-foreground">
            Modifier le profil
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-smooth"
            aria-label="Fermer"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom"
              type="text"
              placeholder="Ex: Max"
              value={formData?.name}
              onChange={(e) => setFormData({ ...formData, name: e?.target?.value })}
              required
            />

            <Input
              label="Race"
              type="text"
              placeholder="Ex: Berger Malinois"
              value={formData?.breed}
              onChange={(e) => setFormData({ ...formData, breed: e?.target?.value })}
              required
            />

            <Input
              label="Âge"
              type="text"
              placeholder="Ex: 3 ans"
              value={formData?.age}
              onChange={(e) => setFormData({ ...formData, age: e?.target?.value })}
              required
            />

            <Input
              label="Poids actuel"
              type="text"
              placeholder="Ex: 28 kg"
              value={formData?.weight}
              onChange={(e) => setFormData({ ...formData, weight: e?.target?.value })}
              required
            />

            <Select
              label="Sexe"
              options={genderOptions}
              value={formData?.gender}
              onChange={(value) => setFormData({ ...formData, gender: value })}
              required
            />

            <Select
              label="Statut de stérilisation"
              options={sterilizedOptions}
              value={formData?.sterilized}
              onChange={(value) => setFormData({ ...formData, sterilized: value })}
              required
            />
          </div>

          <Input
            label="URL de la photo"
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={formData?.image}
            onChange={(e) => setFormData({ ...formData, image: e?.target?.value })}
            description="Lien vers une photo de votre chien"
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="default"
              iconName="Check"
              iconPosition="left"
              className="flex-1"
            >
              Enregistrer
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;