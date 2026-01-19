-- =========================================
-- 🚀 SETUP COMPLET TESTREFUGE (AUTOMATIQUE)
-- =========================================
-- Date: 2026-01-16
-- Email: testrefuge@gmail.com
-- Ce script crée automatiquement le compte pro ET les 5 chiens
-- SANS AVOIR À REMPLACER LES UUID MANUELLEMENT
-- =========================================

-- =========================================
-- ÉTAPE 1: Créer le compte professionnel
-- =========================================

-- Créer ou mettre à jour le compte professionnel pour testrefuge@gmail.com
INSERT INTO public.professional_accounts (
    user_id,
    organization_name,
    organization_type,
    phone,
    email,
    city,
    postal_code,
    description,
    is_active,
    is_verified,
    created_at,
    updated_at
)
SELECT
    up.id,  -- Utilise automatiquement l'UUID du user_profile
    'Test Refuge',
    'refuge'::public.organization_type,
    '01 23 45 67 89',
    'testrefuge@gmail.com',
    'Paris',
    '75001',
    'Refuge de test pour démonstration et développement de l''application Woofly. Compte utilisé pour tester les fonctionnalités professionnelles.',
    true,
    true,
    NOW(),
    NOW()
FROM public.user_profiles up
WHERE up.email = 'testrefuge@gmail.com'
ON CONFLICT (user_id) DO UPDATE SET
    organization_name = EXCLUDED.organization_name,
    email = EXCLUDED.email,
    is_active = EXCLUDED.is_active,
    is_verified = EXCLUDED.is_verified,
    updated_at = NOW();

-- Vérifier que le compte pro a été créé
SELECT
    pa.id as professional_account_id,
    pa.organization_name,
    pa.email,
    pa.is_verified,
    pa.is_active
FROM public.professional_accounts pa
WHERE pa.email = 'testrefuge@gmail.com';

-- =========================================
-- ÉTAPE 2: Ajouter les 5 chiens
-- =========================================

-- Supprimer les anciens chiens de test (si existants)
DELETE FROM public.dogs
WHERE professional_account_id IN (
    SELECT id FROM public.professional_accounts WHERE email = 'testrefuge@gmail.com'
);

-- Insérer les 5 nouveaux chiens avec photos
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
)
SELECT
    dogs_data.name,
    dogs_data.breed,
    dogs_data.gender,
    dogs_data.birth_date,
    dogs_data.adoption_status,
    pa.id,  -- Utilise automatiquement l'UUID du compte pro
    dogs_data.is_urgent,
    dogs_data.notes,
    dogs_data.photo_url,
    dogs_data.weight,
    NOW(),
    NOW()
