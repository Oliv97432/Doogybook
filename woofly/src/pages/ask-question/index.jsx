import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, HelpCircle, Send, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import TabNavigation from '../../components/TabNavigation';
import Footer from '../../components/Footer';

/**
 * Page AskQuestion - Formulaire simplifié pour poser une question
 */
const AskQuestion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    forumId: '',
    title: '',
    content: '',
    category: ''
  });
  
  const [forums, setForums] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: '', label: 'Choisir une catégorie' },
    { value: 'Santé', label: '🏥 Santé' },
    { value: 'Nutrition', label: '🍖 Nutrition' },
    { value: 'Comportement', label: '🐾 Comportement' },
    { value: 'Education', label: '🎓 Éducation' },
    { value: 'Toilettage', label: '✂️ Toilettage' },
    { value: 'Activités', label: '⚽ Activités' },
    { value: 'Autre', label: '💬 Autre' }
  ];

  // Exemples de questions
  const exampleQuestions = [
    {
      title: "Mon chien tire en laisse, que faire ?",
      category: "Education"
    },
    {
      title: "Quelle alimentation pour un chiot de 3 mois ?",
      category: "Nutrition"
    },
    {
      title: "Comment gérer l'anxiété de séparation ?",
      category: "Comportement"
    },
    {
      title: "À quelle fréquence laver mon chien ?",
      category: "Toilettage"
    }
  ];

  // Charger les forums
  useEffect(() => {
    const fetchForums = async () => {
      const { data } = await supabase
        .from('forums')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('name');
      
      if (data) setForums(data);
    };
    
    fetchForums();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleExampleClick = (example) => {
    setFormData(prev => ({
      ...prev,
      title: example.title,
      category: example.category
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.forumId) {
      newErrors.forumId = 'Veuillez sélectionner un forum';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre de votre question est requis';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Le titre doit contenir au moins 10 caractères';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Veuillez décrire votre question en détail';
    } else if (formData.content.length < 20) {
      newErrors.content = 'La description doit contenir au moins 20 caractères';
    }
    
    if (!formData.category) {
      newErrors.category = 'Veuillez sélectionner une catégorie';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { data: post, error } = await supabase
        .from('forum_posts')
        .insert([{
          forum_id: formData.forumId,
          user_id: user.id,
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: formData.category,
          is_question: true // Toujours true pour cette page
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      alert('✅ Votre question a été publiée !');
      navigate(`/discussion/${post.id}`);
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border shadow-soft">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-muted rounded-lg transition-smooth"
            >
              <ArrowLeft size={24} className="text-foreground" />
            </button>
            <div>
              <h1 className="text-2xl font-heading font-semibold text-foreground flex items-center gap-2">
                <HelpCircle size={24} />
                Poser une question
              </h1>
              <p className="text-sm text-muted-foreground">
                La communauté est là pour vous aider
              </p>
            </div>
          </div>
        </div>
      </div>

      <TabNavigation />

      {/* Main content */}
      <main className="main-content flex-1">
        <div className="max-w-3xl mx-auto px-4 py-6">
          
          {/* Info box */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
              <div>
                <p className="text-blue-900 font-medium mb-1">
                  Conseils pour obtenir une bonne réponse
                </p>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Soyez précis dans votre question</li>
                  <li>• Donnez un maximum de contexte (âge du chien, race, etc.)</li>
                  <li>• Une question = un sujet unique</li>
                  <li>• Soyez respectueux et poli</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Exemples de questions */}
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
              Besoin d'inspiration ? Voici quelques exemples :
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {exampleQuestions.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-left p-3 border border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-smooth"
                >
                  <p className="text-sm font-medium text-foreground mb-1">
                    {example.title}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {example.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Forum */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Dans quel forum ? <span className="text-red-500">*</span>
              </label>
              <select
                name="forumId"
                value={formData.forumId}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.forumId ? 'border-red-500' : 'border-border'
                }`}
              >
                <option value="">Choisir un forum</option>
                {forums.map(forum => (
                  <option key={forum.id} value={forum.id}>
                    {forum.name}
                  </option>
                ))}
              </select>
              {errors.forumId && (
                <p className="text-red-500 text-sm mt-1">{errors.forumId}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Choisissez le forum le plus approprié pour votre question
              </p>
            </div>

            {/* Catégorie */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.category ? 'border-red-500' : 'border-border'
                }`}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Question */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Votre question <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Comment apprendre à mon chien à ne pas tirer en laisse ?"
                maxLength={255}
                className={`w-full px-4 py-3 border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.title ? 'border-red-500' : 'border-border'
                }`}
              />
              <div className="flex items-center justify-between mt-2">
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
                <p className="text-xs text-muted-foreground ml-auto">
                  {formData.title.length}/255
                </p>
              </div>
            </div>

            {/* Détails */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Détails de la situation <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Décrivez votre situation en détail : âge du chien, depuis quand ça dure, ce que vous avez déjà essayé..."
                rows={8}
                className={`w-full px-4 py-3 border rounded-lg bg-card focus:outline-none focus:ring-2 focus:ring-primary resize-none ${
                  errors.content ? 'border-red-500' : 'border-border'
                }`}
              />
              {errors.content && (
                <p className="text-red-500 text-sm mt-1">{errors.content}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Plus vous donnez de détails, meilleures seront les réponses • {formData.content.length} caractères
              </p>
            </div>

            {/* Rappel */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
              <p className="text-orange-900 text-sm">
                <strong>Important :</strong> Pour les urgences vétérinaires, contactez immédiatement votre vétérinaire.
                La communauté ne remplace pas un avis médical professionnel.
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-6 py-3 border border-border rounded-lg font-medium text-foreground hover:bg-muted transition-smooth"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-smooth flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    Publication...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Publier ma question
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AskQuestion;
