# ⚡ Déploiement Rapide - 5 Minutes

## 🎯 Déploiement en 5 Étapes Simples

### 📍 Étape 1 : Ouvrir Supabase Dashboard
1. Allez sur : https://supabase.com/dashboard
2. Connectez-vous
3. Sélectionnez votre projet : **malcggmelsviujxawpwr**

---

### 📍 Étape 2 : Déployer Migration 1 (Auth)

1. Cliquez sur **SQL Editor** (menu gauche)
2. Cliquez sur **New query**
3. Ouvrez le fichier Windows :
   ```
   C:\Users\HP\OneDrive\Desktop\PROJET\Doogybook\doogybook\supabase\migrations\20251201134356_doogybook_auth_module.sql
   ```
4. **Sélectionnez tout** (Ctrl+A) et **copiez** (Ctrl+C)
5. **Collez** dans Supabase SQL Editor
6. Cliquez sur **Run** (en bas à droite)
7. Attendez "Success" ✅

---

### 📍 Étape 3 : Déployer Migration 2 (Tables)

1. Cliquez sur **New query** (nouvelle requête)
2. Ouvrez le fichier Windows :
   ```
   C:\Users\HP\OneDrive\Desktop\PROJET\Doogybook\doogybook\supabase\migrations\20260116000000_complete_doogybook_schema.sql
   ```
3. **Sélectionnez tout** (Ctrl+A) et **copiez** (Ctrl+C)
4. **Collez** dans Supabase SQL Editor
5. Cliquez sur **Run**
6. Attendez "Success" ✅ (10-20 secondes)

---

### 📍 Étape 4 : Créer les Buckets Storage

1. Cliquez sur **Storage** (menu gauche)
2. Créez 4 buckets :

#### Bucket 1
- **New bucket** → Name: `dog-photos`
- Public: ✅ | Limit: 5 MB
- **Create**

#### Bucket 2
- **New bucket** → Name: `social-feed-media`
- Public: ✅ | Limit: 10 MB
- **Create**

#### Bucket 3
- **New bucket** → Name: `community-images`
- Public: ✅ | Limit: 5 MB
- **Create**

#### Bucket 4
- **New bucket** → Name: `user-avatars`
- Public: ✅ | Limit: 2 MB
- **Create**

---

### 📍 Étape 5 : Vérifier

1. Cliquez sur **Table Editor** (menu gauche)
2. Vous devez voir **18 tables** ✅

**Si vous voyez 18 tables → C'EST BON ! 🎉**

---

## ✅ C'est Tout !

Votre base de données Doogybook est maintenant déployée et prête à l'emploi.

### Prochaines Étapes (Optionnel)

**Si vous voulez tester :**
1. Allez dans **Authentication** → **Users** → **Add user**
2. Créez un utilisateur test
3. Vérifiez dans **Table Editor** → **user_profiles** qu'un profil a été auto-créé ✅

---

## 📁 Fichiers de Migration

Les fichiers à copier/coller sont ici :
```
📁 C:\Users\HP\OneDrive\Desktop\PROJET\Doogybook\doogybook\supabase\migrations\
├── 20251201134356_doogybook_auth_module.sql        ← Migration 1
└── 20260116000000_complete_doogybook_schema.sql    ← Migration 2
```

---

## 🆘 Problème ?

### "relation already exists"
→ Normal si vous avez déjà tenté le déploiement. Ignorez et continuez.

### "permission denied"
→ Vérifiez que vous êtes bien propriétaire du projet Supabase.

### Je ne vois pas 18 tables
→ Vérifiez que les 2 migrations ont bien été exécutées avec "Success".

---

**Temps estimé : 5 minutes ⏱️**
