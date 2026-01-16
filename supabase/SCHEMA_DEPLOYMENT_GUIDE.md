# Guide de Déploiement du Schéma Supabase - Doogybook

## 📋 Vue d'ensemble

Ce guide vous aide à déployer le schéma complet de la base de données Doogybook sur votre instance Supabase.

## 🗂️ Fichiers de Migration

### 1. Migration d'Authentification (Déjà créée)
**Fichier:** `20251201134356_doogybook_auth_module.sql`
- ✅ Table `user_profiles`
- ✅ ENUM `user_role`
- ✅ Triggers automatiques pour la création de profils
- ✅ Politiques RLS de base

### 2. Migration Complète du Schéma (NOUVEAU)
**Fichier:** `20260116000000_complete_doogybook_schema.sql`
- ✅ **18 tables** au total
- ✅ **10 types ENUM** pour les statuts et catégories
- ✅ **Politiques RLS complètes** pour toutes les tables
- ✅ **Triggers** pour les timestamps automatiques
- ✅ **Indexes** pour optimiser les performances

## 📊 Tables Créées

### Tables Principales
1. **user_profiles** (étendue) - Profils utilisateurs avec abonnements
2. **professional_accounts** - Comptes professionnels (refuges, FA)
3. **dogs** - Profils des chiens
4. **contacts** - CRM pour les professionnels

### Tables Santé & Médical
5. **vaccinations** - Historique vaccinal
6. **treatments** - Traitements antiparasitaires
7. **weight_records** - Suivi du poids
8. **health_notes** - Notes de santé
9. **dog_photos** - Galerie photos

### Tables Adoption & Transferts
10. **adoption_applications** - Demandes d'adoption
11. **pending_transfers** - Transferts de propriété

### Tables Communauté
12. **forums** - Catégories de forums
13. **forum_posts** - Publications sociales
14. **forum_post_images** - Images des posts
15. **forum_comments** - Commentaires
16. **forum_likes** - J'aime
17. **user_follows** - Abonnements utilisateurs

### Tables Système
18. **notifications** - Notifications utilisateurs

## 🚀 Procédure de Déploiement

### Méthode 1 : Via l'Interface Supabase (Recommandée)

1. **Connectez-vous à votre projet Supabase**
   - URL: https://supabase.com/dashboard
   - Projet: `malcggmelsviujxawpwr`

2. **Accédez au SQL Editor**
   - Menu latéral → SQL Editor
   - Cliquez sur "New query"

3. **Exécutez la première migration (si pas déjà fait)**
   ```sql
   -- Copiez le contenu de 20251201134356_doogybook_auth_module.sql
   -- Collez et exécutez (bouton Run ou Ctrl+Enter)
   ```

4. **Exécutez la migration complète**
   ```sql
   -- Copiez le contenu de 20260116000000_complete_doogybook_schema.sql
   -- Collez et exécutez (bouton Run ou Ctrl+Enter)
   ```

5. **Vérifiez la création des tables**
   - Menu latéral → Table Editor
   - Vous devriez voir toutes les 18 tables

### Méthode 2 : Via Supabase CLI (Avancée)

```bash
# 1. Installer Supabase CLI si pas déjà fait
npm install -g supabase

# 2. Lier votre projet local
supabase login
supabase link --project-ref malcggmelsviujxawpwr

# 3. Appliquer les migrations
supabase db push

# 4. Vérifier le statut
supabase db status
```

## 🔐 Politiques RLS (Row Level Security)

Toutes les tables sont protégées par RLS avec les règles suivantes :

### Principes de Sécurité
- ✅ Les utilisateurs **peuvent voir et modifier uniquement leurs propres données**
- ✅ Les chiens en adoption sont **visibles publiquement**
- ✅ Les posts du forum sont **visibles par tous**
- ✅ Les professionnels peuvent **gérer leurs chiens et contacts**
- ✅ Les notifications sont **privées à chaque utilisateur**

### Exemples de Politiques
```sql
-- Utilisateurs voient leurs propres chiens
CREATE POLICY "users_view_own_dogs"
ON public.dogs FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR ...);

-- Public voit les chiens en adoption
CREATE POLICY "public_view_adoption_dogs"
ON public.dogs FOR SELECT
TO public
USING (is_for_adoption = true AND is_active = true);
```

## 📦 Buckets de Stockage à Créer

Après le déploiement du schéma, créez ces buckets dans Supabase Storage :

