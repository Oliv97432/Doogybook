-- =========================================
-- 🐕 AJOUTER 5 CHIENS POUR TESTREFUGE
-- =========================================
-- Date: 2026-01-16
-- Email du compte: testrefuge@gmail.com
-- =========================================

-- Étape 1: Trouver l'UUID du compte testrefuge
-- EXÉCUTER D'ABORD CETTE REQUÊTE pour obtenir l'UUID
SELECT
    id,
    organization_name,
    email,
    user_id
FROM public.professional_accounts
WHERE email = 'testrefuge@gmail.com';

-- ⚠️ IMPORTANT: Copiez l'UUID (colonne 'id') du résultat ci-dessus
-- et remplacez 'UUID_DU_COMPTE_TESTREFUGE' dans le script ci-dessous

-- =========================================
-- Étape 2: Insérer les 5 chiens
-- =========================================
-- ⚠️ REMPLACER 'UUID_DU_COMPTE_TESTREFUGE' par l'UUID obtenu à l'étape 1

INSERT INTO public.dogs (
    name,
    breed,
    gender,
    birth_date,
    adoption_status,
    professional_account_id,
    is_urgent,
    notes,
    photo_url,
    weight,
    created_at,
    updated_at
) VALUES
-- Chien 1: Max - Labrador
(
    'Max',
    'Labrador',
    'male',
    '2020-06-15',
    'available',
    'UUID_DU_COMPTE_TESTREFUGE',  -- ⚠️ REMPLACER ICI
    false,
    'Max est un Labrador adorable et très joueur. Il adore les enfants et les longues promenades. C''est un chien très sociable qui s''entend bien avec les autres animaux. Idéal pour une famille active. Vacciné, stérilisé, pucé.',
    'https://images.unsplash.com/photo-1597633425046-08f5110420b5?w=800&h=600&fit=crop',
    30.5,
    NOW(),
    NOW()
),

-- Chien 2: Luna - Berger Allemand
(
    'Luna',
    'Berger Allemand',
    'female',
    '2019-03-20',
    'available',
    'UUID_DU_COMPTE_TESTREFUGE',  -- ⚠️ REMPLACER ICI
    true,
    '⚠️ URGENCE - Refuge plein. Luna est une femelle Berger Allemand intelligente et loyale. Elle a besoin d''un foyer rapidement. Excellente gardienne, très obéissante et affectueuse. Parfaite pour personne sportive. Vaccinée, stérilisée, pucée.',
    'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800&h=600&fit=crop',
    28.0,
    NOW(),
    NOW()
),

-- Chien 3: Rocky - Croisé
(
    'Rocky',
    'Croisé',
    'male',
    '2021-11-10',
    'pending',
    'UUID_DU_COMPTE_TESTREFUGE',  -- ⚠️ REMPLACER ICI
    false,
    'Rocky est en cours d''adoption ! Croisé adorable au caractère doux. Rencontre prévue ce week-end avec une famille. C''est un chien calme et affectueux qui adore les câlins. Vacciné, stérilisé, pucé.',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&h=600&fit=crop',
    15.5,
    NOW(),
    NOW()
),

-- Chien 4: Bella - Golden Retriever
(
    'Bella',
    'Golden Retriever',
    'female',
    '2018-08-05',
    'available',
    'UUID_DU_COMPTE_TESTREFUGE',  -- ⚠️ REMPLACER ICI
    false,
    'Bella est une Golden Retriever douce et patiente. Parfaite avec les enfants, elle a un tempérament calme et affectueux. Elle aime nager et jouer à rapporter la balle. Chienne idéale pour une famille. Vaccinée, stérilisée, pucée.',
    'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&fit=crop',
    32.0,
    NOW(),
    NOW()
),

-- Chien 5: Buddy - Beagle
(
    'Buddy',
    'Beagle',
    'male',
    '2022-01-28',
    'available',
    'UUID_DU_COMPTE_TESTREFUGE',  -- ⚠️ REMPLACER ICI
    false,
    'Buddy est un jeune Beagle plein d''énergie ! Très curieux et joueur, il adore explorer. Il a besoin d''une famille qui saura canaliser son énergie avec des promenades régulières et du jeu. Vacciné, stérilisé, pucé.',
    'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&h=600&fit=crop',
    12.0,
    NOW(),
    NOW()
);

-- =========================================
-- Étape 3: Vérification
-- =========================================
-- ⚠️ REMPLACER 'UUID_DU_COMPTE_TESTREFUGE' par l'UUID obtenu à l'étape 1

SELECT
    d.id,
    d.name,
    d.breed,
    d.gender,
    d.adoption_status,
    d.is_urgent,
    d.photo_url,
    pa.organization_name,
    pa.email
FROM public.dogs d
INNER JOIN public.professional_accounts pa ON d.professional_account_id = pa.id
WHERE pa.email = 'testrefuge@gmail.com'
ORDER BY d.created_at DESC;

-- =========================================
-- ✅ RÉSULTAT ATTENDU
-- =========================================
-- Vous devriez voir 5 nouveaux chiens :
-- 1. Max (Labrador, mâle, disponible)
-- 2. Luna (Berger Allemand, femelle, disponible, URGENT)
-- 3. Rocky (Croisé, mâle, en cours d'adoption)
-- 4. Bella (Golden Retriever, femelle, disponible)
-- 5. Buddy (Beagle, mâle, disponible)

-- =========================================
-- 📝 NOTES IMPORTANTES
-- =========================================
--
-- Les photos utilisées proviennent d'Unsplash (gratuites) :
-- - Max: Photo de Labrador joueur
-- - Luna: Photo de Berger Allemand
-- - Rocky: Photo de croisé adorable
-- - Bella: Photo de Golden Retriever
-- - Buddy: Photo de Beagle
--
-- Vous pouvez remplacer les URLs des photos par vos propres images
-- en modifiant la colonne 'photo_url' après insertion.
--
-- =========================================
-- 🔄 COMMENT UTILISER CE SCRIPT
-- =========================================
--
-- 1. Exécutez l'Étape 1 pour trouver l'UUID de testrefuge
-- 2. Copiez l'UUID de la colonne 'id'
-- 3. Remplacez TOUS les 'UUID_DU_COMPTE_TESTREFUGE' dans le script
-- 4. Exécutez l'Étape 2 (INSERT) pour ajouter les 5 chiens
-- 5. Exécutez l'Étape 3 (SELECT) pour vérifier que les chiens ont été ajoutés
--
-- =========================================
