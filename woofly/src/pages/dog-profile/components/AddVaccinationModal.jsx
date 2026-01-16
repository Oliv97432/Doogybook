import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AddVaccinationModal = ({ isOpen, onClose, onSave, editData }) => {
  const [formData, setFormData] = useState(editData || {
    name: '',
    lastDate: '',
    nextDate: ''
  });

  const handleSubmit = (e) => {
    e?.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
      <div className="bg-popover rounded-lg shadow-elevated w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-popover border-b border-border p-6 flex items-center justify-between">
          <h3 className="text-xl font-heading font-semibold text-foreground">
            {editData ? 'Modifier la vaccination' : 'Ajouter une vaccination'}
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
            label="Nom du vaccin"
            type="text"
            placeholder="Ex: Rage, DHPP, Leptospirose..."
            value={formData?.name}
            onChange={(e) => setFormData({ ...formData, name: e?.target?.value })}
            required
          />

          <Input
            label="Date de la dernière dose"
            type="date"
            value={formData?.lastDate}
            onChange={(e) => setFormData({ ...formData, lastDate: e?.target?.value })}
            required
          />

          <Input
            label="Date de la prochaine dose"
            type="date"
            value={formData?.nextDate}
            onChange={(e) => setFormData({ ...formData, nextDate: e?.target?.value })}
            required
            description="Un rappel sera envoyé 30 jours avant"
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

export default AddVaccinationModal;