-- =========================================
-- 🗑️ SUPPRESSION DES TABLES FORUM
-- =========================================
-- Date: 2026-01-16
-- Raison: Suppression de la fonctionnalité Forum de l'application
-- Tables concernées: forums, forum_posts, forum_post_images, forum_comments, forum_likes
-- =========================================

-- Désactiver temporairement les vérifications de clés étrangères
SET session_replication_role = 'replica';

-- =========================================
-- SUPPRESSION DES TABLES (ordre inverse des dépendances)
-- =========================================

-- 1. Supprimer les likes (aucune dépendance)
DROP TABLE IF EXISTS public.forum_likes CASCADE;

-- 2. Supprimer les commentaires (dépend de forum_posts et user_profiles)
DROP TABLE IF EXISTS public.forum_comments CASCADE;

-- 3. Supprimer les images de posts (dépend de forum_posts)
DROP TABLE IF EXISTS public.forum_post_images CASCADE;

-- 4. Supprimer les posts (dépend de forums et user_profiles)
DROP TABLE IF EXISTS public.forum_posts CASCADE;

-- 5. Supprimer les forums (table principale)
DROP TABLE IF EXISTS public.forums CASCADE;

-- =========================================
-- SUPPRESSION DES INDEX ASSOCIÉS (si non supprimés par CASCADE)
-- =========================================

-- Index forums
DROP INDEX IF EXISTS public.idx_forums_slug;
DROP INDEX IF EXISTS public.idx_forums_created_at;

-- Index forum_posts
DROP INDEX IF EXISTS public.idx_forum_posts_forum_id;
DROP INDEX IF EXISTS public.idx_forum_posts_user_id;
DROP INDEX IF EXISTS public.idx_forum_posts_created_at;

-- Index forum_post_images
DROP INDEX IF EXISTS public.idx_forum_post_images_post_id;

-- Index forum_comments
DROP INDEX IF EXISTS public.idx_forum_comments_post_id;
DROP INDEX IF EXISTS public.idx_forum_comments_user_id;
DROP INDEX IF EXISTS public.idx_forum_comments_created_at;

-- Index forum_likes
DROP INDEX IF EXISTS public.idx_forum_likes_post_id;
DROP INDEX IF EXISTS public.idx_forum_likes_user_id;
DROP INDEX IF EXISTS public.idx_forum_likes_unique;

-- =========================================
-- SUPPRESSION DES FONCTIONS ET TRIGGERS ASSOCIÉS
-- =========================================

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS set_timestamp_forums ON public.forums;
DROP TRIGGER IF EXISTS set_timestamp_forum_posts ON public.forum_posts;
DROP TRIGGER IF EXISTS set_timestamp_forum_comments ON public.forum_comments;

-- Triggers pour les likes
DROP TRIGGER IF EXISTS update_forum_post_likes_count ON public.forum_likes;

-- Fonctions associées (si elles existent)
DROP FUNCTION IF EXISTS public.increment_forum_post_likes() CASCADE;
DROP FUNCTION IF EXISTS public.decrement_forum_post_likes() CASCADE;
DROP FUNCTION IF EXISTS public.update_forum_post_comments_count() CASCADE;

-- =========================================
-- SUPPRESSION DES POLITIQUES RLS
-- =========================================

-- Forums policies
DROP POLICY IF EXISTS "Tout le monde peut voir les forums" ON public.forums;
DROP POLICY IF EXISTS "Admins peuvent créer des forums" ON public.forums;
DROP POLICY IF EXISTS "Admins peuvent modifier des forums" ON public.forums;

-- Forum posts policies
DROP POLICY IF EXISTS "Tout le monde peut voir les posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Utilisateurs authentifiés peuvent créer des posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Utilisateurs peuvent modifier leurs posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Utilisateurs peuvent supprimer leurs posts" ON public.forum_posts;

-- Forum comments policies
DROP POLICY IF EXISTS "Tout le monde peut voir les commentaires" ON public.forum_comments;
DROP POLICY IF EXISTS "Utilisateurs authentifiés peuvent commenter" ON public.forum_comments;
DROP POLICY IF EXISTS "Utilisateurs peuvent modifier leurs commentaires" ON public.forum_comments;
DROP POLICY IF EXISTS "Utilisateurs peuvent supprimer leurs commentaires" ON public.forum_comments;

-- Forum likes policies
DROP POLICY IF EXISTS "Utilisateurs peuvent voir les likes" ON public.forum_likes;
DROP POLICY IF EXISTS "Utilisateurs authentifiés peuvent liker" ON public.forum_likes;
DROP POLICY IF EXISTS "Utilisateurs peuvent retirer leurs likes" ON public.forum_likes;

-- =========================================
-- SUPPRESSION DES TYPES ENUM (si créés spécifiquement pour le forum)
-- =========================================

-- Vérifier si ces types existent et ne sont pas utilisés ailleurs
-- DROP TYPE IF EXISTS public.forum_post_type CASCADE;
-- DROP TYPE IF EXISTS public.forum_category CASCADE;

-- Réactiver les vérifications de clés étrangères
SET session_replication_role = 'origin';

-- =========================================
-- VÉRIFICATION FINALE
-- =========================================

-- Afficher les tables restantes commençant par 'forum'
SELECT
    tablename,
    schemaname
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename LIKE 'forum%'
ORDER BY tablename;

-- Si aucune ligne n'est retournée, la suppression est réussie

-- =========================================
-- ✅ MIGRATION TERMINÉE
-- =========================================

COMMENT ON SCHEMA public IS 'Tables forum supprimées - 2026-01-16';
