-- ============================================
-- MIGRATION: Un seul album → Albums multiples
-- ============================================
-- Ce script permet de passer d'un système avec un seul album par chien
-- à un système permettant plusieurs albums par chien avec titre personnalisé

-- ATTENTION: Exécutez ce script seulement si vous avez déjà créé la table dog_albums
-- avec la contrainte UNIQUE(dog_id) et que vous voulez permettre plusieurs albums

-- ============================================
-- Étape 1: Supprimer la contrainte UNIQUE
-- ============================================

-- Supprimer la contrainte d'unicité sur dog_id
ALTER TABLE dog_albums DROP CONSTRAINT IF EXISTS dog_albums_dog_id_key;

-- ============================================
-- Étape 2: Ajouter la colonne album_title
-- ============================================

-- Ajouter la colonne pour le titre de l'album
ALTER TABLE dog_albums ADD COLUMN IF NOT EXISTS album_title VARCHAR(100) NOT NULL DEFAULT 'Mon Album';

-- ============================================
-- Étape 3: Mettre à jour les albums existants
-- ============================================

-- Donner un titre par défaut aux albums existants qui n'en ont pas
UPDATE dog_albums
SET album_title = 'Mon Album'
WHERE album_title IS NULL OR album_title = '';

-- ============================================
-- Étape 4: Commentaires pour documentation
-- ============================================

COMMENT ON TABLE dog_albums IS 'Stocke les albums photo des chiens sous forme de JSON compressé - Support de plusieurs albums par chien';
COMMENT ON COLUMN dog_albums.album_title IS 'Titre de l''album (ex: "Vacances 2024", "Premiers mois", etc.)';

-- ============================================
-- VÉRIFICATION
-- ============================================

-- Vérifier que la migration a réussi
DO $$
BEGIN
  RAISE NOTICE '✅ Migration terminée avec succès!';
  RAISE NOTICE '📋 Les utilisateurs peuvent maintenant créer plusieurs albums par chien';
  RAISE NOTICE '📝 Chaque album doit avoir un titre personnalisé';
END $$;
