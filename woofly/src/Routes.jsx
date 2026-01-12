import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// ==========================================
// 🎨 LOADING SCREEN COMPONENT
// ==========================================
const LoadingScreen = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mb-4"></div>
      <p className="text-muted-foreground text-sm">Chargement...</p>
    </div>
  </div>
);

// ==========================================
// 🚀 LAZY LOADING - TOUTES LES PAGES
// ==========================================

// Pages principales
const NotFound = lazy(() => import("pages/NotFound"));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/login'));
const Register = lazy(() => import('./pages/register'));

// Dashboard
const DashboardRedirect = lazy(() => import('./components/DashboardRedirect'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Profils chiens
const DogProfile = lazy(() => import('./pages/dog-profile'));
const MultiProfileManagement = lazy(() => import('./pages/multi-profile-management'));
const HybridDogProfile = lazy(() => import('./pages/chien/HybridDogProfile'));
const ClaimDogPage = lazy(() => import('./pages/ClaimDogPage'));

// Social & Forum
const SocialFeed = lazy(() => import('./pages/social-feed'));
const ForumHub = lazy(() => import('./pages/forum-hub'));
const ForumDetail = lazy(() => import('./pages/forum-detail'));
const ForumDiscussion = lazy(() => import('./pages/forum-discussion'));
const PostDetail = lazy(() => import('./pages/post-detail'));

// Utilitaires
const DailyTip = lazy(() => import('./pages/daily-tip'));
const ImportantContacts = lazy(() => import('./pages/important-contacts'));
const Notifications = lazy(() => import('./pages/Notifications'));

// Profil utilisateur
const UserProfile = lazy(() => import('./pages/profile/UserProfile'));
const Settings = lazy(() => import('./pages/settings'));

// Adoption publique
const PublicAdoptionPage = lazy(() => import('./pages/PublicAdoptionPage'));
const PublicDogDetail = lazy(() => import('./pages/PublicDogDetail'));

// Premium
const PremiumPage = lazy(() => import('./pages/PremiumPage'));
const RecipesPage = lazy(() => import('./pages/RecipesPage'));
const RemindersPage = lazy(() => import('./pages/RemindersPage'));

// Pages professionnelles
const ProRegistration = lazy(() => import('./pages/pro/ProRegistration'));
const ProDashboard = lazy(() => import('./pages/pro/ProDashboard'));
const ProSettings = lazy(() => import('./pages/pro/ProSettings'));
const ProDogManagement = lazy(() => import('./pages/pro/ProDogManagement'));
const ProDogDetail = lazy(() => import('./pages/pro/ProDogDetail'));
const ProDogsList = lazy(() => import('./pages/pro/ProDogsList'));
const ProFosterFamilies = lazy(() => import('./pages/pro/ProFosterFamilies'));
const ProApplications = lazy(() => import('./pages/pro/ProApplications'));
const InstagramGenerator = lazy(() => import('./pages/pro/InstagramGenerator'));

// CRM
const CRMContacts = lazy(() => import('./pages/pro/crm/CRMContacts'));
const CRMContactDetail = lazy(() => import('./pages/pro/crm/CRMContactDetail'));
const CRMContactForm = lazy(() => import('./pages/pro/crm/CRMContactForm'));

// Pages légales
const CGU = lazy(() => import('./pages/CGU'));
const MentionsLegales = lazy(() => import('./pages/MentionsLegales'));
const PolitiqueConfidentialite = lazy(() => import('./pages/PolitiqueConfidentialite'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

// ==========================================
// 🎯 ROUTES COMPONENT
// ==========================================
const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<LoadingScreen />}>
          <RouterRoutes>
            {/* Landing & Auth */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Dashboard */}
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            
            {/* Profils chiens */}
            <Route path="/chien/:id" element={<HybridDogProfile />} />
            <Route path="/dog-profile" element={<DogProfile />} />
            <Route path="/dog-profile/:id" element={<DogProfile />} />
            <Route path="/multi-profile-management" element={<MultiProfileManagement />} />
            <Route path="/claim-dog" element={<ClaimDogPage />} />
            
            {/* Social & Forum */}
            <Route path="/social-feed" element={<SocialFeed />} />
            <Route path="/forum-hub" element={<ForumHub />} />
            <Route path="/forum/:slug" element={<ForumDetail />} />
            <Route path="/forum-discussion" element={<ForumDiscussion />} />
            <Route path="/post/:id" element={<PostDetail />} />
            
            {/* Utilitaires */}
            <Route path="/daily-tip" element={<DailyTip />} />
            <Route path="/important-contacts" element={<ImportantContacts />} />
            <Route path="/notifications" element={<Notifications />} />
            
            {/* Profil utilisateur */}
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Adoption publique */}
            <Route path="/adoption" element={<PublicAdoptionPage />} />
            <Route path="/adoption/:dogId" element={<PublicDogDetail />} />
            
            {/* Premium */}
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            
            {/* Professionnel */}
            <Route path="/pro/register" element={<ProRegistration />} />
            <Route path="/pro/dashboard" element={<ProDashboard />} />
            <Route path="/pro/settings" element={<ProSettings />} />
            <Route path="/pro/dogs" element={<ProDogManagement />} />
            <Route path="/pro/dogs/new" element={<ProDogManagement />} />
            <Route path="/pro/dogs/:dogId" element={<ProDogDetail />} />
            <Route path="/pro/dogs-list" element={<ProDogsList />} />
            <Route path="/pro/foster-families" element={<ProFosterFamilies />} />
            <Route path="/pro/applications" element={<ProApplications />} />
            <Route path="/pro/instagram" element={<InstagramGenerator />} />
            
            {/* CRM */}
            <Route path="/pro/crm/contacts" element={<CRMContacts />} />
            <Route path="/pro/crm/contacts/new" element={<CRMContactForm />} />
            <Route path="/pro/crm/contacts/:contactId" element={<CRMContactDetail />} />
            <Route path="/pro/crm/contacts/:contactId/edit" element={<CRMContactForm />} />
            
            {/* Pages légales */}
            <Route path="/cgu" element={<CGU />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
