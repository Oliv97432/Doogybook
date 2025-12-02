import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const RegistrationForm = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [ownerData, setOwnerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [dogData, setDogData] = useState({
    dogName: '',
    breed: '',
    age: ''
  });

  const [acceptTerms, setAcceptTerms] = useState(false);

  const [errors, setErrors] = useState({});

  const breedOptions = [
    { value: 'malinois', label: 'Malinois' },
    { value: 'shih-tzu', label: 'Shih-Tzu' },
    { value: 'american-bully', label: 'American Bully' },
    { value: 'golden-retriever', label: 'Golden Retriever' },
    { value: 'labrador', label: 'Labrador' },
    { value: 'berger-allemand', label: 'Berger Allemand' },
    { value: 'bouledogue-francais', label: 'Bouledogue Français' },
    { value: 'chihuahua', label: 'Chihuahua' },
    { value: 'husky', label: 'Husky Sibérien' },
    { value: 'beagle', label: 'Beagle' },
    { value: 'mixed', label: 'Race Mixte' },
    { value: 'other', label: 'Autre' }
  ];

  const validateStep1 = () => {
    const newErrors = {};

    if (!ownerData?.firstName?.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!ownerData?.lastName?.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!ownerData?.email?.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/?.test(ownerData?.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    if (!ownerData?.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (ownerData?.password?.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/?.test(ownerData?.password)) {
      newErrors.password = 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre';
    }

    if (!ownerData?.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (ownerData?.password !== ownerData?.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!dogData?.dogName?.trim()) {
      newErrors.dogName = 'Le nom du chien est requis';
    }

    if (!dogData?.breed) {
      newErrors.breed = 'Veuillez sélectionner une race';
    }

    if (!dogData?.age) {
      newErrors.age = 'L\'âge est requis';
    } else if (isNaN(dogData?.age) || dogData?.age < 0 || dogData?.age > 30) {
      newErrors.age = 'Veuillez entrer un âge valide (0-30 ans)';
    }

    if (!acceptTerms) {
      newErrors.terms = 'Vous devez accepter les conditions d\'utilisation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleOwnerChange = (field, value) => {
    setOwnerData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDogChange = (field, value) => {
    setDogData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { data, error } = await signUp(
        ownerData?.email,
        ownerData?.password,
        `${ownerData?.firstName} ${ownerData?.lastName}`,
        dogData?.dogName,
        dogData?.breed,
        dogData?.age
      );

      if (error) {
        setErrors({
          general: error?.message || 'Échec de l\'inscription. Veuillez réessayer.'
        });
      } else if (data?.user) {
        setCurrentStep(3);
      }
    } catch (err) {
      setErrors({
        general: 'Une erreur inattendue s\'est produite. Veuillez réessayer.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4 flex-1">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            {currentStep > 1 ? <Icon name="Check" size={20} /> : <span className="font-semibold">1</span>}
          </div>
          <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
            <div className={`h-full bg-primary transition-all duration-300 ${currentStep >= 2 ? 'w-full' : 'w-0'}`} />
          </div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
            <span className="font-semibold">2</span>
          </div>
        </div>
      </div>
      {currentStep === 1 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
              Vos informations
            </h3>
            <p className="text-sm text-muted-foreground font-caption">
              Créez votre compte pour commencer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prénom"
              type="text"
              placeholder="Entrez votre prénom"
              value={ownerData?.firstName}
              onChange={(e) => handleOwnerChange('firstName', e?.target?.value)}
              error={errors?.firstName}
              required
            />

            <Input
              label="Nom"
              type="text"
              placeholder="Entrez votre nom"
              value={ownerData?.lastName}
              onChange={(e) => handleOwnerChange('lastName', e?.target?.value)}
              error={errors?.lastName}
              required
            />
          </div>

          <Input
            label="Adresse email"
            type="email"
            placeholder="votre.email@exemple.fr"
            value={ownerData?.email}
            onChange={(e) => handleOwnerChange('email', e?.target?.value)}
            error={errors?.email}
            description="Nous ne partagerons jamais votre email"
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="Créez un mot de passe sécurisé"
            value={ownerData?.password}
            onChange={(e) => handleOwnerChange('password', e?.target?.value)}
            error={errors?.password}
            description="Au moins 8 caractères avec majuscule, minuscule et chiffre"
            required
          />

          <Input
            label="Confirmer le mot de passe"
            type="password"
            placeholder="Confirmez votre mot de passe"
            value={ownerData?.confirmPassword}
            onChange={(e) => handleOwnerChange('confirmPassword', e?.target?.value)}
            error={errors?.confirmPassword}
            required
          />

          <Button
            type="button"
            variant="default"
            fullWidth
            onClick={handleNextStep}
            iconName="ArrowRight"
            iconPosition="right"
          >
            Continuer
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground font-caption">
              Vous avez déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-primary hover:underline font-medium"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      )}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
              Informations sur votre chien
            </h3>
            <p className="text-sm text-muted-foreground font-caption">
              Parlez-nous de votre compagnon
            </p>
          </div>

          <Input
            label="Nom du chien"
            type="text"
            placeholder="Ex: Max, Bella, Rex..."
            value={dogData?.dogName}
            onChange={(e) => handleDogChange('dogName', e?.target?.value)}
            error={errors?.dogName}
            required
          />

          <Select
            label="Race"
            placeholder="Sélectionnez la race"
            options={breedOptions}
            value={dogData?.breed}
            onChange={(value) => handleDogChange('breed', value)}
            error={errors?.breed}
            searchable
            required
          />

          <Input
            label="Âge (en années)"
            type="number"
            placeholder="Ex: 3"
            value={dogData?.age}
            onChange={(e) => handleDogChange('age', e?.target?.value)}
            error={errors?.age}
            min="0"
            max="30"
            required
          />

          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <Checkbox
              label="J'accepte les conditions d'utilisation et la politique de confidentialité"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e?.target?.checked);
                if (errors?.terms) {
                  setErrors(prev => ({ ...prev, terms: '' }));
                }
              }}
              error={errors?.terms}
              required
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
              iconName="ArrowLeft"
              iconPosition="left"
              className="flex-1"
            >
              Retour
            </Button>

            <Button
              type="submit"
              variant="default"
              loading={loading}
              iconName="Check"
              iconPosition="right"
              className="flex-1"
            >
              Créer mon compte
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default RegistrationForm;