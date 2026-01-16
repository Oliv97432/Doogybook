-- Script de correction : Mettre à jour les chiens existants pour qu'ils soient adoptables
-- Date: 2026-01-17
-- ATTENTION: Ce script modifie les données. Vérifiez avant d'exécuter !

-- Option 1: Mettre à jour TOUS les chiens du refuge "Test Refuge" pour les rendre adoptables
UPDATE public.dogs d
SET
    is_for_adoption = true,
    adoption_status = 'available',
    is_published = true
FROM public.professional_accounts pa
WHERE d.professional_account_id = pa.id
  AND pa.organization_name = 'Test Refuge'
  AND d.user_id IS NULL; -- Seulement les chiens du refuge, pas les chiens personnels

-- Vérifier le résultat
SELECT
    d.name,
    d.breed,
    d.is_for_adoption,
    d.adoption_status,
    d.is_published,
    pa.organization_name
FROM public.dogs d
JOIN public.professional_accounts pa ON d.professional_account_id = pa.id
WHERE pa.organization_name = 'Test Refuge'
ORDER BY d.name;
