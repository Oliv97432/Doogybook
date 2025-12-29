import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ArrowLeft, Upload, Download, Copy, Instagram, Check,
  Image as ImageIcon, AlertCircle, Sparkles
} from 'lucide-react';

const InstagramGenerator = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const [formData, setFormData] = useState({
    dogName: '',
    breed: '',
    age: '',
    story: '',
    personality: '',
    needs: '',
    health: '',
    location: 'La Réunion'
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const locations = [
    'Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 
    'Nantes', 'Bordeaux', 'La Réunion', 'Martinique', 'Guadeloupe'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setPhotoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const generateHashtags = () => {
    const baseHashtags = [
      '#AdopteDontShop', '#AdoptionChien', '#DogAdoption', 
      '#Doogybook', '#SauverUneVie', '#ChienARescuer'
    ];

    const locationHashtags = {
      'Paris': ['#ChienParis', '#AdoptionParis', '#ParisDog'],
      'Lyon': ['#ChienLyon', '#AdoptionLyon', '#LyonDog'],
      'Marseille': ['#ChienMarseille', '#AdoptionMarseille', '#MarseilleDog'],
      'La Réunion': ['#ChienReunion', '#AdoptionReunion', '#ReunionDog', '#974'],
      'Martinique': ['#ChienMartinique', '#AdoptionMartinique', '#972'],
      'Guadeloupe': ['#ChienGuadeloupe', '#AdoptionGuadeloupe', '#971']
    };

    const breedTag = formData.breed ? `#${formData.breed.replace(/\s+/g, '')}` : '';
    const localTags = locationHashtags[formData.location] || [];

    return [...baseHashtags, ...localTags, breedTag].filter(Boolean).join(' ');
  };

  const generateCaption = () => {
    const emoji = '🐕';
    const heart = '❤️';
    const home = '🏠';
    
    let caption = `${emoji} ${formData.dogName} cherche une famille !\n\n`;
    
    if (formData.story) {
      caption += `📖 Son histoire :\n${formData.story}\n\n`;
    }
    
    if (formData.personality) {
      caption += `✨ Sa personnalité :\n${formData.personality}\n\n`;
    }
    
    if (formData.needs) {
      caption += `${home} Ce qu'il recherche :\n${formData.needs}\n\n`;
    }
    
    caption += `📍 ${formData.location}\n`;
    caption += `🎂 ${formData.age || 'Âge non précisé'}\n\n`;
    
    caption += `Pour adopter ${formData.dogName}, rendez-vous sur doogybook.com ${heart}\n\n`;
    
    caption += generateHashtags();

    return caption;
  };

  const generateImage = async () => {
    if (!photoPreview) {
      alert('Veuillez d\'abord uploader une photo');
      return;
    }

    setLoading(true);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Taille Instagram (1080x1080)
      canvas.width = 1080;
      canvas.height = 1080;

      // Charger l'image
      const img = new Image();
      img.onload = () => {
        // Dessiner l'image (cover)
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        // Overlay gradient en bas
        const gradient = ctx.createLinearGradient(0, canvas.height - 200, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, canvas.height - 200, canvas.width, 200);

        // Texte nom du chien
        ctx.fillStyle = 'white';
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(formData.dogName, canvas.width / 2, canvas.height - 120);

        // Texte race
        ctx.font = '40px Arial';
        ctx.fillText(formData.breed, canvas.width / 2, canvas.height - 70);

        // Logo Doogybook
        ctx.font = '30px Arial';
        ctx.fillText('doogybook.com', canvas.width / 2, canvas.height - 25);

        // Convertir en image
        const imageUrl = canvas.toDataURL('image/jpeg', 0.95);
        setGeneratedImage(imageUrl);
        setLoading(false);
      };
      
      img.src = photoPreview;
    } catch (error) {
      console.error('Erreur génération image:', error);
      alert('Erreur lors de la génération de l\'image');
      setLoading(false);
    }
  };

  const handleGenerate = () => {
    if (!formData.dogName || !formData.breed) {
      alert('Veuillez remplir au moins le nom et la race');
      return;
    }

    const caption = generateCaption();
    setGeneratedCaption(caption);
    generateImage();
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(generatedCaption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.download = `${formData.dogName}_instagram.jpg`;
    link.href = generatedImage;
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/pro/dashboard')}
              className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900 min-h-[44px] min-w-[44px]"
              aria-label="Retour au tableau de bord"
            >
              <ArrowLeft size={18} className="sm:size-5" />
              <span className="font-medium text-sm sm:text-base hidden xs:inline">Retour</span>
            </button>
            <h1 className="text-lg sm:text-xl font-heading font-bold text-gray-900 truncate px-2">
              Générateur Instagram
            </h1>
            <div className="w-10 sm:w-20"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Intro */}
        <div className="bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl sm:rounded-3xl p-5 sm:p-8 text-white mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Instagram size={24} className="sm:size-8" />
            <h2 className="text-xl sm:text-3xl font-heading font-bold">
              Créez des posts Instagram optimisés
            </h2>
          </div>
          <p className="text-sm sm:text-lg text-white/90 leading-relaxed">
            Générez automatiquement une image professionnelle et une légende optimisée
            avec hashtags localisés pour donner un maximum de visibilité à vos chiens !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Formulaire */}
          <div className="space-y-6 sm:space-y-8">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-gray-900 mb-4 sm:mb-6">
                📸 Photo du chien
              </h3>

              {/* Upload photo */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-3 border-dashed border-blue-300 rounded-2xl sm:rounded-3xl p-4 sm:p-8 text-center bg-blue-50 hover:bg-blue-100 cursor-pointer transition-smooth mb-4 min-h-[180px] sm:min-h-[240px] flex flex-col items-center justify-center"
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="max-h-48 sm:max-h-64 mx-auto rounded-xl sm:rounded-2xl object-contain"
                  />
                ) : (
                  <div className="py-4 sm:py-8">
                    <Upload size={32} className="sm:size-12 text-blue-500 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-700 font-medium mb-2 text-sm sm:text-base">
                      Cliquez pour uploader une photo
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 px-4">
                      Format recommandé : carré (1080x1080px)
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
              
              {photoPreview && (
                <button
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                  className="w-full py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 text-sm sm:text-base"
                >
                  Changer de photo
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
              <h3 className="text-lg sm:text-xl font-heading font-bold text-gray-900 mb-4 sm:mb-6">
                📝 Informations
              </h3>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du chien *
                  </label>
                  <input
                    type="text"
                    name="dogName"
                    value={formData.dogName}
                    onChange={handleChange}
                    placeholder="Ex: Max"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Race *
                  </label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    placeholder="Ex: Labrador"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Âge
                    </label>
                    <input
                      type="text"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="Ex: 2 ans"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localisation
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                    >
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Son histoire
                  </label>
                  <textarea
                    name="story"
                    value={formData.story}
                    onChange={handleChange}
                    placeholder="Racontez son parcours..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personnalité
                  </label>
                  <textarea
                    name="personality"
                    value={formData.personality}
                    onChange={handleChange}
                    placeholder="Joueur, calme, affectueux..."
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ce qu'il recherche
                  </label>
                  <textarea
                    name="needs"
                    value={formData.needs}
                    onChange={handleChange}
                    placeholder="Jardin, famille active, autre animal..."
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || !formData.dogName || !formData.breed}
                className="w-full mt-6 py-3 sm:py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold hover:from-pink-600 hover:to-purple-700 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[52px] text-sm sm:text-base"
              >
                <Sparkles size={18} className="sm:size-5" />
                {loading ? 'Génération...' : 'Générer le post Instagram'}
              </button>
            </div>
          </div>

          {/* Preview & Résultats */}
          <div className="space-y-6 sm:space-y-8">
            {generatedImage && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
                <h3 className="text-lg sm:text-xl font-heading font-bold text-gray-900 mb-3 sm:mb-4">
                  🖼️ Image générée
                </h3>
                <div className="relative">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full rounded-xl sm:rounded-2xl mb-3 sm:mb-4"
                  />
                  <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Instagram
                  </div>
                </div>
                <button
                  onClick={handleDownloadImage}
                  className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]"
                >
                  <Download size={18} className="sm:size-5" />
                  Télécharger l'image
                </button>
              </div>
            )}

            {generatedCaption && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-lg sm:text-xl font-heading font-bold text-gray-900">
                    📝 Légende Instagram
                  </h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <span>{generatedCaption.length} caractères</span>
                    <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                    <span>{generatedCaption.split('#').length - 1} hashtags</span>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 mb-3 sm:mb-4 max-h-64 sm:max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm text-gray-700 leading-relaxed">
                    {generatedCaption}
                  </pre>
                </div>
                
                <button
                  onClick={handleCopyCaption}
                  className="w-full py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 flex items-center justify-center gap-2 text-sm sm:text-base min-h-[44px]"
                >
                  {copied ? <Check size={18} className="sm:size-5" /> : <Copy size={18} className="sm:size-5" />}
                  {copied ? 'Copié !' : 'Copier la légende'}
                </button>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600">
                    <strong>Astuce :</strong> Copiez la légende et collez-la directement dans Instagram avec l'image générée.
                  </p>
                </div>
              </div>
            )}

            {!generatedImage && !generatedCaption && (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-8 sm:p-12 shadow-sm text-center">
                <ImageIcon size={40} className="sm:size-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-500 text-sm sm:text-base">
                  Remplissez le formulaire et cliquez sur "Générer" pour voir le résultat
                </p>
                <div className="mt-4 text-xs sm:text-sm text-gray-400">
                  <p>📱 Optimisé pour Instagram</p>
                  <p>📍 Hashtags localisés</p>
                  <p>🎨 Image professionnelle</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas caché pour génération */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Instructions mobile */}
        <div className="mt-6 sm:mt-8 bg-blue-50 rounded-xl p-4 sm:p-6 text-sm sm:text-base">
          <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
            <AlertCircle size={18} className="sm:size-5" />
            Astuces pour un bon post Instagram
          </h4>
          <ul className="list-disc list-inside space-y-1 text-blue-700">
            <li>Utilisez une photo nette et bien éclairée</li>
            <li>Remplissez tous les champs pour une légende complète</li>
            <li>Personnalisez la légende si nécessaire</li>
            <li>Postez aux heures de forte activité (12h-14h, 18h-22h)</li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default InstagramGenerator;
