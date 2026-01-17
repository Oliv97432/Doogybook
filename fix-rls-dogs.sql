-- =====================================================
-- FIX RLS POLICIES POUR LA TABLE DOGS
-- =====================================================
-- Ce script corrige les politiques de sécurité Row-Level Security (RLS)
-- pour permettre aux utilisateurs de créer, lire, modifier et supprimer
-- leurs propres chiens.

-- Activer RLS sur la table dogs (si ce n'est pas déjà fait)
ALTER TABLE dogs ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes politiques si elles existent
DROP POLICY IF EXISTS "Users can view their own dogs" ON dogs;
DROP POLICY IF EXISTS "Users can insert their own dogs" ON dogs;
DROP POLICY IF EXISTS "Users can update their own dogs" ON dogs;
DROP POLICY IF EXISTS "Users can delete their own dogs" ON dogs;
DROP POLICY IF EXISTS "Public can view adoption dogs" ON dogs;

-- =====================================================
-- POLITIQUE 1: SELECT (Lecture)
-- =====================================================
-- Permettre aux utilisateurs de voir leurs propres chiens
CREATE POLICY "Users can view their own dogs"
ON dogs
FOR SELECT
USING (
  auth.uid() = user_id
);

-- =====================================================
-- POLITIQUE 2: INSERT (Création)
-- =====================================================
-- Permettre aux utilisateurs de créer des chiens avec leur propre user_id
CREATE POLICY "Users can insert their own dogs"
ON dogs
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
);

-- =====================================================
-- POLITIQUE 3: UPDATE (Modification)
-- =====================================================
-- Permettre aux utilisateurs de modifier uniquement leurs propres chiens
CREATE POLICY "Users can update their own dogs"
ON dogs
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- POLITIQUE 4: DELETE (Suppression)
-- =====================================================
-- Permettre aux utilisateurs de supprimer uniquement leurs propres chiens
CREATE POLICY "Users can delete their own dogs"
ON dogs
FOR DELETE
USING (auth.uid() = user_id);

-- =====================================================
-- VÉRIFICATION
-- =====================================================
-- Pour vérifier que les politiques sont bien en place :
-- SELECT * FROM pg_policies WHERE tablename = 'dogs';
