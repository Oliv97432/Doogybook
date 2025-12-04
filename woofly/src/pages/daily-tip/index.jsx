import React, { useState, useEffect } from 'react';
import { 
  ChefHat, Heart, GraduationCap, Activity, 
  Phone, MapPin, Clock, AlertCircle, Search,
  Sparkles, Stethoscope, PhoneCall, Plus, Edit
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Page Daily Tip - Conseils & Contacts
 * Tips pratiques + Vétérinaire perso + Contacts SOS
 */
const DailyTip = () => {
  const { user } = useAuth();
  const [selectedTipCategory, setSelectedTipCategory] = useState('all');
  const [tips, setTips] = useState([]);
  const [loadingTips, setLoadingTips] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userVet, setUserVet] = useState(null);
  const [showVetForm, setShowVetForm] = useState(false);
  const [vetForm, setVetForm] = useState({
    name: '',
    phone: '',
    address: '',
    hours: ''
  });

  // Catégories de tips
  const tipCategories = [
    { id: 'all', name: 'Tous', icon: Sparkles, color: 'blue' },
    { id: 'health', name: 'Santé', icon: Heart, color: 'red' },
    { id: 'nutrition', name: 'Nutrition', icon: ChefHat, color: 'orange' },
    { id: 'care', name: 'Soins', icon: Heart, color: 'pink' },
    { id: 'education', name: 'Éducation', icon: GraduationCap, color: 'purple' },
    { id: 'wellness', name: 'Bien-être', icon: Activity, color: 'green' }
  ];

  // Contacts SOS généraux uniquement
  const sosContacts = [
    {
      id: 1,
      name: 'SOS Animaux en Danger',
      phone: '01 43 11 80 00',
      description: 'Urgences vitales 24h/24',
      icon: PhoneCall,
      type: 'urgence'
    },
    {
      id: 2,
      name: 'Centre Anti-Poison Animal',
      phone: '04 78 87 10 40',
      description: 'Intoxications 24h/24',
      icon: AlertCircle,
      type: 'poison'
    }
  ];

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
      console.error('Erreur chargement tips:', error);
      setTips([]);
    } finally {
      setLoadingTips(false);
    }
  };

  const fetchUserVet = async () => {
    try {
      const { data, error } = await supabase
        .from('user_veterinarians')
        .select('*')
        .eq('user_id', user.id)
        .single();

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
      console.error('Erreur chargement vétérinaire:', error);
    }
  };

  const saveVet = async () => {
    try {
      if (userVet) {
        // Update
        const { error } = await supabase
          .from('user_veterinarians')
          .update({
            name: vetForm.name,
            phone: vetForm.phone,
            address: vetForm.address,
            hours: vetForm.hours
          })
          .eq('id', userVet.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('user_veterinarians')
          .insert({
            user_id: user.id,
            name: vetForm.name,
            phone: vetForm.phone,
            address: vetForm.address,
            hours: vetForm.hours
          });

        if (error) throw error;
      }

      await fetchUserVet();
      setShowVetForm(false);
      alert('Vétérinaire enregistré avec succès !');
    } catch (error) {
      console.error('Erreur sauvegarde vétérinaire:', error);
      alert('Erreur lors de la sauvegarde');
    }
  };

  const getCategoryInfo = (categoryId) => {
    return tipCategories.find(c => c.id === categoryId) || tipCategories[0];
  };

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-12 px-6 mb-6">
        <h1 className="text-3xl font-bold mb-2">Conseils & Contacts</h1>
        <p className="text-white/90">
          Conseils pratiques + contacts d'urgence 🐕
        </p>
      </div>

      <div className="px-6 space-y-12">
        
        {/* ========================================
            SECTION 1 : CONSEILS PRATIQUES
        ======================================== */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-yellow-500" size={28} />
            <h2 className="text-2xl font-bold text-foreground">
              Conseils Pratiques
            </h2>
          </div>

          {/* Recherche */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Catégories */}
          <div className="flex overflow-x-auto gap-3 mb-6 pb-2 -mx-6 px-6">
            {tipCategories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedTipCategory === category.id;
              
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedTipCategory(category.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    isActive ? 'bg-primary text-white shadow-lg' : 'bg-card border border-border'
                  }`}
                >
                  <Icon size={18} />
                  {category.name}
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
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Sparkles size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">
                {searchQuery ? 'Aucun conseil trouvé' : 'Aucun conseil disponible'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tips.map((tip) => {
                const categoryInfo = getCategoryInfo(tip.category);
                const Icon = categoryInfo?.icon || Sparkles;
                
                return (
                  <div key={tip.id} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${categoryInfo?.color}-100`}>
                        <Icon className={`text-${categoryInfo?.color}-600`} size={20} />
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium bg-${categoryInfo?.color}-100 text-${categoryInfo?.color}-700`}>
                        {categoryInfo?.name}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground">{tip.content}</p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Séparateur */}
        <div className="border-t border-border" />

        {/* ========================================
            SECTION 2 : MON VÉTÉRINAIRE
        ======================================== */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Stethoscope className="text-blue-500" size={28} />
              <h2 className="text-2xl font-bold text-foreground">Mon Vétérinaire</h2>
            </div>
            {userVet && !showVetForm && (
              <button
                onClick={() => setShowVetForm(true)}
                className="text-primary text-sm font-medium flex items-center gap-1"
              >
                <Edit size={16} />
                Modifier
              </button>
            )}
          </div>

          {showVetForm ? (
            // Formulaire
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom du cabinet</label>
                  <input
                    type="text"
                    value={vetForm.name}
                    onChange={(e) => setVetForm({...vetForm, name: e.target.value})}
                    placeholder="Clinique Vétérinaire..."
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={vetForm.phone}
                    onChange={(e) => setVetForm({...vetForm, phone: e.target.value})}
                    placeholder="01 23 45 67 89"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Adresse</label>
                  <input
                    type="text"
                    value={vetForm.address}
                    onChange={(e) => setVetForm({...vetForm, address: e.target.value})}
                    placeholder="123 rue..."
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Horaires</label>
                  <input
                    type="text"
                    value={vetForm.hours}
                    onChange={(e) => setVetForm({...vetForm, hours: e.target.value})}
                    placeholder="Lun-Ven: 9h-19h"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={saveVet}
                    className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold"
                  >
                    Enregistrer
                  </button>
                  <button
                    onClick={() => setShowVetForm(false)}
                    className="px-6 py-3 border border-border rounded-lg"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          ) : userVet ? (
            // Affichage vétérinaire
            <div className="bg-card border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Stethoscope className="text-blue-600" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">{userVet.name}</h3>
                  <div className="space-y-2">
                    <a
                      href={`tel:${userVet.phone?.replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-primary font-semibold"
                    >
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
                href={`tel:${userVet.phone?.replace(/\s/g, '')}`}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold text-center block"
              >
                <Phone size={18} className="inline mr-2" />
                Appeler mon vétérinaire
              </a>
            </div>
          ) : (
            // Ajouter vétérinaire
            <button
              onClick={() => setShowVetForm(true)}
              className="w-full bg-card border-2 border-dashed border-border rounded-xl p-8 hover:border-primary transition-all"
            >
              <Plus size={32} className="text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground">Ajouter mon vétérinaire</p>
              <p className="text-sm text-muted-foreground mt-1">
                Gardez les coordonnées à portée de main
              </p>
            </button>
          )}
        </section>

        {/* ========================================
            SECTION 3 : SOS ANIMAUX EN DANGER
        ======================================== */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <PhoneCall className="text-red-500" size={28} />
            <h2 className="text-2xl font-bold text-foreground">SOS Animaux en Danger</h2>
          </div>

          <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={24} />
              <p className="text-sm text-red-900">
                <strong>Urgence vitale :</strong> Contactez immédiatement un vétérinaire. Ne perdez pas de temps.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {sosContacts.map((contact) => {
              const Icon = contact.icon;
              return (
                <div key={contact.id} className="bg-card border-2 border-red-200 rounded-xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center">
                      <Icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-1">{contact.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{contact.description}</p>
                      <a
                        href={`tel:${contact.phone.replace(/\s/g, '')}`}
                        className="flex items-center gap-2 text-primary font-semibold"
                      >
                        <Phone size={18} />
                        {contact.phone}
                      </a>
                    </div>
                  </div>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, '')}`}
                    className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold text-center block"
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
    </div>
  );
};

export default DailyTip;
