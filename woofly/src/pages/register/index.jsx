import React from 'react';
import { Helmet } from 'react-helmet';
import AuthenticationShell from '../../components/AuthenticationShell';
import RegistrationForm from './components/RegistrationForm';
import WelcomeMessage from './components/WelcomeMessage';

const Register = () => {
  return (
    <>
      <Helmet>
        <title>Inscription - Woofly</title>
        <meta name="description" content="Créez votre compte Woofly et commencez à gérer la santé de votre chien. Rejoignez une communauté de propriétaires passionnés." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
            <div className="hidden lg:flex flex-col justify-center">
              <WelcomeMessage />
            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-md">
                <AuthenticationShell
                  title="Créer un compte"
                  subtitle="Rejoignez la communauté Woofly"
                >
                  <RegistrationForm />
                </AuthenticationShell>
              </div>
            </div>

            <div className="lg:hidden">
              <WelcomeMessage />
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border py-3 px-4 lg:hidden">
          <p className="text-xs text-center text-muted-foreground font-caption">
            En créant un compte, vous acceptez nos conditions d'utilisation
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;