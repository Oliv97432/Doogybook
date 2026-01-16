-- Script de diagnostic : Vérifier les chiens disponibles à l'adoption
-- Date: 2026-01-17

-- 1. Compter tous les chiens
SELECT
    'Total chiens' as description,
    COUNT(*) as count
FROM public.dogs;

-- 2. Compter les chiens avec is_for_adoption = true
SELECT
    'Chiens avec is_for_adoption = true' as description,
    COUNT(*) as count
FROM public.dogs
WHERE is_for_adoption = true;

-- 3. Compter les chiens avec adoption_status = 'available'
SELECT
    'Chiens avec adoption_status = available' as description,
    COUNT(*) as count
FROM public.dogs
WHERE adoption_status = 'available';

-- 4. Compter les chiens qui devraient s'afficher (les deux conditions)
SELECT
    'Chiens affichables (is_for_adoption=true ET adoption_status=available)' as description,
    COUNT(*) as count
FROM public.dogs
WHERE is_for_adoption = true
  AND adoption_status = 'available';

-- 5. Lister les chiens avec leurs propriétés importantes
SELECT
    id,
    name,
    breed,
    is_for_adoption,
    adoption_status,
    is_published,
    professional_account_id,
    user_id,
    created_at
FROM public.dogs
ORDER BY created_at DESC
LIMIT 20;

-- 6. Afficher les chiens du refuge "Test Refuge"
SELECT
    d.id,
    d.name,
    d.breed,
    d.is_for_adoption,
    d.adoption_status,
    d.is_published,
    pa.organization_name
FROM public.dogs d
LEFT JOIN public.professional_accounts pa ON d.professional_account_id = pa.id
WHERE pa.organization_name = 'Test Refuge'
ORDER BY d.created_at DESC;
