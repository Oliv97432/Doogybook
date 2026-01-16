# 🗄️ Supabase - Doogybook

## 📁 Structure du Dossier

```
supabase/
├── migrations/
│   ├── 20251201134356_doogybook_auth_module.sql       (Auth + user_profiles)
│   ├── 20260116000000_complete_doogybook_schema.sql   (18 tables complètes)
│   └── functions/
│       └── send-transfer-email/
│           └── index.ts                                (Edge Function email)
├── config.toml                                         (Configuration locale)
├── DATABASE_SCHEMA.md                                  (Documentation schéma)
├── SCHEMA_DEPLOYMENT_GUIDE.md                          (Guide déploiement détaillé)
└── README.md                                           (Ce fichier)
```

---

## 🚀 Déploiement Rapide

### Option 1 : Interface Supabase (Recommandée - 5 min)

👉 **Suivez le guide :** [`../QUICK_DEPLOY_STEPS.md`](../QUICK_DEPLOY_STEPS.md)

**Résumé ultra-rapide :**
1. Dashboard → SQL Editor → New query
2. Copier/Coller `migrations/20251201134356_doogybook_auth_module.sql`
3. Run ✅
4. New query → Copier/Coller `migrations/20260116000000_complete_doogybook_schema.sql`
5. Run ✅
6. Storage → Créer 4 buckets (dog-photos, social-feed-media, community-images, user-avatars)
7. Terminé ! 🎉

### Option 2 : Supabase CLI

```bash
# Se connecter
supabase login

# Lier le projet
supabase link --project-ref malcggmelsviujxawpwr

# Pousser les migrations
supabase db push

# Déployer la fonction Edge
supabase functions deploy send-transfer-email
supabase secrets set RESEND_API_KEY=votre_clé
```

---

## 📊 Base de Données Créée

### Tables (18)
✅ **Utilisateurs**
- `user_profiles` - Profils utilisateurs
- `professional_accounts` - Comptes professionnels

✅ **Chiens**
- `dogs` - Profils des chiens

✅ **Santé**
- `vaccinations` - Vaccins
- `treatments` - Traitements
- `weight_records` - Poids
- `health_notes` - Notes santé
- `dog_photos` - Photos

✅ **Adoption**
- `adoption_applications` - Demandes
- `pending_transfers` - Transferts

✅ **Communauté**
- `forums` - Forums
- `forum_posts` - Posts
- `forum_post_images` - Images
- `forum_comments` - Commentaires
- `forum_likes` - Likes
- `user_follows` - Abonnements

✅ **Système**
- `notifications` - Notifications
- `contacts` - CRM

### Politiques RLS
✅ 30+ politiques de sécurité Row Level Security

### Storage Buckets (à créer)
- `dog-photos` (5 MB)
- `social-feed-media` (10 MB)
- `community-images` (5 MB)
- `user-avatars` (2 MB)

---

## 📚 Documentation

| Fichier | Description | Taille |
|---------|-------------|--------|
| [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) | Schéma complet détaillé | 14 KB |
| [SCHEMA_DEPLOYMENT_GUIDE.md](SCHEMA_DEPLOYMENT_GUIDE.md) | Guide déploiement | 8.7 KB |
| [../QUICK_DEPLOY_STEPS.md](../QUICK_DEPLOY_STEPS.md) | Déploiement rapide | 3 KB |
| [../DEPLOY.md](../DEPLOY.md) | Guide complet | 7.6 KB |
| [../SUPABASE_CLEANUP_SUMMARY.md](../SUPABASE_CLEANUP_SUMMARY.md) | Récap nettoyage | 8.8 KB |

---

## 🔑 Informations Projet

**Projet Supabase :**
- URL: `https://malcggmelsviujxawpwr.supabase.co`
- Project ID: `malcggmelsviujxawpwr`
- Region: (vérifier dans Dashboard)

**Configuration App :**
- Fichier: `src/lib/supabase.js`
- ✅ Déjà configuré correctement

---

## ✅ Checklist Déploiement

- [ ] Migration 1 exécutée (auth)
- [ ] Migration 2 exécutée (tables)
- [ ] 18 tables visibles dans Table Editor
- [ ] 4 buckets Storage créés
- [ ] Edge Function déployée (optionnel)
- [ ] Test : Créer un utilisateur
- [ ] Test : Profil auto-créé
- [ ] Test : Ajouter un chien

---

## 🧪 Tests Rapides

### Test SQL 1 : Compter les tables
```sql
SELECT COUNT(*) FROM information_schema.tables
WHERE table_schema = 'public';
-- Résultat attendu : 18
```

### Test SQL 2 : Lister les tables
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Test SQL 3 : Vérifier les politiques
```sql
SELECT COUNT(*) FROM pg_policies
WHERE schemaname = 'public';
-- Résultat attendu : ~30
```

---

## 🐛 Problèmes Fréquents

### "relation already exists"
✅ Normal si relancement → Ignorez

### "type already exists"
✅ Normal si relancement → Ignorez

### "permission denied"
❌ Vérifiez vos permissions Supabase

### Pas de profil créé automatiquement
❌ Vérifiez que le trigger `on_auth_user_created` existe

---

## 📞 Ressources

- **Dashboard Supabase:** https://supabase.com/dashboard
- **Docs Supabase:** https://supabase.com/docs
- **Discord Supabase:** https://discord.supabase.com

---

**Date de création:** 2026-01-16
**Version du schéma:** 1.0
**Total tables:** 18
**Total migrations:** 2
**Prêt pour production:** ✅