```sql
-- Dans Supabase Dashboard → Storage → New Bucket

1. dog-photos (Public)
   - Pour les photos de profil des chiens
   - Taille max: 5MB par fichier
   - Types: image/jpeg, image/png, image/webp

2. social-feed-media (Public)
   - Pour les posts du feed social
   - Taille max: 10MB par fichier
   - Types: image/*, video/mp4, video/webm

3. community-images (Public)
   - Pour les images des forums
   - Taille max: 5MB par fichier
   - Types: image/jpeg, image/png, image/webp

4. user-avatars (Public)
   - Pour les avatars utilisateurs
   - Taille max: 2MB par fichier
   - Types: image/jpeg, image/png, image/webp
```

### Configuration des Buckets

Pour chaque bucket, configurez les politiques de stockage :

```sql
-- Exemple pour dog-photos
-- Storage → dog-photos → Policies

-- Lecture publique
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'dog-photos');

-- Upload pour utilisateurs authentifiés
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'dog-photos');

-- Les utilisateurs peuvent supprimer leurs propres uploads
CREATE POLICY "Users can delete own uploads"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'dog-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## ✅ Vérification Post-Déploiement

### 1. Vérifier les Tables
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Devrait retourner 18 tables
```

### 2. Vérifier les Politiques RLS
```sql
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;

-- Devrait retourner ~30+ politiques
```

### 3. Vérifier les Types ENUM
```sql
SELECT t.typname as enum_name,
       string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) as values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
GROUP BY enum_name
ORDER BY enum_name;

-- Devrait retourner 11 types ENUM
```

### 4. Tester une Requête Simple
```sql
-- Test de lecture sur user_profiles
SELECT id, email, role, subscription_tier
FROM public.user_profiles
LIMIT 5;
```

## 🧪 Données de Test

### Créer un Utilisateur Demo (Optionnel)

L'utilisateur demo est déjà créé dans la première migration :
- **Email:** marie.dupont@Doogybook.fr
- **Mot de passe:** Doogybook2025!
- **Rôle:** owner

### Ajouter des Forums par Défaut

```sql
INSERT INTO public.forums (name, slug, description) VALUES
('Malinois', 'malinois', 'Discussions sur les Malinois Belges'),
('Golden Retriever', 'golden-retriever', 'Tout sur les Golden Retrievers'),
('Shih-Tzu', 'shih-tzu', 'Communauté Shih-Tzu'),
('Santé', 'sante', 'Questions de santé canine'),
('Alimentation', 'alimentation', 'Nutrition et recettes pour chiens'),
('Éducation', 'education', 'Dressage et comportement');
```

## 🔧 Edge Functions

### Fonction Email Déjà Configurée

La fonction `send-transfer-email` est déjà créée dans :
- `supabase/migrations/functions/send-transfer-email/index.ts`

**Pour la déployer :**

```bash
# Via Supabase CLI
supabase functions deploy send-transfer-email

# Définir la variable d'environnement RESEND_API_KEY
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

## 📱 Configuration Application

### Mise à Jour du Client Supabase

Votre fichier `src/lib/supabase.js` est déjà configuré :
```javascript
const supabaseUrl = "https://malcggmelsviujxawpwr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

✅ Aucune modification nécessaire.

## 🎯 Prochaines Étapes

1. ✅ Déployer les migrations SQL
2. ✅ Créer les buckets de stockage
3. ✅ Déployer la fonction Edge email
4. ✅ Tester l'inscription d'un utilisateur
5. ✅ Vérifier la création automatique du profil
6. ✅ Tester l'ajout d'un chien
7. ✅ Tester le forum/posts

## 🐛 Dépannage

### Erreur : "relation already exists"
- Certaines tables existent déjà
- Solution : Commentez les CREATE TABLE pour les tables existantes

### Erreur : "permission denied"
- Vérifiez que vous êtes connecté comme propriétaire du projet
- Solution : Utilisez l'interface Supabase Dashboard

### Erreur : "type already exists"
- Les types ENUM existent déjà
- Solution : Utilisez `CREATE TYPE IF NOT EXISTS` ou commentez

### RLS bloque mes requêtes
- Vérifiez que vous êtes authentifié : `auth.uid()` doit retourner votre UUID
- Solution : Testez avec le Service Role Key temporairement (PAS en production)

## 📞 Support

- **Documentation Supabase:** https://supabase.com/docs
- **Dépôt GitHub:** https://github.com/anthropics/claude-code/issues
- **Supabase Discord:** https://discord.supabase.com

---

**Date de création:** 2026-01-16
**Version:** 1.0
**Dernière mise à jour:** 2026-01-16
