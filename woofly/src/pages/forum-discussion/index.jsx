import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TabNavigation from '../../components/TabNavigation';
import ProfileSwitcher from '../../components/ProfileSwitcher';
import DiscussionHeader from './components/DiscussionHeader';
import FilterControls from './components/FilterControls';
import DiscussionPost from './components/DiscussionPost';
import NewDiscussionModal from './components/NewDiscussionModal';
import ImageModal from './components/ImageModal';
import EmptyState from './components/EmptyState';

const ForumDiscussion = () => {
  const location = useLocation();
  const breedInfo = location?.state?.breed || { name: 'Malinois', id: 'malinois' };

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterType, setFilterType] = useState('all');
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);

  const dogProfiles = [
  {
    id: 1,
    name: 'Max',
    breed: 'Malinois',
    image: "https://images.unsplash.com/photo-1713917032646-4703f3feffde",
    imageAlt: 'Malinois dog with alert expression and pointed ears sitting outdoors in natural lighting'
  },
  {
    id: 2,
    name: 'Luna',
    breed: 'Shih-Tzu',
    image: "https://images.unsplash.com/photo-1697005063767-739491d62ff3",
    imageAlt: 'Small white and brown Shih-Tzu dog with long fluffy coat sitting on grass'
  }];


  const [discussions, setDiscussions] = useState([
  {
    id: 1,
    authorName: 'Sophie Martin',
    authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1118b48b3-1763295890580.png",
    authorAvatarAlt: 'Professional headshot of woman with shoulder-length brown hair wearing blue blouse',
    title: 'Conseils pour l\'éducation d\'un chiot Malinois',
    content: `Bonjour à tous,\n\nJe viens d'adopter un chiot Malinois de 3 mois et j'aimerais avoir vos conseils pour son éducation. Il est très énergique et j'ai du mal à canaliser son énergie.\n\nQuels exercices recommandez-vous pour commencer ? Merci d'avance pour votre aide !`,
    timestamp: new Date('2025-11-30T14:30:00'),
    likes: 24,
    isLiked: false,
    replyCount: 8,
    isQuestion: true,
    images: [],
    replies: [
    {
      id: 101,
      authorName: 'Pierre Dubois',
      authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_13f55c37d-1763295063196.png",
      authorAvatarAlt: 'Professional headshot of middle-aged man with short gray hair wearing dark suit',
      content: `Le Malinois a besoin de beaucoup d'exercice mental et physique. Je recommande des sessions courtes de 10-15 minutes plusieurs fois par jour plutôt qu'une longue session.\n\nCommencez par les bases : assis, couché, pas bouger. Utilisez des récompenses positives.`,
      timestamp: new Date('2025-11-30T15:45:00'),
      likes: 12,
      isLiked: true,
      isQuestion: false,
      images: []
    },
    {
      id: 102,
      authorName: 'Marie Leroy',
      authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_157b8811d-1763297722763.png",
      authorAvatarAlt: 'Professional headshot of young woman with long blonde hair wearing white shirt',
      content: `Totalement d'accord avec Pierre ! J'ajouterais aussi l'importance de la socialisation précoce. Exposez-le à différents environnements, personnes et autres chiens dès maintenant.`,
      timestamp: new Date('2025-11-30T16:20:00'),
      likes: 8,
      isLiked: false,
      isQuestion: false,
      images: []
    }]

  },
  {
    id: 2,
    authorName: 'Thomas Bernard', authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1c48e51fb-1763293461105.png", authorAvatarAlt: 'Professional headshot of young man with short dark hair and beard wearing casual shirt', title: 'Sortie au parc ce weekend', content: `Qui serait partant pour une sortie au parc avec nos Malinois ce dimanche matin ? Ce serait l'occasion de les faire jouer ensemble et d'échanger nos expériences.\n\nRDV proposé : Parc de la Tête d'Or à 10h`,
    timestamp: new Date('2025-11-29T18:15:00'),
    likes: 18,
    isLiked: true,
    replyCount: 5,
    isQuestion: false,
    images: [
    {
      url: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7",
      alt: 'Malinois dog running freely in large green park with trees in background during sunny day'
    },
    {
      url: "https://images.unsplash.com/photo-1703774170626-ad16f22c8a8e",
      alt: 'Two Malinois dogs playing together on grass field with playful interaction'
    }],

    replies: []
  },
  {
    id: 3,
    authorName: 'Julie Petit',
    authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_199b8eec1-1763301563721.png",
    authorAvatarAlt: 'Professional headshot of woman with curly red hair wearing green sweater',
    title: 'Question sur l\'alimentation',
    content: `Bonjour,\n\nMon Malinois de 2 ans a des problèmes digestifs récurrents. Le vétérinaire m'a conseillé de changer son alimentation.\n\nQuelle marque de croquettes utilisez-vous ? Avez-vous des recommandations pour des chiens sensibles ?`, timestamp: new Date('2025-11-29T10:30:00'),
    likes: 15,
    isLiked: false,
    replyCount: 12,
    isQuestion: true,
    images: [],
    replies: []
  },
  {
    id: 4,
    authorName: 'Alexandre Moreau', authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cadb1dd7-1763294062930.png", authorAvatarAlt: 'Professional headshot of man with short brown hair wearing blue polo shirt', title: 'Progrès en agility', content: `Je suis tellement fier de mon Malinois ! Après 6 mois d\'entraînement en agility, il commence vraiment à exceller. Voici quelques photos de notre dernière session.\n\nSi vous hésitez à vous lancer dans l'agility, je vous encourage vivement !`,
    timestamp: new Date('2025-11-28T16:45:00'),
    likes: 42,
    isLiked: true,
    replyCount: 15,
    isQuestion: false,
    images: [
    {
      url: "https://images.unsplash.com/photo-1537316575411-ae253dc9cadc",
      alt: 'Malinois dog jumping over agility obstacle during training session in outdoor course'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_179341389-1764596177331.png",
      alt: 'Malinois dog weaving through agility poles with focused expression and athletic movement'
    },
    {
      url: "https://img.rocket.new/generatedImages/rocket_gen_img_15433fbff-1764596178071.png",
      alt: 'Malinois dog completing tunnel obstacle in agility course with handler nearby'
    }],

    replies: []
  },
  {
    id: 5,
    authorName: 'Camille Rousseau',
    authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cfb54561-1763301928675.png",
    authorAvatarAlt: 'Professional headshot of young woman with short black hair wearing red jacket',
    title: 'Comportement agressif envers les autres chiens',
    content: `Bonjour à tous,\n\nJ'ai besoin de vos conseils. Mon Malinois de 18 mois devient de plus en plus réactif envers les autres chiens lors des promenades. Il grogne et tire sur la laisse.\n\nAvez-vous déjà rencontré ce problème ? Comment l'avez-vous résolu ? Dois-je consulter un comportementaliste ?`,
    timestamp: new Date('2025-11-28T09:20:00'),
    likes: 9,
    isLiked: false,
    replyCount: 18,
    isQuestion: true,
    images: [],
    replies: []
  },
  {
    id: 6,
    authorName: 'Nicolas Blanc',
    authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a789e26f-1763292638442.png",
    authorAvatarAlt: 'Professional headshot of mature man with gray hair and glasses wearing formal shirt',
    title: 'Recommandation vétérinaire spécialisé',
    content: `Je cherche un vétérinaire spécialisé dans les chiens de travail dans la région lyonnaise. Mon Malinois a besoin d'un suivi particulier pour ses articulations.\n\nSi vous avez des recommandations, je suis preneur !`, timestamp: new Date('2025-11-27T14:10:00'),
    likes: 6,
    isLiked: false,
    replyCount: 4,
    isQuestion: true,
    images: [],
    replies: []
  }]
  );

  useEffect(() => {
    if (dogProfiles?.length > 0) {
      setCurrentProfile(dogProfiles?.[0]);
    }
  }, []);

  const handleLike = (postId) => {
    setDiscussions((prevDiscussions) =>
    prevDiscussions?.map((discussion) => {
      if (discussion?.id === postId) {
        return {
          ...discussion,
          isLiked: !discussion?.isLiked,
          likes: discussion?.isLiked ? discussion?.likes - 1 : discussion?.likes + 1
        };
      }

      if (discussion?.replies) {
        return {
          ...discussion,
          replies: discussion?.replies?.map((reply) => {
            if (reply?.id === postId) {
              return {
                ...reply,
                isLiked: !reply?.isLiked,
                likes: reply?.isLiked ? reply?.likes - 1 : reply?.likes + 1
              };
            }
            return reply;
          })
        };
      }

      return discussion;
    })
    );
  };

  const handleReply = (postId, replyText) => {
    const newReply = {
      id: Date.now(),
      authorName: 'Vous',
      authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1f6cd23cf-1763299999171.png",
      authorAvatarAlt: 'Professional headshot of user with friendly smile wearing casual attire',
      content: replyText,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      isQuestion: false,
      images: []
    };

    setDiscussions((prevDiscussions) =>
    prevDiscussions?.map((discussion) => {
      if (discussion?.id === postId) {
        return {
          ...discussion,
          replies: [...(discussion?.replies || []), newReply],
          replyCount: (discussion?.replyCount || 0) + 1
        };
      }
      return discussion;
    })
    );
  };

  const handleNewDiscussion = (discussionData) => {
    const newDiscussion = {
      id: Date.now(),
      authorName: 'Vous',
      authorAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1f6cd23cf-1763299999171.png",
      authorAvatarAlt: 'Professional headshot of user with friendly smile wearing casual attire',
      title: discussionData?.title,
      content: discussionData?.content,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
      replyCount: 0,
      isQuestion: discussionData?.isQuestion,
      images: discussionData?.images?.map((img) => ({
        url: img?.preview,
        alt: img?.alt
      })),
      replies: []
    };

    setDiscussions([newDiscussion, ...discussions]);
  };

  const getFilteredDiscussions = () => {
    let filtered = [...discussions];

    if (searchQuery?.trim()) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(
        (d) =>
        d?.title?.toLowerCase()?.includes(query) ||
        d?.content?.toLowerCase()?.includes(query) ||
        d?.authorName?.toLowerCase()?.includes(query)
      );
    }

    if (filterType === 'questions') {
      filtered = filtered?.filter((d) => d?.isQuestion);
    } else if (filterType === 'photos') {
      filtered = filtered?.filter((d) => d?.images && d?.images?.length > 0);
    }

    filtered?.sort((a, b) => {
      if (sortBy === 'recent') {
        return b?.timestamp - a?.timestamp;
      } else if (sortBy === 'popular') {
        return b?.likes - a?.likes;
      } else if (sortBy === 'oldest') {
        return a?.timestamp - b?.timestamp;
      }
      return 0;
    });

    return filtered;
  };

  const filteredDiscussions = getFilteredDiscussions();

  return (
    <div className="min-h-screen bg-background">
      <TabNavigation />
      <div className="main-content">
        <DiscussionHeader
          breedName={breedInfo?.name}
          totalDiscussions={discussions?.length}
          onNewDiscussion={() => setIsNewDiscussionOpen(true)} />


        <div className="max-w-screen-xl mx-auto px-4 py-2 lg:px-6">
          <ProfileSwitcher
            profiles={dogProfiles}
            currentProfile={currentProfile}
            onProfileChange={setCurrentProfile} />

        </div>

        <FilterControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filterType={filterType}
          onFilterTypeChange={setFilterType} />


        <div className="max-w-screen-xl mx-auto px-4 py-6 lg:px-6 lg:py-8">
          {filteredDiscussions?.length === 0 ?
          <EmptyState
            onNewDiscussion={() => setIsNewDiscussionOpen(true)}
            searchQuery={searchQuery} /> :


          <div className="space-y-4 lg:space-y-6">
              {filteredDiscussions?.map((discussion) =>
            <div key={discussion?.id} className="space-y-4">
                  <DiscussionPost
                post={discussion}
                onLike={handleLike}
                onReply={handleReply}
                onImageClick={(img) => setSelectedImage(img)} />


                  {discussion?.replies && discussion?.replies?.length > 0 &&
              <div className="space-y-4">
                      {discussion?.replies?.map((reply) =>
                <DiscussionPost
                  key={reply?.id}
                  post={reply}
                  onLike={handleLike}
                  onReply={handleReply}
                  onImageClick={(img) => setSelectedImage(img)}
                  isReply={true} />

                )}
                    </div>
              }
                </div>
            )}
            </div>
          }
        </div>
      </div>
      <NewDiscussionModal
        isOpen={isNewDiscussionOpen}
        onClose={() => setIsNewDiscussionOpen(false)}
        onSubmit={handleNewDiscussion}
        breedName={breedInfo?.name} />

      <ImageModal
        isOpen={!!selectedImage}
        image={selectedImage}
        onClose={() => setSelectedImage(null)} />

    </div>);

};

export default ForumDiscussion;