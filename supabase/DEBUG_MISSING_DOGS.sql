-- =========================================
-- 🔍 DIAGNOSTIC: CHIENS DISPARUS DE TESTREFUGE
-- =========================================
-- Date: 2026-01-16
-- Problème: Les chiens exemples du profil testrefuge ont disparu
-- =========================================

-- =========================================
-- 1. VÉRIFIER LE COMPTE PROFESSIONNEL TESTREFUGE
-- =========================================

SELECT
    id,
    organization_name,
    email,
    user_id,
    is_active,
    is_verified,
    created_at
FROM public.professional_accounts
WHERE organization_name ILIKE '%test%'
   OR email ILIKE '%test%'
ORDER BY created_at DESC;

-- =========================================
-- 2. COMPTER LES CHIENS PAR COMPTE PRO
-- =========================================

SELECT
    pa.id as pro_account_id,
    pa.organization_name,
    pa.email,
    COUNT(d.id) as nombre_chiens
FROM public.professional_accounts pa
LEFT JOIN public.dogs d ON d.professional_account_id = pa.id
WHERE pa.organization_name ILIKE '%test%'
   OR pa.email ILIKE '%test%'
GROUP BY pa.id, pa.organization_name, pa.email
ORDER BY nombre_chiens DESC;

-- =========================================
-- 3. VÉRIFIER TOUS LES CHIENS (derniers 50)
-- =========================================

SELECT
    d.id,
    d.name,
    d.breed,
    d.professional_account_id,
    pa.organization_name,
    d.adoption_status,
    d.created_at,
    d.updated_at
FROM public.dogs d
LEFT JOIN public.professional_accounts pa ON d.professional_account_id = pa.id
ORDER BY d.created_at DESC
LIMIT 50;

-- =========================================
-- 4. CHERCHER LES CHIENS ORPHELINS (sans compte pro)
-- =========================================

SELECT
    d.id,
    d.name,
    d.breed,
    d.professional_account_id,
    d.adoption_status,
    d.created_at
FROM public.dogs d
WHERE d.professional_account_id IS NULL
ORDER BY d.created_at DESC
LIMIT 20;

-- =========================================
-- 5. VÉRIFIER LES CHIENS AVEC professional_account_id INVALIDE
-- =========================================

SELECT
    d.id,
    d.name,
    d.breed,
    d.professional_account_id,
    d.created_at
FROM public.dogs d
WHERE d.professional_account_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM public.professional_accounts pa
      WHERE pa.id = d.professional_account_id
  )
ORDER BY d.created_at DESC;

-- =========================================
-- 6. STATISTIQUES GLOBALES
-- =========================================

SELECT
    'Total professional_accounts' as metric,
    COUNT(*) as count
FROM public.professional_accounts
UNION ALL
SELECT
    'Total dogs' as metric,
    COUNT(*) as count
FROM public.dogs
UNION ALL
SELECT
    'Dogs avec professional_account_id' as metric,
    COUNT(*) as count
FROM public.dogs
WHERE professional_account_id IS NOT NULL
UNION ALL
SELECT
    'Dogs sans professional_account_id (orphelins)' as metric,
    COUNT(*) as count
FROM public.dogs
WHERE professional_account_id IS NULL;

-- =========================================
-- 7. TROUVER LE COMPTE TESTREFUGE EXACT
-- =========================================

-- Si vous connaissez l'email exact de testrefuge
-- SELECT * FROM public.professional_accounts WHERE email = 'votre_email_testrefuge@example.com';

-- Sinon, lister tous les comptes pro
SELECT
    id,
    organization_name,
    email,
    organization_type,
    is_verified,
    is_active,
    created_at
FROM public.professional_accounts
ORDER BY created_at DESC;

-- =========================================
-- 🔍 RÉSOLUTION POSSIBLE
-- =========================================

-- Si les chiens existent mais avec un mauvais professional_account_id :
-- UPDATE public.dogs
-- SET professional_account_id = 'UUID_DU_BON_COMPTE_PRO'
-- WHERE id IN (
--     SELECT id FROM public.dogs
--     WHERE name IN ('nom_chien_1', 'nom_chien_2', ...)
-- );

-- Si les chiens ont été supprimés, vous devrez les recréer
