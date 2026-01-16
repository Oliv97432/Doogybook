import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import TabNavigationPro from '../../../components/TabNavigationPro';
import UserMenuPro from '../../../components/UserMenuPro';
import Icon from '../../../components/AppIcon';
import { 
  ArrowLeft, Edit, Trash2, Plus, Phone, Mail, MapPin,
  Home, Star, Calendar, FileText, Dog, AlertCircle,
  CheckCircle, Clock, User, X
} from 'lucide-react';

const CRMContactDetail = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [proAccount, setProAccount] = useState(null);
  const [contact, setContact] = useState(null);
  const [placementHistory, setPlacementHistory] = useState([]);
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState('info');

  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [noteForm, setNoteForm] = useState({
    note_type: 'general',
    title: '',
    description: '',
    is_important: false
  });

  useEffect(() => {
    if (user) {
      fetchProAccount();
    }
  }, [user]);

  useEffect(() => {
    if (proAccount && contactId) {
      fetchContact();
      fetchPlacementHistory();
      fetchNotes();
    }
  }, [proAccount, contactId]);

  const fetchProAccount = async () => {
    try {
      const { data, error } = await supabase
        .from('professional_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProAccount(data);
    } catch (err) {
      console.error('Erreur:', err);
      navigate('/pro/register');
    }
  };

  const fetchContact = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('id', contactId)
        .single();

      if (error) throw error;
      setContact(data);
    } catch (err) {
      console.error('Erreur chargement contact:', err);
      navigate('/pro/crm/contacts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlacementHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('placement_history')
        .select(`
          *,
          dogs(id, name, breed, photo_url)
        `)
        .eq('contact_id', contactId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      setPlacementHistory(data || []);
    } catch (err) {
      console.error('Erreur chargement historique:', err);
    }
  };

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_notes')
        .select('*')
        .eq('contact_id', contactId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error('Erreur chargement notes:', err);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('contact_notes')
        .insert([{
          contact_id: contactId,
          professional_account_id: proAccount.id,
          created_by_user_id: user.id,
          ...noteForm
        }]);

      if (error) throw error;

      alert('✅ Note ajoutée !');
      setShowAddNoteModal(false);
      setNoteForm({
        note_type: 'general',
        title: '',
        description: '',
        is_important: false
      });
      fetchNotes();
    } catch (err) {
      console.error('Erreur ajout note:', err);
      alert('❌ Erreur lors de l\'ajout de la note');
    }
  };

  const deleteNote = async (noteId) => {
    if (!confirm('Supprimer cette note ?')) return;

    try {
      const { error } = await supabase
        .from('contact_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      alert('✅ Note supprimée');
      fetchNotes();
    } catch (err) {
      console.error('Erreur suppression note:', err);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const deleteContact = async () => {
    if (!confirm(`Supprimer définitivement ${contact.full_name} ?`)) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;
      alert('✅ Contact supprimé');
      navigate('/pro/crm/contacts');
    } catch (err) {
      console.error('Erreur suppression contact:', err);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'foster_family': return 'Famille d\'accueil';
      case 'adopter': return 'Adoptant';
      case 'both': return 'FA & Adoptant';
      default: return 'Contact';
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'foster_family' || type === 'both') return Home;
    return User;
  };

  const getAvailabilityBadge = (availability) => {
    switch (availability) {
      case 'available':
        return { text: 'Disponible', color: 'bg-green-100 text-green-700 border-green-200' };
      case 'full':
        return { text: 'Complet', color: 'bg-orange-100 text-orange-700 border-orange-200' };
      case 'temporarily_unavailable':
        return { text: 'Indisponible', color: 'bg-gray-100 text-gray-700 border-gray-200' };
      case 'inactive':
        return { text: 'Inactif', color: 'bg-red-100 text-red-700 border-red-200' };
      default:
        return null;
    }
  };

  const getNoteTypeBadge = (type) => {
    const badges = {
      visit: { text: 'Visite', color: 'bg-blue-100 text-blue-700' },
      placement: { text: 'Placement', color: 'bg-purple-100 text-purple-700' },
      removal: { text: 'Retrait', color: 'bg-orange-100 text-orange-700' },
      adoption: { text: 'Adoption', color: 'bg-green-100 text-green-700' },
      issue: { text: 'Problème', color: 'bg-red-100 text-red-700' },
      followup: { text: 'Suivi', color: 'bg-yellow-100 text-yellow-700' },
      general: { text: 'Général', color: 'bg-gray-100 text-gray-700' }
    };
    return badges[type] || badges.general;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return { text: 'Actif', icon: CheckCircle, color: 'bg-green-100 text-green-700 border-green-200' };
      case 'completed':
        return { text: 'Terminé', icon: CheckCircle, color: 'bg-gray-100 text-gray-700 border-gray-200' };
      case 'cancelled':
        return { text: 'Annulé', icon: X, color: 'bg-red-100 text-red-700 border-red-200' };
      default:
        return { text: 'Inconnu', icon: AlertCircle, color: 'bg-gray-100 text-gray-500 border-gray-200' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Contact non trouvé</p>
        </div>
      </div>
    );
  }

  const TypeIcon = getTypeIcon(contact.type);
  const availabilityBadge = getAvailabilityBadge(contact.availability);
  const activePlacements = placementHistory.filter(p => p.status === 'active');
  const completedPlacements = placementHistory.filter(p => p.status !== 'active');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/pro/crm/contacts')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth min-h-[44px]"
            >
              <ArrowLeft size={20} />
              <span className="font-medium hidden sm:inline">Retour</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/pro/crm/contacts/${contactId}/edit`)}
                className="px-4 py-2 border-2 border-border rounded-xl font-medium hover:bg-muted transition-smooth flex items-center gap-2 min-h-[44px]"
              >
                <Edit size={16} />
                <span className="hidden sm:inline">Modifier</span>
              </button>
              <button
                onClick={deleteContact}
                className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-smooth flex items-center gap-2 min-h-[44px]"
              >
                <Trash2 size={16} />
                <span className="hidden sm:inline">Supprimer</span>
              </button>
              <UserMenuPro />
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold flex-shrink-0">
                {contact.full_name?.charAt(0).toUpperCase()}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <TypeIcon size={18} className="text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    {getTypeLabel(contact.type)}
                  </span>
                  {availabilityBadge && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${availabilityBadge.color}`}>
                      {availabilityBadge.text}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
                  {contact.full_name}
                </h1>

                {contact.rating && (
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < contact.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-muted-foreground" />
                    <a href={`mailto:${contact.email}`} className="text-primary hover:underline truncate">
                      {contact.email}
                    </a>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-muted-foreground" />
                      <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                  )}
                  {contact.city && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-muted-foreground" />
                      <span className="text-muted-foreground truncate">{contact.city}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {(contact.type === 'foster_family' || contact.type === 'both') && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{contact.current_dogs_count}/{contact.max_dogs}</p>
                    <p className="text-xs text-muted-foreground">Chiens actuels</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{contact.total_dogs_fostered}</p>
                    <p className="text-xs text-muted-foreground">Total accueillis</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{contact.total_dogs_adopted}</p>
                    <p className="text-xs text-muted-foreground">Adoptés</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{notes.length}</p>
                    <p className="text-xs text-muted-foreground">Notes</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <TabNavigationPro />

      <main className="main-content flex-1">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6">
          <div className="bg-card rounded-xl shadow-soft border border-border mb-6">
            <div className="flex border-b border-border overflow-x-auto">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 px-6 py-4 font-medium whitespace-nowrap transition-smooth min-h-[44px] ${
                  activeTab === 'info'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Informations
              </button>
              {(contact.type === 'foster_family' || contact.type === 'both') && (
                <button
                  onClick={() => setActiveTab('dogs')}
                  className={`flex-1 px-6 py-4 font-medium whitespace-nowrap transition-smooth min-h-[44px] ${
                    activeTab === 'dogs'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Chiens ({activePlacements.length})
                </button>
              )}
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 px-6 py-4 font-medium whitespace-nowrap transition-smooth min-h-[44px] ${
                  activeTab === 'notes'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Notes ({notes.length})
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'info' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                      Informations personnelles
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Email</label>
                        <p className="text-foreground">{contact.email}</p>
                      </div>
                      {contact.phone && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Téléphone</label>
                          <p className="text-foreground">{contact.phone}</p>
                        </div>
                      )}
                      {contact.address && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Adresse</label>
                          <p className="text-foreground">{contact.address}</p>
                        </div>
                      )}
                      {contact.city && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Ville</label>
                          <p className="text-foreground">{contact.city} {contact.postal_code}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {(contact.type === 'foster_family' || contact.type === 'both') && (
                    <div className="pt-6 border-t border-border">
                      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                        Informations logement
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {contact.housing_type && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Type de logement</label>
                            <p className="text-foreground capitalize">{contact.housing_type.replace('_', ' ')}</p>
                          </div>
                        )}
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Jardin</label>
                          <p className="text-foreground">{contact.has_garden ? 'Oui' : 'Non'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Autres animaux</label>
                          <p className="text-foreground">
                            {contact.has_other_pets ? `Oui - ${contact.other_pets_details || 'Non précisé'}` : 'Non'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Capacité d'accueil</label>
                          <p className="text-foreground">{contact.max_dogs} chien(s) maximum</p>
                        </div>
                        {contact.preferred_size && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Taille préférée</label>
                            <p className="text-foreground capitalize">{contact.preferred_size}</p>
                          </div>
                        )}
                        {contact.preferred_age && (
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Âge préféré</label>
                            <p className="text-foreground capitalize">{contact.preferred_age}</p>
                          </div>
                        )}
                      </div>
                      {contact.preferences_notes && (
                        <div className="mt-4">
                          <label className="text-sm font-medium text-muted-foreground">Notes sur les préférences</label>
                          <p className="text-foreground mt-1">{contact.preferences_notes}</p>
                        </div>
                      )}
                      {contact.availability_notes && (
                        <div className="mt-4">
                          <label className="text-sm font-medium text-muted-foreground">Notes de disponibilité</label>
                          <p className="text-foreground mt-1">{contact.availability_notes}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-6 border-t border-border">
                    <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                      Statut et évaluation
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Statut</label>
                        <p className="text-foreground capitalize">{contact.status}</p>
                      </div>
                      {contact.rating && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Note</label>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < contact.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Créé le</label>
                        <p className="text-foreground">
                          {new Date(contact.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dogs' && (
                <div className="space-y-6">
                  {activePlacements.length > 0 && (
                    <div>
                      <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                        <Dog size={20} />
                        Chiens actuellement en garde ({activePlacements.length})
                      </h3>
                      <div className="space-y-3">
                        {activePlacements.map((placement) => {
                          const statusBadge = getStatusBadge(placement.status);
                          const StatusIcon = statusBadge.icon;

                          return (
                            <div
                              key={placement.id}
                              className="bg-background rounded-xl p-4 border border-border hover:shadow-soft transition-all"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0">
                                  {placement.dogs?.photo_url ? (
                                    <img
                                      src={placement.dogs.photo_url}
                                      alt={placement.dogs.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary/30">
                                      {placement.dogs?.name?.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h4 className="font-semibold text-foreground">{placement.dogs?.name}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                                      <StatusIcon size={12} className="inline mr-1" />
                                      {statusBadge.text}
                                    </span>
                                  </div>

                                  <p className="text-sm text-muted-foreground mb-2">{placement.dogs?.breed}</p>

                                  <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar size={12} />
                                      Depuis le {new Date(placement.start_date).toLocaleDateString('fr-FR')}
                                    </span>
                                    <span className="flex items-center gap-1 capitalize">
                                      <Home size={12} />
                                      {placement.placement_type === 'foster' ? 'Famille d\'accueil' : 'Adoption'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {completedPlacements.length > 0 && (
                    <div className="pt-6 border-t border-border">
                      <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                        Historique ({completedPlacements.length})
                      </h3>
                      <div className="space-y-3">
                        {completedPlacements.map((placement) => {
                          const statusBadge = getStatusBadge(placement.status);
                          const StatusIcon = statusBadge.icon;

                          return (
                            <div
                              key={placement.id}
                              className="bg-muted/30 rounded-xl p-4 border border-border"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0">
                                  {placement.dogs?.photo_url ? (
                                    <img
                                      src={placement.dogs.photo_url}
                                      alt={placement.dogs.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-primary/30">
                                      {placement.dogs?.name?.charAt(0).toUpperCase()}
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-medium text-foreground">{placement.dogs?.name}</h4>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusBadge.color}`}>
                                      {statusBadge.text}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    <span>
                                      {new Date(placement.start_date).toLocaleDateString('fr-FR')}
                                      {placement.end_date && ` - ${new Date(placement.end_date).toLocaleDateString('fr-FR')}`}
                                    </span>
                                    {placement.end_reason && (
                                      <span className="capitalize">• {placement.end_reason}</span>
                                    )}
                                  </div>

                                  {placement.feedback && (
                                    <p className="text-sm text-muted-foreground mt-2 italic">"{placement.feedback}"</p>
                                  )}

                                  {placement.rating && (
                                    <div className="flex items-center gap-1 mt-2">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          size={12}
                                          className={i < placement.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                        />
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {placementHistory.length === 0 && (
                    <div className="text-center py-12">
                      <Dog size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Aucun placement enregistré</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-4">
                  <button
                    onClick={() => setShowAddNoteModal(true)}
                    className="w-full sm:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <Plus size={16} />
                    Ajouter une note
                  </button>

                  {notes.length > 0 ? (
                    <div className="space-y-3">
                      {notes.map((note) => {
                        const typeBadge = getNoteTypeBadge(note.note_type);

                        return (
                          <div
                            key={note.id}
                            className={`rounded-xl p-4 border ${
                              note.is_important
                                ? 'bg-yellow-50 border-yellow-200'
                                : 'bg-background border-border'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeBadge.color}`}>
                                  {typeBadge.text}
                                </span>
                                {note.is_important && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                    Important
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() => deleteNote(note.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-smooth min-h-[44px] min-w-[44px] flex items-center justify-center"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>

                            <h4 className="font-semibold text-foreground mb-2">{note.title}</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.description}</p>

                            <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                              <Calendar size={12} />
                              {new Date(note.created_at).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">Aucune note</p>
                      <button
                        onClick={() => setShowAddNoteModal(true)}
                        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-smooth inline-flex items-center gap-2"
                      >
                        <Plus size={20} />
                        Ajouter la première note
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-foreground">Ajouter une note</h2>
              <button
                onClick={() => setShowAddNoteModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-smooth min-h-[44px] min-w-[44px]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Type de note *
                </label>
                <select
                  value={noteForm.note_type}
                  onChange={(e) => setNoteForm({ ...noteForm, note_type: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                >
                  <option value="general">Général</option>
                  <option value="visit">Visite</option>
                  <option value="placement">Placement</option>
                  <option value="removal">Retrait</option>
                  <option value="adoption">Adoption</option>
                  <option value="issue">Problème</option>
                  <option value="followup">Suivi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  required
                  placeholder="Ex: Visite de contrôle réussie"
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Description *
                </label>
                <textarea
                  value={noteForm.description}
                  onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Détails de la note..."
                  className="w-full px-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent bg-background resize-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input
                    type="checkbox"
                    checked={noteForm.is_important}
                    onChange={(e) => setNoteForm({ ...noteForm, is_important: e.target.checked })}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-muted-foreground">Marquer comme important</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddNoteModal(false)}
                  className="flex-1 py-3 border-2 border-border rounded-xl font-medium hover:bg-muted transition-smooth min-h-[44px]"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-smooth min-h-[44px]"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRMContactDetail;
