import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const HealthNotesSection = ({ notes, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(notes);

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(notes);
    setIsEditing(false);
  };

  return (
    <div className="bg-card rounded-lg shadow-soft p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="FileText" size={20} color="var(--color-primary)" />
          </div>
          <h3 className="text-xl font-heading font-semibold text-foreground">
            Informations médicales
          </h3>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            iconName="Edit"
            iconPosition="left"
            onClick={() => setIsEditing(true)}
          >
            Modifier
          </Button>
        )}
      </div>
      <div className="space-y-4">
        <div>
          <Input
            label="Allergies"
            type="text"
            placeholder="Ex: Poulet, pollen, acariens..."
            value={formData?.allergies}
            onChange={(e) => setFormData({ ...formData, allergies: e?.target?.value })}
            disabled={!isEditing}
            description="Listez toutes les allergies connues"
          />
        </div>

        <div>
          <Input
            label="Médicaments actuels"
            type="text"
            placeholder="Ex: Antibiotiques, anti-inflammatoires..."
            value={formData?.medications}
            onChange={(e) => setFormData({ ...formData, medications: e?.target?.value })}
            disabled={!isEditing}
            description="Traitements en cours"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Notes vétérinaires
          </label>
          <textarea
            className="w-full min-h-32 px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed resize-y"
            placeholder="Ajoutez des notes importantes sur la santé de votre chien..."
            value={formData?.veterinaryNotes}
            onChange={(e) => setFormData({ ...formData, veterinaryNotes: e?.target?.value })}
            disabled={!isEditing}
          />
          <p className="text-sm text-muted-foreground font-caption mt-2">
            Historique médical, conditions chroniques, etc.
          </p>
        </div>

        <div>
          <Input
            label="Vétérinaire principal"
            type="text"
            placeholder="Nom du vétérinaire"
            value={formData?.veterinarian}
            onChange={(e) => setFormData({ ...formData, veterinarian: e?.target?.value })}
            disabled={!isEditing}
          />
        </div>

        <div>
          <Input
            label="Téléphone vétérinaire"
            type="tel"
            placeholder="+33 1 23 45 67 89"
            value={formData?.veterinarianPhone}
            onChange={(e) => setFormData({ ...formData, veterinarianPhone: e?.target?.value })}
            disabled={!isEditing}
          />
        </div>

        {isEditing && (
          <div className="flex gap-3 pt-4">
            <Button
              variant="default"
              iconName="Check"
              iconPosition="left"
              onClick={handleSave}
              className="flex-1"
            >
              Enregistrer
            </Button>
            <Button
              variant="outline"
              iconName="X"
              iconPosition="left"
              onClick={handleCancel}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthNotesSection;