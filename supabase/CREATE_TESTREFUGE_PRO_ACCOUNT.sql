-- =========================================
-- 🏢 CRÉER LE COMPTE PROFESSIONNEL TESTREFUGE
-- =========================================
-- Date: 2026-01-16
-- Email: testrefuge@gmail.com
-- Problème: Le compte existe dans user_profiles mais pas dans professional_accounts
-- =========================================

-- Étape 1: Vérifier si le user_profile existe
SELECT
    id,
    email,
    full_name,
    created_at
FROM public.user_profiles
WHERE email = 'testrefuge@gmail.com';

-- ⚠️ IMPORTANT: Copiez l'UUID (colonne 'id') du résultat ci-dessus
-- C'est le user_id à utiliser pour créer le compte pro

-- =========================================
-- Étape 2: Créer le compte professionnel
-- =========================================
-- ⚠️ REMPLACER 'USER_ID_DE_TESTREFUGE' par l'UUID obtenu à l'étape 1

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
) VALUES (
    'USER_ID_DE_TESTREFUGE',  -- ⚠️ REMPLACER par l'UUID du user_profile
    'Test Refuge',
    'refuge',
    '01 23 45 67 89',
    'testrefuge@gmail.com',
    'Paris',
    '75001',
    'Refuge de test pour démonstration et développement de l''application Woofly. Compte utilisé pour tester les fonctionnalités professionnelles.',
    true,
    true,
    NOW(),
    NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
    organization_name = EXCLUDED.organization_name,
    email = EXCLUDED.email,
    updated_at = NOW();

-- =========================================
-- Étape 3: Vérification
-- =========================================

-- Vérifier que le compte pro a été créé
SELECT
    pa.id as professional_account_id,
    pa.organization_name,
    pa.email as pro_email,
    pa.organization_type,
    pa.is_active,
    pa.is_verified,
    up.id as user_id,
    up.email as user_email,
    up.full_name
FROM public.professional_accounts pa
INNER JOIN public.user_profiles up ON pa.user_id = up.id
WHERE pa.email = 'testrefuge@gmail.com'
   OR up.email = 'testrefuge@gmail.com';

-- =========================================
-- Étape 4: Compter les chiens du compte
-- =========================================

-- Cette requête devrait retourner 0 pour l'instant
-- Après avoir ajouté les chiens avec ADD_5_DOGS_TESTREFUGE.sql, elle devrait retourner 5

SELECT
    pa.organization_name,
    pa.email,
    COUNT(d.id) as nombre_chiens
FROM public.professional_accounts pa
LEFT JOIN public.dogs d ON d.professional_account_id = pa.id
WHERE pa.email = 'testrefuge@gmail.com'
GROUP BY pa.id, pa.organization_name, pa.email;

-- =========================================
-- ✅ RÉSULTAT ATTENDU
-- =========================================
--
-- Étape 3 devrait retourner :
-- - professional_account_id: UUID du nouveau compte pro
-- - organization_name: Test Refuge
-- - pro_email: testrefuge@gmail.com
-- - organization_type: refuge
-- - is_active: true
-- - is_verified: true
-- - user_id: UUID du user_profile
-- - user_email: testrefuge@gmail.com
-- - full_name: Prospéo (ou autre)
--
-- Étape 4 devrait retourner :
-- - organization_name: Test Refuge
-- - email: testrefuge@gmail.com
-- - nombre_chiens: 0 (avant d'ajouter les chiens)
--
-- =========================================
-- 📝 NOTES IMPORTANTES
-- =========================================
--
-- 1. Le ON CONFLICT évite les erreurs si le compte existe déjà
-- 2. is_verified = true permet d'accéder aux fonctionnalités pro immédiatement
-- 3. Après avoir créé le compte pro, utilisez ADD_5_DOGS_TESTREFUGE.sql
--    pour ajouter les 5 chiens exemples
--
-- =========================================
-- 🔄 ORDRE D'EXÉCUTION
-- =========================================
--
-- 1. Exécutez CE script (CREATE_TESTREFUGE_PRO_ACCOUNT.sql)
-- 2. Notez l'UUID du professional_account_id
-- 3. Exécutez ADD_5_DOGS_TESTREFUGE.sql en utilisant cet UUID
-- 4. Les chiens apparaîtront dans le ProDashboard
--
-- =========================================
