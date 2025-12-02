import React, { useState, useEffect } from 'react';
import TabNavigation from '../../components/TabNavigation';
import ProfileSwitcher from '../../components/ProfileSwitcher';
import TipCard from './components/TipCard';
import TipArchive from './components/TipArchive';
import RelatedArticles from './components/RelatedArticles';
import CategoryFilter from './components/CategoryFilter';
import ShareModal from './components/ShareModal';

const DailyTip = () => {
  const [currentTip, setCurrentTip] = useState(null);
  const [recentTips, setRecentTips] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(null);

  const dogProfiles = [
  {
    id: 1,
    name: "Max",
    breed: "Berger Malinois",
    image: "https://images.unsplash.com/photo-1713917032646-4703f3feffde",
    imageAlt: "Berger Malinois adulte aux oreilles dressées avec pelage fauve et masque noir dans un jardin ensoleillé"
  },
  {
    id: 2,
    name: "Luna",
    breed: "Shih-Tzu",
    image: "https://images.unsplash.com/photo-1455560961239-08d228f6c5bf",
    imageAlt: "Shih-Tzu blanc et marron avec long pelage soyeux et nœud rose sur la tête assis sur un canapé"
  }];


  const categories = [
  { id: 'all', label: 'Tous', count: 45 },
  { id: 'training', label: 'Dressage', count: 12 },
  { id: 'health', label: 'Santé', count: 15 },
  { id: 'nutrition', label: 'Nutrition', count: 8 },
  { id: 'grooming', label: 'Toilettage', count: 6 },
  { id: 'safety', label: 'Sécurité', count: 4 }];


  const allTips = [
  {
    id: 1,
    category: 'training',
    title: "L\'importance de la socialisation précoce",
    content: `La socialisation est l'une des étapes les plus cruciales dans le développement d'un chien équilibré et heureux. Entre 3 et 14 semaines, votre chiot traverse une période sensible où il est particulièrement réceptif aux nouvelles expériences.\n\nExposez progressivement votre chien à différents environnements, personnes, animaux et situations. Commencez par des rencontres calmes et positives, en récompensant les comportements appropriés. Visitez des parcs, des marchés, et organisez des rencontres avec d'autres chiens vaccinés.\n\nUne socialisation adéquate prévient les problèmes de comportement futurs comme l'anxiété, l'agressivité ou la peur excessive. N'oubliez pas que la socialisation doit se poursuivre tout au long de la vie de votre chien pour maintenir ses compétences sociales.`,
    image: "https://images.unsplash.com/photo-1703733570655-ea30418b92fb",
    imageAlt: "Groupe de chiots de différentes races jouant ensemble dans un parc avec leurs propriétaires supervisant les interactions",
    source: "Dr. Marie Dubois, Vétérinaire comportementaliste",
    likes: 127,
    bookmarked: true,
    date: new Date('2025-11-30')
  },
  {
    id: 2,
    category: 'health',
    title: "Reconnaître les signes de déshydratation",
    content: `La déshydratation chez les chiens peut survenir rapidement, surtout pendant les mois chauds ou après un exercice intense. Il est essentiel de reconnaître les signes précoces pour agir rapidement.\n\nLes symptômes incluent: gencives sèches ou collantes, perte d'élasticité de la peau (testez en pinçant doucement la peau du cou), yeux enfoncés, léthargie inhabituelle, et halètement excessif. Un chien déshydraté peut également refuser de manger.\n\nAssurez-vous que votre chien ait toujours accès à de l'eau fraîche et propre. Par temps chaud, proposez de l'eau plus fréquemment et évitez les exercices intenses aux heures les plus chaudes. Si vous suspectez une déshydratation sévère, consultez immédiatement votre vétérinaire.`,
    image: "https://images.unsplash.com/photo-1619333774319-a68921d1892a",
    imageAlt: "Chien golden retriever buvant de l\'eau fraîche dans une gamelle en acier inoxydable à l\'ombre d\'un arbre",
    source: "Clinique Vétérinaire Saint-Antoine",
    likes: 89,
    bookmarked: false,
    date: new Date('2025-11-29')
  },
  {
    id: 3,
    category: 'nutrition', title: "Les aliments toxiques à éviter absolument", content: `Certains aliments courants dans nos cuisines peuvent être extrêmement dangereux, voire mortels pour nos compagnons canins. La prévention est la meilleure protection.\n\nLes aliments interdits incluent: le chocolat (contient de la théobromine toxique), les raisins et raisins secs (insuffisance rénale), l'oignon et l'ail (anémie), l'avocat (persin toxique), les noix de macadamia, le xylitol (édulcorant artificiel), l'alcool, et la caféine.\n\nMême en petites quantités, ces aliments peuvent causer des problèmes graves. Gardez-les hors de portée et éduquez tous les membres de la famille, surtout les enfants. En cas d'ingestion accidentelle, contactez immédiatement votre vétérinaire ou un centre antipoison vétérinaire.`,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d5bf7a07-1764596180048.png",
    imageAlt: "Assortiment d'aliments dangereux pour chiens incluant chocolat, raisins, oignons et avocats disposés sur une table avec symbole d'interdiction",
    source: "Association Française des Vétérinaires",
    likes: 203,
    bookmarked: true,
    date: new Date('2025-11-28')
  },
  {
    id: 4,
    category: 'grooming',
    title: "Techniques de brossage selon le type de pelage",
    content: `Le brossage régulier est essentiel pour la santé de la peau et du pelage de votre chien, mais les techniques varient selon le type de poil.\n\nPour les poils courts (Beagle, Boxer): utilisez une brosse en caoutchouc ou un gant de toilettage 1-2 fois par semaine. Pour les poils moyens (Berger Allemand): brossez 2-3 fois par semaine avec une brosse à picots et un peigne. Pour les poils longs (Shih-Tzu, Yorkshire): brossage quotidien avec une brosse à poils doux et un peigne métallique pour éviter les nœuds.\n\nCommencez toujours par les extrémités et remontez progressivement. Le brossage stimule la circulation sanguine, distribue les huiles naturelles et renforce votre lien avec votre chien.`,
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_19ea73bdd-1764596177902.png",
    imageAlt: "Propriétaire brossant délicatement le pelage long et soyeux d\'un chien blanc avec une brosse professionnelle dans un salon lumineux",
    source: "École de Toilettage Canin de Paris",
    likes: 76,
    bookmarked: false,
    date: new Date('2025-11-27')
  },
  {
    id: 5,
    category: 'safety',
    title: "Sécuriser votre jardin pour votre chien",
    content: `Un jardin sécurisé offre à votre chien un espace de liberté tout en minimisant les risques. Plusieurs précautions sont nécessaires.\n\nVérifiez que la clôture est solide et suffisamment haute (minimum 1,5m pour les grandes races). Inspectez régulièrement pour détecter les trous ou passages potentiels. Retirez les plantes toxiques comme le laurier-rose, le muguet, ou l'if. Sécurisez les produits chimiques (engrais, pesticides) dans un endroit inaccessible.\n\nInstallez un point d'eau à l'ombre et créez des zones ombragées. Évitez les petits objets que votre chien pourrait avaler. Si vous avez une piscine, apprenez à votre chien où se trouvent les marches de sortie et surveillez-le toujours près de l'eau.`,
    image: "https://images.unsplash.com/photo-1654995158869-5071609cfaf8",
    imageAlt: "Chien corgi jouant en toute sécurité dans un jardin clôturé avec pelouse verte, arbres et zone ombragée aménagée",
    source: "Fédération Cynologique Française",
    likes: 54,
    bookmarked: false,
    date: new Date('2025-11-26')
  }];


  const relatedArticles = [
  {
    id: 1,
    title: "Guide complet du dressage positif",
    excerpt: "Découvrez les méthodes de renforcement positif pour éduquer votre chien avec bienveillance et efficacité.",
    image: "https://images.unsplash.com/photo-1624588267285-90aec4854542",
    imageAlt: "Dresseur professionnel récompensant un chien border collie avec une friandise pendant une session d\'entraînement en extérieur",
    readTime: 8
  },
  {
    id: 2,
    title: "Calendrier vaccinal du chien",
    excerpt: "Tous les vaccins essentiels et leur fréquence pour protéger votre compagnon tout au long de sa vie.",
    image: "https://images.unsplash.com/photo-1654895716780-b4664497420d",
    imageAlt: "Vétérinaire en blouse blanche administrant un vaccin à un chien labrador calme sur une table d'examen",
    readTime: 6
  },
  {
    id: 3,
    title: "Alimentation équilibrée: les bases",
    excerpt: "Comprendre les besoins nutritionnels de votre chien selon son âge, sa race et son niveau d'activité.",
    image: "https://images.unsplash.com/photo-1676195467298-2dc1915ef56f",
    imageAlt: "Gamelle de nourriture pour chien avec croquettes de qualité, légumes frais et viande disposés de manière appétissante",
    readTime: 10
  }];


  useEffect(() => {
    setCurrentProfile(dogProfiles?.[0]);
    const filteredTips = selectedCategory === 'all' ?
    allTips :
    allTips?.filter((tip) => tip?.category === selectedCategory);

    setCurrentTip(filteredTips?.[0]);
    setRecentTips(filteredTips?.slice(1, 4));
  }, [selectedCategory]);

  const handleRefresh = () => {
    const filteredTips = selectedCategory === 'all' ?
    allTips :
    allTips?.filter((tip) => tip?.category === selectedCategory);

    const availableTips = filteredTips?.filter((tip) => tip?.id !== currentTip?.id);
    if (availableTips?.length > 0) {
      const randomTip = availableTips?.[Math.floor(Math.random() * availableTips?.length)];
      setCurrentTip(randomTip);

      const newRecent = filteredTips?.filter((tip) => tip?.id !== randomTip?.id)?.slice(0, 3);
      setRecentTips(newRecent);
    }
  };

  const handleRate = (tipId) => {
    setCurrentTip((prev) => ({
      ...prev,
      likes: prev?.likes + 1
    }));
  };

  const handleBookmark = (tipId) => {
    setCurrentTip((prev) => ({
      ...prev,
      bookmarked: !prev?.bookmarked
    }));
  };

  const handleShare = (tip) => {
    setShareModalOpen(true);
  };

  const handleSelectTip = (tip) => {
    setCurrentTip(tip);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectArticle = (article) => {
    console.log('Article sélectionné:', article?.title);
  };

  const handleProfileChange = (profile) => {
    setCurrentProfile(profile);
  };

  if (!currentTip) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-[90] bg-card border-b border-border shadow-soft">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-heading font-semibold text-foreground">
              Conseil du jour
            </h1>
          </div>
          <ProfileSwitcher
            profiles={dogProfiles}
            currentProfile={currentProfile}
            onProfileChange={handleProfileChange} />

        </div>
      </div>

      <TabNavigation />

      <main className="main-content max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory} />

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2">
            <TipCard
              tip={currentTip}
              onRefresh={handleRefresh}
              onRate={handleRate}
              onShare={handleShare}
              onBookmark={handleBookmark} />

          </div>

          <div className="space-y-6">
            <TipArchive
              tips={recentTips}
              onSelectTip={handleSelectTip} />


            <RelatedArticles
              articles={relatedArticles}
              onSelectArticle={handleSelectArticle} />

          </div>
        </div>
      </main>

      <ShareModal
        tip={currentTip}
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)} />

    </div>);

};

export default DailyTip;