# Schéma de Base de Données Doogybook

## 📊 Vue d'Ensemble

Base de données PostgreSQL complète pour l'application Doogybook - Carnet de santé numérique pour chiens avec fonctionnalités sociales et adoption.

---

## 🗃️ Tables (18 au total)

### 1️⃣ **UTILISATEURS & AUTHENTIFICATION**

#### `user_profiles`
Profils utilisateurs étendus de l'authentification Supabase

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID utilisateur (FK → auth.users) |
| `email` | TEXT | Email (unique) |
| `full_name` | TEXT | Nom complet |
| `phone` | TEXT | Téléphone |
| `avatar_url` | TEXT | URL avatar |
| `bio` | TEXT | Biographie |
| `role` | ENUM | owner, veterinarian, breeder, trainer |
| `location` | TEXT | Localisation |
| `is_active` | BOOLEAN | Compte actif |
| `email_notifications` | BOOLEAN | Préférence emails |
| `subscription_tier` | ENUM | free, premium, professional |
| `subscription_end_date` | TIMESTAMPTZ | Fin abonnement premium |
| `is_admin` | BOOLEAN | Administrateur |
| `created_at` | TIMESTAMPTZ | Date création |
| `updated_at` | TIMESTAMPTZ | Dernière MAJ |

**Relations:**
- 1 user → N dogs (ownership)
- 1 user → 1 professional_account
- 1 user → N forum_posts
- 1 user → N notifications

---

### 2️⃣ **COMPTES PROFESSIONNELS**

#### `professional_accounts`
Comptes pour refuges, réseaux de FA, associations

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID compte pro |
| `user_id` | UUID (FK) | Propriétaire du compte |
| `organization_name` | TEXT | Nom organisation |
| `organization_type` | ENUM | refuge, foster_network, association |
| `phone` | TEXT | Téléphone pro |
| `email` | TEXT | Email pro |
| `city` | TEXT | Ville |
| `postal_code` | TEXT | Code postal |
| `website` | TEXT | Site web |
| `description` | TEXT | Description |
| `logo_url` | TEXT | Logo |
| `cover_photo_url` | TEXT | Photo couverture |
| `is_active` | BOOLEAN | Compte actif |
| `is_verified` | BOOLEAN | Vérifié par admin |
| `created_at` | TIMESTAMPTZ | Date création |
| `updated_at` | TIMESTAMPTZ | Dernière MAJ |

**Relations:**
- 1 professional_account → N dogs (gestion adoptions)
- 1 professional_account → N contacts (CRM)

---

### 3️⃣ **CHIENS**

#### `dogs`
Profils des chiens (propriété personnelle ou adoption)

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID chien |
| `user_id` | UUID (FK) | Propriétaire (si chien perso) |
| `professional_account_id` | UUID (FK) | Compte pro (si adoption) |
| `name` | TEXT | Nom du chien |
| `breed` | TEXT | Race |
| `gender` | ENUM | male, female |
| `birth_date` | DATE | Date de naissance |
| `weight` | NUMERIC(5,2) | Poids actuel (kg) |
| `size` | ENUM | small, medium, large |
| `is_sterilized` | BOOLEAN | Stérilisé |
| `photo_url` | TEXT | Photo profil |
| `cover_photo_url` | TEXT | Photo couverture |
| `microchip_number` | TEXT | Numéro puce |
| `notes` | TEXT | Notes diverses |
| `is_active` | BOOLEAN | Profil actif |
| `adoption_status` | ENUM | available, adopted, pending |
| `is_for_adoption` | BOOLEAN | Disponible adoption |
| `adoption_story` | TEXT | Histoire adoption |
| `adoption_requirements` | TEXT | Conditions adoption |
| `adoption_fee` | NUMERIC(10,2) | Frais adoption (€) |
| `is_urgent` | BOOLEAN | Adoption urgente |
| `created_at` | TIMESTAMPTZ | Date création |
| `updated_at` | TIMESTAMPTZ | Dernière MAJ |

**Contrainte:** Un chien appartient SOIT à un user SOIT à un professional_account (exclusif)

**Relations:**
- 1 dog → N vaccinations
- 1 dog → N treatments
- 1 dog → N weight_records
- 1 dog → N health_notes
- 1 dog → N dog_photos
- 1 dog → N adoption_applications
- 1 dog → N pending_transfers

---

### 4️⃣ **SANTÉ & MÉDICAL**

#### `vaccinations`
Historique des vaccinations

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID vaccination |
| `dog_id` | UUID (FK) | Chien concerné |
| `vaccine_name` | TEXT | Nom vaccin |
| `vaccination_date` | DATE | Date injection |
| `next_due_date` | DATE | Prochain rappel |
| `veterinarian` | TEXT | Vétérinaire |
| `notes` | TEXT | Notes |
| `created_at` | TIMESTAMPTZ | Date création |

#### `treatments`
Traitements antiparasitaires et médicaments

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID traitement |
| `dog_id` | UUID (FK) | Chien concerné |
| `product_name` | TEXT | Nom produit |
| `treatment_type` | ENUM | worm, flea, antiparasitaire |
| `treatment_date` | DATE | Date traitement |
| `next_due_date` | DATE | Prochain traitement |
| `notes` | TEXT | Notes |
| `created_at` | TIMESTAMPTZ | Date création |

