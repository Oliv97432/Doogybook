import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AddTreatmentModal = ({ isOpen, onClose, onSave, editData, type }) => {
  const [formData, setFormData] = useState(editData || {
    product: '',
    lastDate: '',
    nextDate: '',
    notes: ''
  });

  const getTitle = () => {
    if (type === 'vermifuge') return editData ? 'Modifier le vermifuge' : 'Ajouter un vermifuge';
    if (type === 'flea') return editData ? 'Modifier le traitement anti-puces' : 'Ajouter un traitement anti-puces';
    return 'Ajouter un traitement';
  };

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
            {getTitle()}
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
            label="Nom du produit"
            type="text"
            placeholder="Ex: Milbemax, Frontline..."
            value={formData?.product}
            onChange={(e) => setFormData({ ...formData, product: e?.target?.value })}
            required
          />

          <Input
            label="Date de la dernière application"
            type="date"
            value={formData?.lastDate}
            onChange={(e) => setFormData({ ...formData, lastDate: e?.target?.value })}
            required
          />

          <Input
            label="Date de la prochaine application"
            type="date"
            value={formData?.nextDate}
            onChange={(e) => setFormData({ ...formData, nextDate: e?.target?.value })}
            required
            description="Un rappel sera envoyé 7 jours avant"
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes (optionnel)
            </label>
            <textarea
              className="w-full min-h-24 px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              placeholder="Dosage, effets secondaires, etc."
              value={formData?.notes}
              onChange={(e) => setFormData({ ...formData, notes: e?.target?.value })}
            />
          </div>

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

export default AddTreatmentModal;