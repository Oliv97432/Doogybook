import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyBanner = ({ onEmergencyCall }) => {
  const emergencyNumber = "15";

  return (
    <div className="bg-error/10 border-2 border-error rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-error flex items-center justify-center flex-shrink-0 animate-pulse">
          <Icon name="AlertCircle" size={24} color="white" />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-heading font-semibold text-error mb-2">
            Urgence Vétérinaire
          </h2>
          <p className="text-sm text-foreground font-caption mb-4">
            En cas d'urgence vitale pour votre animal, contactez immédiatement les services d'urgence vétérinaire disponibles 24h/24 et 7j/7.
          </p>

          <Button
            variant="destructive"
            size="lg"
            iconName="Phone"
            iconPosition="left"
            onClick={() => onEmergencyCall(emergencyNumber)}
            className="w-full sm:w-auto"
          >
            Appeler le {emergencyNumber}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyBanner;