-- ==========================================
-- FIX: Row Level Security pour professional_accounts
-- ==========================================
-- Résout l'erreur 406 (Not Acceptable) lors des requêtes
-- ==========================================

-- 1. Activer RLS si pas déjà fait
ALTER TABLE professional_accounts ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer toutes les anciennes policies pour repartir à zéro
DROP POLICY IF EXISTS "Users can view their own professional account" ON professional_accounts;
DROP POLICY IF EXISTS "Users can create their own professional account" ON professional_accounts;
DROP POLICY IF EXISTS "Users can update their own professional account" ON professional_accounts;
DROP POLICY IF EXISTS "Admins can view all professional accounts" ON professional_accounts;
DROP POLICY IF EXISTS "Public can view active verified professional accounts" ON professional_accounts;

-- 3. Créer les nouvelles policies

-- 3.1 SELECT : Les utilisateurs peuvent voir leur propre compte pro
CREATE POLICY "Users can view their own professional account"
ON professional_accounts
FOR SELECT
USING (
  auth.uid() = user_id
);

-- 3.2 SELECT : Les admins peuvent voir tous les comptes pro
CREATE POLICY "Admins can view all professional accounts"
ON professional_accounts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- 3.3 SELECT : Le public peut voir les comptes pro actifs et vérifiés (pour page adoption)
CREATE POLICY "Public can view active verified professional accounts"
ON professional_accounts
FOR SELECT
USING (
  is_active = true AND is_verified = true
);

-- 3.4 INSERT : Les utilisateurs authentifiés peuvent créer leur compte pro
CREATE POLICY "Users can create their own professional account"
ON professional_accounts
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND NOT EXISTS (
    SELECT 1 FROM professional_accounts
    WHERE user_id = auth.uid()
  )
);

-- 3.5 UPDATE : Les utilisateurs peuvent modifier leur propre compte pro
CREATE POLICY "Users can update their own professional account"
ON professional_accounts
FOR UPDATE
USING (
  auth.uid() = user_id
)
WITH CHECK (
  auth.uid() = user_id
);

-- 3.6 UPDATE : Les admins peuvent modifier tous les comptes pro (vérification, activation)
CREATE POLICY "Admins can update all professional accounts"
ON professional_accounts
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- 3.7 DELETE : Les utilisateurs peuvent supprimer leur propre compte pro
CREATE POLICY "Users can delete their own professional account"
ON professional_accounts
FOR DELETE
USING (
  auth.uid() = user_id
);

-- ==========================================
-- 4. Vérifier que la table a les bonnes colonnes
-- ==========================================

-- Vérifier que toutes les colonnes nécessaires existent
DO $$
BEGIN
  -- Vérifier id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professional_accounts' AND column_name = 'id'
  ) THEN
    RAISE EXCEPTION 'Column id missing from professional_accounts';
  END IF;

  -- Vérifier user_id
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professional_accounts' AND column_name = 'user_id'
  ) THEN
    RAISE EXCEPTION 'Column user_id missing from professional_accounts';
  END IF;

  -- Vérifier is_active
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'professional_accounts' AND column_name = 'is_active'
  ) THEN
    RAISE EXCEPTION 'Column is_active missing from professional_accounts';
  END IF;

  RAISE NOTICE 'All required columns exist in professional_accounts';
END $$;

-- ==========================================
-- 5. Vérifier les indexes
-- ==========================================

-- Index sur user_id pour performance
CREATE INDEX IF NOT EXISTS idx_professional_accounts_user_id
ON professional_accounts(user_id);

-- Index sur is_active et is_verified pour les requêtes publiques
CREATE INDEX IF NOT EXISTS idx_professional_accounts_active_verified
ON professional_accounts(is_active, is_verified);

-- ==========================================
-- 6. Afficher les policies actives
-- ==========================================

SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'professional_accounts'
ORDER BY policyname;

-- ==========================================
-- TEST: Vérifier que les requêtes fonctionnent
-- ==========================================

-- Test 1: Compter les comptes pro (doit fonctionner même non authentifié pour les comptes publics)
SELECT COUNT(*) as total_pro_accounts FROM professional_accounts;

-- Test 2: Compter les comptes actifs et vérifiés (publics)
SELECT COUNT(*) as public_pro_accounts
FROM professional_accounts
WHERE is_active = true AND is_verified = true;

-- ==========================================
-- NOTES
-- ==========================================

/*
Erreur 406 (Not Acceptable) peut être causée par:

1. ✅ RLS pas activé → CORRIGÉ
2. ✅ Policies manquantes ou trop restrictives → CORRIGÉ
3. ✅ Problème de format de réponse → CORRIGÉ avec policies SELECT
4. ⚠️ Problème au niveau de l'application (header Accept) → À vérifier côté client

Si l'erreur persiste après ce script:
- Vérifier les headers HTTP de la requête (Accept: application/json)
- Vérifier que auth.uid() retourne bien un UUID valide
- Vérifier les logs Supabase pour plus de détails
*/
