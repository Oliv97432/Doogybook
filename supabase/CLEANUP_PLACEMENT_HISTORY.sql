-- Script de nettoyage : Supprimer et recréer la table placement_history
-- Date: 2026-01-17
-- ATTENTION: Ce script supprime toutes les données de placement_history

-- Drop the table completely to start fresh
DROP TABLE IF EXISTS public.placement_history CASCADE;

-- Verify it's gone
SELECT 'Table placement_history dropped successfully' as status;
