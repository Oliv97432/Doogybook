import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex?.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'L\'adresse e-mail est requise';
    } else if (!validateEmail(formData?.email)) {
      newErrors.email = 'Veuillez entrer une adresse e-mail valide';
    }

    if (!formData?.password) {
      newErrors.password = 'Le mot de passe est requis';
    }

    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await signIn(formData?.email, formData?.password);
      
      if (error) {
        setErrors({
          general: error?.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.'
        });
      } else if (data?.user) {
        navigate('/dashboard'); // ← CORRIGÉ ICI
      }
    } catch (err) {
      setErrors({
        general: 'Une erreur inattendue s\'est produite. Veuillez réessayer.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {errors?.general && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 flex items-start gap-3">
          <Icon name="AlertCircle" size={20} color="var(--color-error)" className="flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error flex-1">{errors?.general}</p>
        </div>
      )}

      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} color="var(--color-primary)" className="flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">Identifiants de démonstration</p>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Email: marie.dupont@Doogybook.fr</p>
              <p>Mot de passe: Doogybook2025!</p>
            </div>
          </div>
        </div>
      </div>

      <Input
        type="email"
        name="email"
        label="Adresse e-mail"
        placeholder="votre.email@exemple.fr"
        value={formData?.email}
        onChange={handleChange}
        error={errors?.email}
        required
        disabled={isLoading}
      />

      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          label="Mot de passe"
          placeholder="Entrez votre mot de passe"
          value={formData?.password}
          onChange={handleChange}
          error={errors?.password}
          required
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-[38px] text-muted-foreground hover:text-foreground transition-colors"
          aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          disabled={isLoading}
        >
          <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          disabled={isLoading}
        >
          Mot de passe oublié ?
        </button>
      </div>

      <Button
        type="submit"
        variant="default"
        fullWidth
        loading={isLoading}
        iconName="LogIn"
        iconPosition="right"
      >
        Se connecter
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card text-muted-foreground font-caption">
            Nouveau sur Doogybook ?
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        fullWidth
        onClick={() => navigate('/register')}
        iconName="UserPlus"
        iconPosition="left"
        disabled={isLoading}
      >
        Créer un compte
      </Button>
    </form>
  );
};

export default LoginForm;