#### `weight_records`
Suivi du poids dans le temps

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID mesure |
| `dog_id` | UUID (FK) | Chien concerné |
| `weight` | NUMERIC(5,2) | Poids (kg) |
| `measurement_date` | DATE | Date mesure |
| `created_at` | TIMESTAMPTZ | Date création |

#### `health_notes`
Notes de santé diverses

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID note |
| `dog_id` | UUID (FK) | Chien concerné |
| `title` | TEXT | Titre note |
| `description` | TEXT | Contenu |
| `tags` | TEXT[] | Tags (allergies, etc.) |
| `note_date` | TIMESTAMPTZ | Date note |
| `created_at` | TIMESTAMPTZ | Date création |

#### `dog_photos`
Galerie photos du chien

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID photo |
| `dog_id` | UUID (FK) | Chien concerné |
| `photo_url` | TEXT | URL photo |
| `created_at` | TIMESTAMPTZ | Date upload |

---

### 5️⃣ **ADOPTION & TRANSFERTS**

#### `adoption_applications`
Demandes d'adoption

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID demande |
| `dog_id` | UUID (FK) | Chien à adopter |
| `user_id` | UUID (FK) | Demandeur |
| `status` | ENUM | pending, approved, rejected |
| `application_date` | TIMESTAMPTZ | Date demande |
| `created_at` | TIMESTAMPTZ | Date création |
| `updated_at` | TIMESTAMPTZ | Dernière MAJ |

#### `pending_transfers`
Transferts de propriété entre utilisateurs

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID transfert |
| `dog_id` | UUID (FK) | Chien transféré |
| `from_user_id` | UUID (FK) | Ancien propriétaire |
| `to_email` | TEXT | Email destinataire |
| `status` | ENUM | pending, completed, expired |
| `transfer_token` | TEXT (unique) | Token validation |
| `created_at` | TIMESTAMPTZ | Date création |
| `expires_at` | TIMESTAMPTZ | Expiration lien |

---

### 6️⃣ **COMMUNAUTÉ & FORUMS**

#### `forums`
Catégories de forums thématiques

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID forum |
| `name` | TEXT | Nom (ex: "Malinois") |
| `slug` | TEXT (unique) | URL slug |
| `description` | TEXT | Description |
| `created_at` | TIMESTAMPTZ | Date création |

#### `forum_posts`
Publications sociales et discussions

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID post |
| `user_id` | UUID (FK) | Auteur |
| `forum_id` | UUID (FK) | Forum (null = feed social) |
| `title` | TEXT | Titre |
| `content` | TEXT | Contenu |
| `tags` | TEXT[] | Tags |
| `video_url` | TEXT | URL vidéo |
| `is_short` | BOOLEAN | Vidéo courte |
| `video_duration` | INTEGER | Durée (secondes) |
| `is_hidden` | BOOLEAN | Caché/supprimé |
| `created_at` | TIMESTAMPTZ | Date création |
| `updated_at` | TIMESTAMPTZ | Dernière MAJ |

#### `forum_post_images`
Images des posts

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID image |
| `post_id` | UUID (FK) | Post parent |
| `image_url` | TEXT | URL image |
| `display_order` | INTEGER | Ordre affichage |
| `created_at` | TIMESTAMPTZ | Date upload |

#### `forum_comments`
Commentaires sur les posts

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID commentaire |
| `post_id` | UUID (FK) | Post commenté |
| `user_id` | UUID (FK) | Auteur |
| `content` | TEXT | Contenu |
| `created_at` | TIMESTAMPTZ | Date création |

#### `forum_likes`
J'aime sur les posts

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID like |
| `post_id` | UUID (FK) | Post liké |
| `user_id` | UUID (FK) | Utilisateur |
| `created_at` | TIMESTAMPTZ | Date like |

**Contrainte:** Un user ne peut liker qu'une fois chaque post (UNIQUE post_id, user_id)

#### `user_follows`
Abonnements entre utilisateurs

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID follow |
| `follower_id` | UUID (FK) | Abonné |
| `following_id` | UUID (FK) | Suivi |
| `created_at` | TIMESTAMPTZ | Date abonnement |

**Contraintes:**
- UNIQUE (follower_id, following_id)
- CHECK (follower_id ≠ following_id) - Pas d'auto-follow

---

### 7️⃣ **SYSTÈME**

#### `notifications`
Notifications utilisateurs

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID notification |
| `user_id` | UUID (FK) | Destinataire |
| `type` | TEXT | Type notif |
| `title` | TEXT | Titre |
| `message` | TEXT | Message |
| `is_read` | BOOLEAN | Lu |
| `related_id` | UUID | ID objet lié |
| `created_at` | TIMESTAMPTZ | Date création |

---

### 8️⃣ **CRM PROFESSIONNEL**

#### `contacts`
Contacts pour comptes pros (FA, adoptants, partenaires)