FROM public.professional_accounts pa
CROSS JOIN (
    VALUES
        -- Chien 1: Max - Labrador
        (
            'Max',
            'Labrador',
            'male'::public.gender_type,
            '2020-06-15'::DATE,
            'available'::public.adoption_status,
            false,
            'Max est un Labrador adorable et très joueur. Il adore les enfants et les longues promenades. C''est un chien très sociable qui s''entend bien avec les autres animaux. Idéal pour une famille active. Vacciné, stérilisé, pucé.',
            '/placeholder-dog-1.jpg',
            30.5
        ),
        -- Chien 2: Luna - Berger Allemand (URGENT)
        (
            'Luna',
            'Berger Allemand',
            'female'::public.gender_type,
            '2019-03-20'::DATE,
            'available'::public.adoption_status,
            true,
            '⚠️ URGENCE - Refuge plein. Luna est une femelle Berger Allemand intelligente et loyale. Elle a besoin d''un foyer rapidement. Excellente gardienne, très obéissante et affectueuse. Parfaite pour personne sportive. Vaccinée, stérilisée, pucée.',
            '/placeholder-dog-2.jpg',
            28.0
        ),
        -- Chien 3: Rocky - Croisé (En cours d'adoption)
        (
            'Rocky',
            'Croisé',
            'male'::public.gender_type,
            '2021-11-10'::DATE,
            'pending'::public.adoption_status,
            false,
            'Rocky est en cours d''adoption ! Croisé adorable au caractère doux. Rencontre prévue ce week-end avec une famille. C''est un chien calme et affectueux qui adore les câlins. Vacciné, stérilisé, pucé.',
            '/placeholder-dog-3.jpg',
            15.5
        ),
        -- Chien 4: Bella - Golden Retriever
        (
            'Bella',
            'Golden Retriever',
            'female'::public.gender_type,
            '2018-08-05'::DATE,
            'available'::public.adoption_status,
            false,
            'Bella est une Golden Retriever douce et patiente. Parfaite avec les enfants, elle a un tempérament calme et affectueux. Elle aime nager et jouer à rapporter la balle. Chienne idéale pour une famille. Vaccinée, stérilisée, pucée.',
            '/placeholder-dog-4.jpg',
            32.0
        ),
        -- Chien 5: Buddy - Beagle
        (
            'Buddy',
            'Beagle',
            'male'::public.gender_type,
            '2022-01-28'::DATE,
            'available'::public.adoption_status,
            false,
            'Buddy est un jeune Beagle plein d''énergie ! Très curieux et joueur, il adore explorer. Il a besoin d''une famille qui saura canaliser son énergie avec des promenades régulières et du jeu. Vacciné, stérilisé, pucé.',
            '/placeholder-dog-5.jpg',
            12.0
        )
) AS dogs_data(name, breed, gender, birth_date, adoption_status, is_urgent, notes, photo_url, weight)
WHERE pa.email = 'testrefuge@gmail.com';

-- =========================================
-- ÉTAPE 3: Vérification finale
-- =========================================

-- Afficher le compte pro et tous ses chiens
SELECT
    pa.organization_name,
    pa.email,
    COUNT(d.id) as nombre_chiens,
    pa.is_verified,
    pa.is_active
FROM public.professional_accounts pa
LEFT JOIN public.dogs d ON d.professional_account_id = pa.id
WHERE pa.email = 'testrefuge@gmail.com'
GROUP BY pa.id, pa.organization_name, pa.email, pa.is_verified, pa.is_active;

-- Afficher la liste des chiens créés
SELECT
    d.id,
    d.name,
    d.breed,
    d.gender,
    d.adoption_status,
    d.is_urgent,
    d.weight,
    d.photo_url,
    pa.organization_name
FROM public.dogs d
INNER JOIN public.professional_accounts pa ON d.professional_account_id = pa.id
WHERE pa.email = 'testrefuge@gmail.com'
ORDER BY d.created_at DESC;

-- =========================================
-- ✅ RÉSULTAT ATTENDU
-- =========================================
--
-- Première requête devrait afficher :
-- - organization_name: Test Refuge
-- - email: testrefuge@gmail.com
-- - nombre_chiens: 5
-- - is_verified: true
-- - is_active: true
--
-- Deuxième requête devrait afficher les 5 chiens :
-- 1. Max (Labrador, mâle, 30.5 kg)
-- 2. Luna (Berger Allemand, femelle, 28 kg, URGENT)
-- 3. Rocky (Croisé, mâle, 15.5 kg, EN COURS D'ADOPTION)
-- 4. Bella (Golden Retriever, femelle, 32 kg)
-- 5. Buddy (Beagle, mâle, 12 kg)
--
-- =========================================
-- 🎯 AVANTAGES DE CE SCRIPT
-- =========================================
--
-- ✅ AUTOMATIQUE: Pas besoin de copier/coller d'UUID
-- ✅ IDEMPOTENT: Peut être exécuté plusieurs fois sans erreur
-- ✅ COMPLET: Crée le compte pro ET les chiens en une seule fois
-- ✅ NETTOYAGE: Supprime les anciens chiens de test avant insertion
-- ✅ VÉRIFICATION: Affiche les résultats à la fin
--
-- Exécutez simplement ce script dans Supabase SQL Editor !
--
-- =========================================
