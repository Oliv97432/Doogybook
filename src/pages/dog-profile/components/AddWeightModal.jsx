import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AddWeightModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    weight: '',
    date: new Date()?.toISOString()?.split('T')?.[0]
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSave(formData);
    onClose();
    setFormData({ weight: '', date: new Date()?.toISOString()?.split('T')?.[0] });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
      <div className="bg-popover rounded-lg shadow-elevated w-full max-w-md">
        <div className="bg-popover border-b border-border p-6 flex items-center justify-between">
          <h3 className="text-xl font-heading font-semibold text-foreground">
            Ajouter une pesée
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
          <Input
            label="Poids (kg)"
            type="number"
            step="0.1"
            placeholder="Ex: 25.5"
            value={formData?.weight}
            onChange={(e) => setFormData({ ...formData, weight: e?.target?.value })}
            required
            description="Entrez le poids en kilogrammes"
          />

          <Input
            label="Date de la pesée"
            type="date"
            value={formData?.date}
            onChange={(e) => setFormData({ ...formData, date: e?.target?.value })}
            required
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

export default AddWeightModal;