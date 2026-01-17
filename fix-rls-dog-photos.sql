-- =====================================================
-- FIX RLS POLICIES POUR LA TABLE DOG_PHOTOS
-- =====================================================
-- Ce script corrige les politiques de sécurité Row-Level Security (RLS)
-- pour permettre aux utilisateurs d'ajouter, voir et gérer les photos
-- de leurs propres chiens.

-- Activer RLS sur la table dog_photos (si ce n'est pas déjà fait)
ALTER TABLE dog_photos ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view photos of their own dogs" ON dog_photos;
DROP POLICY IF EXISTS "Users can insert photos for their own dogs" ON dog_photos;
DROP POLICY IF EXISTS "Users can update photos of their own dogs" ON dog_photos;
DROP POLICY IF EXISTS "Users can delete photos of their own dogs" ON dog_photos;

-- =====================================================
-- POLITIQUE 1: SELECT (Lecture)
-- =====================================================
-- Permettre aux utilisateurs de voir les photos de leurs propres chiens
CREATE POLICY "Users can view photos of their own dogs"
ON dog_photos
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = dog_photos.dog_id
    AND dogs.user_id = auth.uid()
  )
);

-- =====================================================
-- POLITIQUE 2: INSERT (Création)
-- =====================================================
-- Permettre aux utilisateurs d'ajouter des photos pour leurs propres chiens
CREATE POLICY "Users can insert photos for their own dogs"
ON dog_photos
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = dog_photos.dog_id
    AND dogs.user_id = auth.uid()
  )
);

-- =====================================================
-- POLITIQUE 3: UPDATE (Modification)
-- =====================================================
-- Permettre aux utilisateurs de modifier les photos de leurs propres chiens
CREATE POLICY "Users can update photos of their own dogs"
ON dog_photos
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = dog_photos.dog_id
    AND dogs.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = dog_photos.dog_id
    AND dogs.user_id = auth.uid()
  )
);

-- =====================================================
-- POLITIQUE 4: DELETE (Suppression)
-- =====================================================
-- Permettre aux utilisateurs de supprimer les photos de leurs propres chiens
CREATE POLICY "Users can delete photos of their own dogs"
ON dog_photos
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM dogs
    WHERE dogs.id = dog_photos.dog_id
    AND dogs.user_id = auth.uid()
  )
);

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Pour vérifier que les politiques sont bien en place :
-- SELECT * FROM pg_policies WHERE tablename = 'dog_photos';