| Colonne | Type | Description |
|---------|------|-------------|
| `id` | UUID (PK) | ID contact |
| `professional_account_id` | UUID (FK) | Compte pro |
| `user_id` | UUID (FK) | Utilisateur lié |
| `full_name` | TEXT | Nom complet |
| `email` | TEXT | Email |
| `phone` | TEXT | Téléphone |
| `address` | TEXT | Adresse |
| `city` | TEXT | Ville |
| `type` | ENUM | foster_family, adopter, partner, both |
| `status` | ENUM | active, inactive |
| `is_verified` | BOOLEAN | Vérifié |
| `max_dogs` | INTEGER | Nb max chiens (FA) |
| `on_vacation` | BOOLEAN | En vacances (FA) |
| `created_at` | TIMESTAMPTZ | Date création |
| `updated_at` | TIMESTAMPTZ | Dernière MAJ |

---

## 🔐 Row Level Security (RLS)

### Principe
Chaque table est protégée par des politiques RLS pour garantir :
- ✅ Isolation des données utilisateurs
- ✅ Accès public limité (chiens adoption, posts)
- ✅ Permissions basées sur l'authentification

### Exemples de Politiques

#### Données Privées
```sql
-- Les users voient SEULEMENT leurs propres chiens
CREATE POLICY "users_view_own_dogs"
ON dogs FOR SELECT
USING (user_id = auth.uid());
```

#### Données Publiques
```sql
-- Tout le monde voit les chiens en adoption
CREATE POLICY "public_view_adoption_dogs"
ON dogs FOR SELECT
USING (is_for_adoption = true AND is_active = true);
```

#### Données Professionnelles
```sql
-- Les pros gèrent leurs contacts
CREATE POLICY "professionals_manage_contacts"
ON contacts FOR ALL
USING (professional_account_id IN (
  SELECT id FROM professional_accounts WHERE user_id = auth.uid()
));
```

---

## 📦 Storage Buckets

### Buckets à créer dans Supabase Storage

1. **dog-photos** (Public)
   - Photos de profil et galeries chiens
   - Max: 5MB par fichier
   - Formats: JPEG, PNG, WebP

2. **social-feed-media** (Public)
   - Images et vidéos du feed social
   - Max: 10MB par fichier
   - Formats: Images + MP4, WebM

3. **community-images** (Public)
   - Images des forums
   - Max: 5MB par fichier
   - Formats: JPEG, PNG, WebP

4. **user-avatars** (Public)
   - Avatars utilisateurs
   - Max: 2MB par fichier
   - Formats: JPEG, PNG, WebP

---

## 🔄 Triggers Automatiques

### Trigger 1: Création Profil Automatique
```sql
-- Quand un user s'inscrit → crée automatiquement user_profiles
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
EXECUTE FUNCTION handle_new_user();
```

### Trigger 2: Timestamp Updated_at
```sql
-- MAJ automatique du champ updated_at sur modification
CREATE TRIGGER on_[table]_updated
BEFORE UPDATE ON [table]
EXECUTE FUNCTION handle_updated_at();
```

**Tables avec trigger updated_at:**
- user_profiles
- professional_accounts
- dogs
- adoption_applications
- forum_posts
- contacts

---

## 📈 Index pour Performance

### Index Critiques
- `user_profiles`: email, role, is_active
- `dogs`: user_id, professional_account_id, is_for_adoption
- `vaccinations`: dog_id, next_due_date
- `treatments`: dog_id, next_due_date
- `forum_posts`: user_id, forum_id, created_at (DESC)
- `notifications`: user_id, is_read, created_at (DESC)

---

## 🔗 Diagramme des Relations

```
auth.users (Supabase)
    ↓
user_profiles ────→ professional_accounts
    ↓                        ↓
    ├─→ dogs ←───────────────┤
    │     ↓
    │     ├─→ vaccinations
    │     ├─→ treatments
    │     ├─→ weight_records
    │     ├─→ health_notes
    │     ├─→ dog_photos
    │     ├─→ adoption_applications
    │     └─→ pending_transfers
    │
    ├─→ forum_posts
    │     ├─→ forum_post_images
    │     ├─→ forum_comments
    │     └─→ forum_likes
    │
    ├─→ notifications
    └─→ user_follows

professional_accounts
    └─→ contacts
```

---

## 📝 Notes Importantes

1. **Contrainte Chiens:** Un chien appartient SOIT à un user SOIT à un professional_account (jamais les deux)

2. **Forums vs Feed Social:**
   - `forum_id` NULL = post du feed social
   - `forum_id` renseigné = post dans un forum spécifique

3. **Transferts de Chiens:**
   - Système de tokens uniques avec expiration
   - Email envoyé via Edge Function `send-transfer-email`

4. **Abonnements Premium:**
   - Géré dans `user_profiles.subscription_tier`
   - Date d'expiration dans `subscription_end_date`

5. **Soft Delete:**
   - Posts: `is_hidden = true`
   - Comptes: `is_active = false`

---

**Dernière mise à jour:** 2026-01-16
**Version du schéma:** 1.0
**Total tables:** 18
