import React, { useState, useEffect } from 'react';
import { 
  ChefHat, Heart, GraduationCap, Activity, 
  Phone, MapPin, Clock, AlertCircle, Search,
  Sparkles, Stethoscope, PhoneCall, Plus, Edit
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import TabNavigation from '../../components/TabNavigation';
import ProfileSwitcher from '../../components/ProfileSwitcher';
import Footer from '../../components/Footer';

/**
 * Page Daily Tip - Conseils & Contacts
 * Même structure que ForumHub
 */
const DailyTip = () => {
  const { user } = useAuth();
  const [selectedTipCategory, setSelectedTipCategory] = useState('all');
  const [tips, setTips] = useState([]);
  const [loadingTips, setLoadingTips] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userVet, setUserVet] = useState(null);
  const [showVetForm, setShowVetForm] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [vetForm, setVetForm] = useState({
    name: '',
    phone: '',
    address: '',
    hours: ''
  });

  // Profils de chiens (comme ForumHub)
  const dogProfiles = [
    {
      id: 1,
      name: "Max",
      breed: "Malinois",
      image: "https://images.unsplash.com/photo-1713917032646-4703f3feffde",
      imageAlt: "Malinois dog with alert expression"
    },
    {
      id: 2,
      name: "Luna",
      breed: "Shih-Tzu",
      image: "https://images.unsplash.com/photo-1579466420284-ad894bf675c8",
      imageAlt: "Small Shih-Tzu dog"
    }
  ];

  // Catégories
  const tipCategories = [
    { id: 'all', name: 'Tous', icon: Sparkles, color: 'blue' },
    { id: 'health', name: 'Santé', icon: Heart, color: 'red' },
    { id: 'nutrition', name: 'Nutrition', icon: ChefHat, color: 'orange' },
    { id: 'care', name: 'Soins', icon: Heart, color: 'pink' },
    { id: 'education', name: 'Éducation', icon: GraduationCap, color: 'purple' },
    { id: 'wellness', name: 'Bien-être', icon: Activity, color: 'green' }
  ];

  // Contacts SOS
  const sosContacts = [
    {
      id: 1,
      name: 'SOS Animaux en Danger',
      phone: '01 43 11 80 00',
      description: 'Urgences vitales 24h/24',
      icon: PhoneCall
    },
    {
      id: 2,
      name: 'Centre Anti-Poison Animal',
      phone: '04 78 87 10 40',
      description: 'Intoxications 24h/24',
      icon: AlertCircle
    }
  ];

  useEffect(() => {
    const savedProfile = localStorage.getItem('currentDogProfile');
    if (savedProfile) {
      setCurrentProfile(JSON.parse(savedProfile));
    } else if (dogProfiles?.length > 0) {
      setCurrentProfile(dogProfiles[0]);
      localStorage.setItem('currentDogProfile', JSON.stringify(dogProfiles[0]));
    }
  }, []);

  useEffect(() => {
    fetchTips();
    if (user?.id) {
      fetchUserVet();
    }
  }, [selectedTipCategory, searchQuery, user?.id]);

  const fetchTips = async () => {
    try {
      setLoadingTips(true);
      
      let query = supabase
        .from('tips')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(9);
      
      if (selectedTipCategory !== 'all') {
        query = query.eq('category', selectedTipCategory);
      }
      
      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      setTips(data || []);
    } catch (error) {
      console.error('Erreur tips:', error);
      setTips([]);
    } finally {
      setLoadingTips(false);
    }
  };

  const fetchUserVet = async () => {
    try {
      const { data } = await supabase
        .from('user_veterinarians')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setUserVet(data);
        setVetForm({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          hours: data.hours || ''
        });
      }
    } catch (error) {
      console.error('Erreur vét:', error);
    }
  };

  const saveVet = async () => {
    try {
      if (userVet) {
        await supabase
          .from('user_veterinarians')
          .update(vetForm)
          .eq('id', userVet.id);
      } else {
        await supabase
          .from('user_veterinarians')
          .insert({ ...vetForm, user_id: user.id });
      }
      await fetchUserVet();
      setShowVetForm(false);
      alert('✅ Vétérinaire enregistré !');
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la sauvegarde');
    }
  };

  const handleProfileChange = (profile) => {
    setCurrentProfile(profile);
    localStorage.setItem('currentDogProfile', JSON.stringify(profile));
  };

  const getCategoryInfo = (categoryId) => {
    return tipCategories.find(c => c.id === categoryId) || tipCategories[0];
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header sticky (comme ForumHub) */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-heading font-semibold text-foreground">
                Conseils & Contacts
              </h1>
            </div>
            <ProfileSwitcher
              profiles={dogProfiles}
              currentProfile={currentProfile}
              onProfileChange={handleProfileChange}
            />
          </div>
        </div>
      </div>

      {/* TabNavigation (comme ForumHub) */}
      <TabNavigation />

      {/* Main content */}
      <main className="main-content flex-1">
        <div className="max-w-screen-xl mx-auto px-4 py-6 space-y-8">
          
          {/* ========== CONSEILS PRATIQUES ========== */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
                  Conseils Pratiques
                </h2>
                <p className="text-muted-foreground font-caption">
                  Recettes, soins, éducation et bien-être pour votre chien
                </p>
              </div>
            </div>

            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Rechercher un conseil..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-card"
              />
            </div>

            {/* Catégories */}
            <div className="flex overflow-x-auto gap-3 pb-2">
              {tipCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedTipCategory(cat.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-smooth ${
                      selectedTipCategory === cat.id 
                        ? 'bg-primary text-primary-foreground shadow-soft' 
                        : 'bg-card border border-border text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon size={18} />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Liste tips */}
            {loadingTips ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : tips.length === 0 ? (
              <div className="bg-card rounded-lg p-8 text-center border border-border">
                <Sparkles size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-caption">
                  {searchQuery ? 'Aucun conseil trouvé pour votre recherche' : 'Aucun conseil disponible pour le moment'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tips.map((tip) => {
                  const catInfo = getCategoryInfo(tip.category);
                  const Icon = catInfo?.icon || Sparkles;
                  
                  return (
                    <div key={tip.id} className="bg-card border border-border rounded-lg p-5 hover:shadow-soft transition-smooth">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                          <Icon className="text-primary" size={20} />
                        </div>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-primary/10 text-primary">
                          {catInfo?.name}
                        </span>
                      </div>
                      <h3 className="font-heading font-semibold text-foreground mb-2">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground font-caption">{tip.content}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* ========== MON VÉTÉRINAIRE ========== */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
                  Mon Vétérinaire
                </h2>
                <p className="text-muted-foreground font-caption">
                  Gardez les coordonnées de votre vétérinaire à portée de main
                </p>
              </div>
              {userVet && !showVetForm && (
                <button
                  onClick={() => setShowVetForm(true)}
                  className="text-primary text-sm font-medium hover:underline flex items-center gap-1"
                >
                  <Edit size={16} />
                  Modifier
                </button>
              )}
            </div>

            {showVetForm ? (
              // Formulaire
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nom du cabinet</label>
                    <input
                      type="text"
                      value={vetForm.name}
                      onChange={(e) => setVetForm({...vetForm, name: e.target.value})}
                      placeholder="Clinique Vétérinaire..."
                      className="w-full px-4 py-2 border border-border rounded-lg bg-card"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                    <input
                      type="tel"
                      value={vetForm.phone}
                      onChange={(e) => setVetForm({...vetForm, phone: e.target.value})}
                      placeholder="01 23 45 67 89"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-card"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Adresse</label>
                    <input
                      type="text"
                      value={vetForm.address}
                      onChange={(e) => setVetForm({...vetForm, address: e.target.value})}
                      placeholder="123 rue..."
                      className="w-full px-4 py-2 border border-border rounded-lg bg-card"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Horaires</label>
                    <input
                      type="text"
                      value={vetForm.hours}
                      onChange={(e) => setVetForm({...vetForm, hours: e.target.value})}
                      placeholder="Lun-Ven: 9h-19h"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-card"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={saveVet}
                      className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-smooth"
                    >
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setShowVetForm(false)}
                      className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-smooth"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              </div>
            ) : userVet ? (
              // Affichage vétérinaire
              <div className="bg-card border-2 border-blue-200 rounded-lg p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Stethoscope className="text-blue-600" size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-foreground mb-3">{userVet.name}</h3>
                    <div className="space-y-2">
                      <a href={`tel:${userVet.phone}`} className="flex items-center gap-2 text-primary font-semibold hover:underline">
                        <Phone size={18} />
                        {userVet.phone}
                      </a>
                      {userVet.address && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin size={16} />
                          {userVet.address}
                        </div>
                      )}
                      {userVet.hours && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock size={16} />
                          {userVet.hours}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <a
                  href={`tel:${userVet.phone}`}
                  className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium text-center block hover:bg-blue-600 transition-smooth"
                >
                  <Phone size={18} className="inline mr-2" />
                  Appeler mon vétérinaire
                </a>
              </div>
            ) : (
              // Bouton ajouter
              <button
                onClick={() => setShowVetForm(true)}
                className="w-full bg-card border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-smooth"
              >
                <Plus size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-foreground">Ajouter mon vétérinaire</p>
                <p className="text-sm text-muted-foreground font-caption mt-1">
                  Gardez les coordonnées à portée de main
                </p>
              </button>
            )}
          </section>

          {/* ========== SOS ANIMAUX ========== */}
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground mb-1">
                SOS Animaux en Danger
              </h2>
              <p className="text-muted-foreground font-caption">
                Contacts d'urgence disponibles 24h/24
              </p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={24} />
                <p className="text-sm text-red-900 font-caption">
                  <strong>Urgence vitale :</strong> Contactez immédiatement un vétérinaire. Ne perdez pas de temps.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sosContacts.map((contact) => {
                const Icon = contact.icon;
                return (
                  <div key={contact.id} className="bg-card border-2 border-red-200 rounded-lg p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold text-foreground mb-1">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground font-caption mb-3">{contact.description}</p>
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-primary font-semibold hover:underline">
                          <Phone size={18} />
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                    <a
                      href={`tel:${contact.phone.replace(/\s/g, '')}`}
                      className="w-full bg-red-500 text-white py-3 rounded-lg font-medium text-center block hover:bg-red-600 transition-smooth"
                    >
                      <Phone size={18} className="inline mr-2" />
                      Appeler maintenant
                    </a>
                  </div>
                );
              })}
            </div>
          </section>

        </div>
      </main>

      {/* Footer (comme ForumHub) */}
      <Footer />
    </div>
  );
};

export default DailyTip;
