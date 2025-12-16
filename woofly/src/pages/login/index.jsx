import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationShell from '../../components/AuthenticationShell';
import WelcomeSection from './components/WelcomeSection';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('Doogybook_user');
    if (user) {
      navigate('/dog-profile');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="hidden lg:block">
              <WelcomeSection />
            </div>

            <div className="w-full">
              <AuthenticationShell
                title="Connexion"
                subtitle="Accédez à votre espace personnel"
              >
                <div className="lg:hidden mb-6">
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-heading font-semibold text-foreground">
                      Bienvenue sur Doogybook
                    </h2>
                    <p className="text-muted-foreground font-caption">
                      Prenez soin de votre meilleur ami
                    </p>
                  </div>
                </div>

                <LoginForm />
                
                <TrustSignals />
              </AuthenticationShell>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-sm border-t border-border py-3 px-4">
        <p className="text-center text-xs text-muted-foreground font-caption">
          © {new Date()?.getFullYear()} Doogybook. Tous droits réservés. | Fait avec ❤️ pour nos amis à quatre pattes
        </p>
      </div>
    </div>
  );
};

export default Login;