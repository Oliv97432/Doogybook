# 🚀 Guide de Déploiement Supabase - Doogybook

## Méthode Recommandée : Via l'Interface Supabase Dashboard

### Étape 1 : Connexion à Supabase

1. Ouvrez votre navigateur
2. Allez sur : https://supabase.com/dashboard
3. Connectez-vous à votre compte
4. Sélectionnez votre projet : **malcggmelsviujxawpwr**

### Étape 2 : Accéder au SQL Editor

1. Dans le menu latéral gauche, cliquez sur **SQL Editor**
2. Cliquez sur **New query** (en haut à droite)

### Étape 3 : Déployer la Migration 1 - Authentification

1. Ouvrez le fichier : `supabase/migrations/20251201134356_doogybook_auth_module.sql`
2. **Copiez tout le contenu** (Ctrl+A puis Ctrl+C)
3. **Collez dans le SQL Editor** de Supabase
4. Cliquez sur **Run** (ou appuyez sur Ctrl+Enter)
5. Attendez le message de succès

**Résultat attendu :**
```
✅ CREATE TYPE public.user_role
✅ CREATE TABLE public.user_profiles
✅ CREATE INDEX (3 index)
✅ CREATE FUNCTION handle_new_user()
✅ CREATE FUNCTION handle_updated_at()
✅ CREATE POLICY (4 politiques)
✅ CREATE TRIGGER (2 triggers)
```

### Étape 4 : Déployer la Migration 2 - Schéma Complet

1. Ouvrez le fichier : `supabase/migrations/20260116000000_complete_doogybook_schema.sql`
2. **Copiez tout le contenu** (Ctrl+A puis Ctrl+C)
3. Dans le SQL Editor, cliquez à nouveau sur **New query**
4. **Collez le contenu**
5. Cliquez sur **Run** (ou Ctrl+Enter)
6. Attendez le message de succès (cela peut prendre 10-20 secondes)

**Résultat attendu :**
```
✅ CREATE TYPE (10 types ENUM)
✅ ALTER TABLE user_profiles (3 colonnes ajoutées)
✅ CREATE TABLE (17 nouvelles tables)
✅ CREATE INDEX (50+ index)
✅ CREATE POLICY (30+ politiques RLS)
✅ CREATE TRIGGER (5 triggers)
```

### Étape 5 : Vérifier le Déploiement

1. Dans le menu latéral, cliquez sur **Table Editor**
2. Vous devriez voir **18 tables** :
   - user_profiles ✅
   - professional_accounts ✅
   - dogs ✅
   - vaccinations ✅
   - treatments ✅
   - weight_records ✅
   - health_notes ✅
   - dog_photos ✅
   - adoption_applications ✅
   - pending_transfers ✅
   - forums ✅
   - forum_posts ✅
   - forum_post_images ✅
   - forum_comments ✅
   - forum_likes ✅
   - user_follows ✅
   - notifications ✅
   - contacts ✅

### Étape 6 : Créer les Buckets de Stockage

1. Dans le menu latéral, cliquez sur **Storage**
2. Cliquez sur **New bucket**
3. Créez ces 4 buckets (un par un) :

#### Bucket 1 : dog-photos
- **Name:** dog-photos
- **Public bucket:** ✅ Coché
- **File size limit:** 5 MB
- **Allowed MIME types:** image/jpeg, image/png, image/webp
- Cliquez sur **Create bucket**

