# 🗑️ GUIDE : NETTOYAGE SUPABASE

**Date:** 2026-01-16
**Actions:**
1. Supprimer les tables forum de Supabase
2. Diagnostiquer et résoudre la disparition des chiens testrefuge

---

## 📋 TABLE DES MATIÈRES

1. [Suppression des tables forum](#1-suppression-des-tables-forum)
2. [Diagnostic des chiens disparus](#2-diagnostic-des-chiens-disparus)
3. [Résolution du problème des chiens](#3-résolution-du-problème-des-chiens)

---

## 1. SUPPRESSION DES TABLES FORUM

### Tables à supprimer

Les tables suivantes ne sont plus utilisées depuis la suppression de la fonctionnalité forum :

1. **`forums`** - Table principale des forums
2. **`forum_posts`** - Posts/discussions dans les forums
3. **`forum_post_images`** - Images attachées aux posts
4. **`forum_comments`** - Commentaires sur les posts
5. **`forum_likes`** - Likes sur les posts

### Méthode de suppression

#### Option A : Via le SQL Editor de Supabase (RECOMMANDÉ)

1. **Ouvrir Supabase Dashboard**
   - Aller sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Sélectionner votre projet Doogybook

2. **Ouvrir le SQL Editor**
   - Cliquer sur "SQL Editor" dans le menu latéral

3. **Exécuter le script de migration**
   - Copier le contenu du fichier [`supabase/migrations/20260116_drop_forum_tables.sql`](supabase/migrations/20260116_drop_forum_tables.sql)
   - Coller dans le SQL Editor
   - Cliquer sur "Run" (F5)

4. **Vérifier la suppression**
   - Le script affiche à la fin les tables restantes commençant par 'forum'
   - Si aucune ligne n'est retournée, la suppression est réussie ✅

#### Option B : Via CLI Supabase

```bash
# Se placer dans le dossier du projet
cd "c:\Users\HP\OneDrive\Desktop\PROJET\Doogybook\doogybook"

# Appliquer la migration
supabase db push
```

### Vérification manuelle

Après suppression, vérifiez dans l'onglet "Table Editor" que les tables suivantes n'existent plus :
- ❌ forums
- ❌ forum_posts
- ❌ forum_post_images
- ❌ forum_comments
- ❌ forum_likes

---

## 2. DIAGNOSTIC DES CHIENS DISPARUS

### Symptôme

Les chiens exemples du profil **testrefuge** n'apparaissent plus dans le ProDashboard.

### Causes possibles

1. **professional_account_id incorrect** : Les chiens ont un `professional_account_id` qui ne correspond pas au compte testrefuge
2. **Chiens supprimés** : Les chiens ont été supprimés de la base de données
3. **Compte testrefuge modifié** : L'UUID du compte testrefuge a changé
4. **professional_account_id NULL** : Les chiens n'ont plus de lien avec un compte pro

### Diagnostic via SQL

#### Étape 1 : Exécuter le script de diagnostic

1. **Ouvrir Supabase SQL Editor**
2. **Copier le fichier** [`supabase/DEBUG_MISSING_DOGS.sql`](supabase/DEBUG_MISSING_DOGS.sql)
3. **Exécuter** le script

#### Étape 2 : Analyser les résultats

Le script retourne 7 sections d'information :

**Section 1 : Compte testrefuge**
```sql
-- Cherche les comptes pro contenant "test"
-- ✅ Si trouvé : noter l'UUID du compte
-- ❌ Si non trouvé : le compte a été supprimé
```

**Section 2 : Nombre de chiens par compte**
```sql
-- Montre combien de chiens sont liés à testrefuge
-- ✅ Si nombre > 0 : les chiens existent
-- ❌ Si nombre = 0 : les chiens ont disparu
```

**Section 3 : Liste des 50 derniers chiens**
```sql
-- Voir tous les chiens récemment créés
-- Vérifier si vos chiens exemples y sont
```

**Section 4 : Chiens orphelins**
```sql
-- Chiens sans professional_account_id
-- ✅ Si vos chiens sont ici : problème identifié !
```

**Section 5 : Chiens avec ID invalide**
```sql
-- Chiens avec un professional_account_id inexistant
-- ✅ Si vos chiens sont ici : problème identifié !
```

**Section 6 : Statistiques globales**
```sql
-- Aperçu général de la base
```

**Section 7 : Liste tous les comptes pro**
```sql
-- Pour trouver l'UUID exact de testrefuge
```

---

## 3. RÉSOLUTION DU PROBLÈME DES CHIENS

### Cas 1 : Chiens avec professional_account_id incorrect

**Problème** : Les chiens existent mais sont liés au mauvais compte pro.

**Solution** : Réassigner les chiens au bon compte

```sql
-- 1. Trouver l'UUID du compte testrefuge
SELECT id, organization_name, email
FROM public.professional_accounts
WHERE organization_name ILIKE '%test%'
   OR email ILIKE '%test%';
-- Copier l'UUID

-- 2. Trouver les UUIDs des chiens à réassigner
SELECT id, name, breed, professional_account_id
FROM public.dogs
WHERE name IN ('nom_chien_1', 'nom_chien_2', 'nom_chien_3')
   OR breed IN ('race_chien_1', 'race_chien_2');

-- 3. Réassigner les chiens
UPDATE public.dogs
SET professional_account_id = 'UUID_DU_COMPTE_TESTREFUGE'
WHERE id IN (
    'uuid_chien_1',
    'uuid_chien_2',
    'uuid_chien_3'
);

-- 4. Vérifier
SELECT d.name, d.breed, pa.organization_name
FROM public.dogs d
LEFT JOIN public.professional_accounts pa ON d.professional_account_id = pa.id
WHERE d.id IN ('uuid_chien_1', 'uuid_chien_2', 'uuid_chien_3');
```

### Cas 2 : Chiens orphelins (professional_account_id NULL)

**Problème** : Les chiens existent mais n'ont plus de lien avec un compte pro.

**Solution** : Réassigner les chiens orphelins

```sql
-- 1. Trouver l'UUID du compte testrefuge
SELECT id FROM public.professional_accounts
WHERE organization_name ILIKE '%test%';
-- Copier l'UUID

-- 2. Lister les chiens orphelins
SELECT id, name, breed
FROM public.dogs
WHERE professional_account_id IS NULL
ORDER BY created_at DESC;

-- 3. Réassigner les chiens orphelins récents
UPDATE public.dogs
SET professional_account_id = 'UUID_DU_COMPTE_TESTREFUGE'
WHERE professional_account_id IS NULL
  AND created_at > NOW() - INTERVAL '30 days'; -- Derniers 30 jours

-- 4. Vérifier
SELECT COUNT(*) as chiens_testrefuge
FROM public.dogs
WHERE professional_account_id = 'UUID_DU_COMPTE_TESTREFUGE';
```

### Cas 3 : Chiens définitivement supprimés

**Problème** : Les chiens n'existent plus dans la base de données.

**Solution** : Recréer les chiens exemples via l'interface

1. **Se connecter en tant que testrefuge**
   - Email du compte testrefuge
   - Mot de passe du compte testrefuge

2. **Accéder au dashboard pro**
   - URL : `/pro/dashboard`

3. **Ajouter de nouveaux chiens**
   - Cliquer sur "Nouveau chien" ou "+  Ajouter un chien"
   - Remplir les informations
   - Uploader une photo
   - Sauvegarder

4. **Répéter** pour créer plusieurs exemples de chiens

### Cas 4 : Compte testrefuge supprimé

**Problème** : Le compte professionnel testrefuge n'existe plus.

**Solution** : Recréer le compte testrefuge

1. **Déconnexion** (si connecté)

2. **Inscription compte pro**
   - URL : `/pro/register`
   - Nom d'organisation : "Test Refuge" (ou similaire)
   - Email : votre email de test
   - Autres informations

3. **Puis créer les chiens** (voir Cas 3)

---

## 4. SCRIPTS RAPIDES

### Vérifier rapidement les chiens de testrefuge

```sql
-- Remplacer 'test@example.com' par l'email exact de testrefuge
SELECT
    d.id,
    d.name,
    d.breed,
    d.adoption_status,
    d.photo_url,
    pa.organization_name
FROM public.dogs d
INNER JOIN public.professional_accounts pa
    ON d.professional_account_id = pa.id
WHERE pa.email = 'test@example.com'
ORDER BY d.created_at DESC;
```

### Compter les chiens par refuge

```sql
SELECT
    pa.organization_name,
    pa.email,
    COUNT(d.id) as nombre_chiens
FROM public.professional_accounts pa
LEFT JOIN public.dogs d ON d.professional_account_id = pa.id
GROUP BY pa.id, pa.organization_name, pa.email
ORDER BY nombre_chiens DESC;
```

### Réassigner TOUS les chiens orphelins à testrefuge

```sql
-- ⚠️ ATTENTION : Vérifier l'UUID avant d'exécuter !

UPDATE public.dogs
SET professional_account_id = 'UUID_DU_COMPTE_TESTREFUGE'
WHERE professional_account_id IS NULL;
```

---

## 5. VÉRIFICATION FINALE

### Checklist de vérification

- [ ] **Tables forum supprimées** : Aucune table `forum*` dans "Table Editor"
- [ ] **Compte testrefuge existe** : Visible dans `professional_accounts`
- [ ] **Chiens testrefuge visibles** : Au moins 1 chien lié au compte testrefuge
- [ ] **ProDashboard fonctionne** : Les chiens s'affichent sur `/pro/dashboard`
- [ ] **Navigation fonctionne** : Clic sur un chien redirige vers `/pro/dogs/:id`

### Test manuel

1. **Se connecter avec le compte testrefuge**
2. **Accéder au dashboard** : `/pro/dashboard`
3. **Vérifier que les chiens s'affichent**
   - Les cartes de chiens apparaissent
   - Les photos se chargent
   - Le nom et la race s'affichent
4. **Cliquer sur un chien** : Redirection vers la page détail
5. **Vérifier les stats** : Nombre total de chiens correct

---

## 6. LOGS À VÉRIFIER

### Console navigateur

Ouvrir les DevTools (F12) et vérifier :

```javascript
// Logs attendus dans ProDashboard
✅ ProDashboard: Fetching pro account for user: [UUID] [email]
✅ ProDashboard: Account by user_id: { accountByUserId: {...} }
✅ ProDashboard: Compte pro trouvé: Test Refuge
```

Si vous voyez :
```javascript
❌ ProDashboard: Aucun compte pro trouvé, redirection vers register
```
→ Le compte testrefuge n'est pas trouvé, vérifier l'email/user_id

### Erreurs Supabase

Si erreur dans la console :
```
Error: foreign key constraint
```
→ Le `professional_account_id` dans `dogs` ne correspond à aucun compte pro

---

## 📝 NOTES IMPORTANTES

### Sauvegardes

Avant toute modification SQL destructive :
```sql
-- Sauvegarder les données
CREATE TABLE backup_dogs AS SELECT * FROM public.dogs;
CREATE TABLE backup_professional_accounts AS SELECT * FROM public.professional_accounts;
```

### Rollback si erreur

Si vous faites une erreur :
```sql
-- Restaurer depuis la sauvegarde
TRUNCATE public.dogs;
INSERT INTO public.dogs SELECT * FROM backup_dogs;
```

---

## ✅ RÉSUMÉ DES ACTIONS

1. **Supprimer les tables forum** : Exécuter [`20260116_drop_forum_tables.sql`](supabase/migrations/20260116_drop_forum_tables.sql)
2. **Diagnostiquer les chiens** : Exécuter [`DEBUG_MISSING_DOGS.sql`](supabase/DEBUG_MISSING_DOGS.sql)
3. **Résoudre selon le cas** : Appliquer la solution correspondante (Cas 1, 2, 3 ou 4)
4. **Vérifier** : Tester le ProDashboard avec le compte testrefuge

---

**Besoin d'aide ?** Référez-vous aux logs de la console navigateur et aux résultats des requêtes SQL de diagnostic.