#### Bucket 2 : social-feed-media
- **Name:** social-feed-media
- **Public bucket:** ✅ Coché
- **File size limit:** 10 MB
- **Allowed MIME types:** image/*, video/mp4, video/webm
- Cliquez sur **Create bucket**

#### Bucket 3 : community-images
- **Name:** community-images
- **Public bucket:** ✅ Coché
- **File size limit:** 5 MB
- **Allowed MIME types:** image/jpeg, image/png, image/webp
- Cliquez sur **Create bucket**

#### Bucket 4 : user-avatars
- **Name:** user-avatars
- **Public bucket:** ✅ Coché
- **File size limit:** 2 MB
- **Allowed MIME types:** image/jpeg, image/png, image/webp
- Cliquez sur **Create bucket**

### Étape 7 : Déployer la Fonction Edge (Optionnel)

Si vous souhaitez déployer la fonction d'envoi d'emails :

#### Via l'interface (plus simple) :

1. Dans le menu latéral, cliquez sur **Edge Functions**
2. Cliquez sur **Deploy a new function**
3. **Function name:** send-transfer-email
4. Copiez le contenu de `supabase/migrations/functions/send-transfer-email/index.ts`
5. Collez dans l'éditeur
6. Cliquez sur **Deploy function**

#### Configuration de la clé API Resend :

1. Toujours dans **Edge Functions**
2. Cliquez sur votre fonction **send-transfer-email**
3. Allez dans l'onglet **Secrets**
4. Ajoutez un nouveau secret :
   - **Name:** RESEND_API_KEY
   - **Value:** [Votre clé API Resend]
5. Cliquez sur **Save**

---

## Méthode Alternative : Via Supabase CLI

### Prérequis
```bash
# Vérifier que Supabase CLI est installé
supabase --version

# Si pas installé :
npm install -g supabase
```

### Étape 1 : Se Connecter à Supabase
```bash
cd c:\Users\HP\OneDrive\Desktop\PROJET\Doogybook\doogybook
supabase login
```

### Étape 2 : Lier le Projet
```bash
supabase link --project-ref malcggmelsviujxawpwr
```

Entrez votre **mot de passe de base de données** quand demandé.

### Étape 3 : Pousser les Migrations
```bash
supabase db push
```

Cette commande va :
- Détecter les fichiers dans `supabase/migrations/`
- Les exécuter dans l'ordre chronologique
- Créer toutes les tables et politiques RLS

### Étape 4 : Déployer la Fonction Edge
```bash
supabase functions deploy send-transfer-email

# Configurer le secret
supabase secrets set RESEND_API_KEY=votre_clé_api_resend
```

### Étape 5 : Vérifier le Déploiement
```bash
# Voir le statut
supabase db status

# Lister les tables
supabase db diff --schema public
```

---

## 🧪 Tests Post-Déploiement

### Test 1 : Vérifier les Tables

Dans le **SQL Editor** de Supabase, exécutez :

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Résultat attendu :** 18 tables

### Test 2 : Vérifier les Politiques RLS

```sql
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Résultat attendu :** ~30 politiques

### Test 3 : Créer un Utilisateur de Test

1. Allez dans **Authentication** → **Users**
2. Cliquez sur **Add user**
3. Créez un utilisateur :
   - Email: test@doogybook.fr
   - Password: Test123!
   - Auto Confirm User: ✅

4. Vérifiez dans **Table Editor** → **user_profiles**
   - Un profil doit avoir été créé automatiquement ✅

### Test 4 : Tester l'Ajout d'un Chien

Dans le **SQL Editor**, exécutez (remplacez USER_ID par l'ID du test user) :

```sql
INSERT INTO public.dogs (
    user_id,
    name,
    breed,
    gender,
    birth_date,
    weight
) VALUES (
    'USER_ID_ICI',
    'Rex',
    'Golden Retriever',
    'male',
    '2020-01-15',
    25.5
);
```

### Test 5 : Vérifier les Buckets

1. Allez dans **Storage**
2. Vérifiez que les 4 buckets sont créés
3. Testez l'upload d'une image dans **dog-photos**

---

## ✅ Checklist Finale

- [ ] Migration 1 déployée (authentification)
- [ ] Migration 2 déployée (schéma complet)
- [ ] 18 tables visibles dans Table Editor
- [ ] 4 buckets Storage créés
- [ ] Fonction Edge déployée (optionnel)
- [ ] Secret RESEND_API_KEY configuré (optionnel)
- [ ] Test utilisateur créé avec succès
- [ ] Profil auto-créé visible
- [ ] Test d'ajout de chien réussi

---

## 🐛 Dépannage

### Erreur : "relation already exists"
**Solution :** Certaines tables existent peut-être déjà. Vérifiez dans Table Editor et supprimez-les si nécessaire avant de réexécuter.

### Erreur : "type already exists"
**Solution :** Les types ENUM existent déjà. C'est normal si vous avez déjà exécuté une partie de la migration.

### Erreur : "permission denied"
**Solution :** Assurez-vous d'être connecté comme propriétaire du projet Supabase.

### Les politiques RLS bloquent mes requêtes
**Solution :** Vérifiez que vous êtes bien authentifié. Pour tester sans RLS temporairement, utilisez le Service Role Key (⚠️ Jamais en production).

---

## 📞 Support

- **Guide complet :** [SCHEMA_DEPLOYMENT_GUIDE.md](supabase/SCHEMA_DEPLOYMENT_GUIDE.md)
- **Schéma détaillé :** [DATABASE_SCHEMA.md](supabase/DATABASE_SCHEMA.md)
- **Supabase Docs :** https://supabase.com/docs

---

**Dernière mise à jour :** 2026-01-16
**Estimé temps déploiement :** 15-20 minutes
