# 🔧 SOLUTION RAPIDE : Chiens Disparus de TestRefuge

**Date:** 2026-01-16
**Problème:** Les chiens du compte testrefuge n'apparaissent plus dans le ProDashboard

---

## ✅ ÉTAPE 1 : Diagnostic (2 min)

### Copiez et exécutez ce script dans Supabase SQL Editor :

```sql
-- 1. Trouver le compte testrefuge
SELECT
    id,
    organization_name,
    email,
    user_id
FROM public.professional_accounts
WHERE organization_name ILIKE '%test%'
   OR email ILIKE '%test%'
ORDER BY created_at DESC;
```

**➡️ Notez l'UUID du compte (colonne `id`)**

---

## ✅ ÉTAPE 2 : Vérifier les chiens (1 min)

```sql
-- 2. Compter les chiens de testrefuge
-- REMPLACER 'UUID_DU_COMPTE' par l'UUID noté à l'étape 1
SELECT COUNT(*) as nombre_chiens
FROM public.dogs
WHERE professional_account_id = 'UUID_DU_COMPTE';
```

**Résultat attendu :**
- Si `nombre_chiens = 0` → Les chiens ont disparu, passez à l'étape 3
- Si `nombre_chiens > 0` → Les chiens existent ! Le problème vient d'ailleurs

---

## ✅ ÉTAPE 3 : Chercher les chiens orphelins (1 min)

```sql
-- 3. Trouver les chiens sans compte pro
SELECT
    id,
    name,
    breed,
    professional_account_id,
    created_at
FROM public.dogs
WHERE professional_account_id IS NULL
ORDER BY created_at DESC
LIMIT 20;
```

**Si vous voyez vos chiens ici :**
→ Ils sont orphelins, passez à l'étape 4 pour les réassigner

**Si vous ne voyez PAS vos chiens :**
→ Ils ont été supprimés, passez à l'étape 5 pour les recréer

---

## ✅ ÉTAPE 4 : Réassigner les chiens orphelins (1 min)

```sql
-- 4. Réassigner les chiens orphelins à testrefuge
-- REMPLACER 'UUID_DU_COMPTE' par l'UUID du compte testrefuge

UPDATE public.dogs
SET professional_account_id = 'UUID_DU_COMPTE'
WHERE professional_account_id IS NULL
  AND created_at > NOW() - INTERVAL '60 days';

-- Vérifier
SELECT name, breed FROM public.dogs
WHERE professional_account_id = 'UUID_DU_COMPTE';
```

**✅ Les chiens devraient maintenant apparaître dans le ProDashboard !**

---

## ✅ ÉTAPE 5 : Recréer les chiens (si supprimés)

Si les chiens ont été définitivement supprimés, vous devez les recréer :

### Via l'interface :

1. **Se connecter avec le compte testrefuge**
   - Aller sur `/login`
   - Email et mot de passe de testrefuge

2. **Accéder au dashboard pro**
   - URL : `/pro/dashboard`

3. **Ajouter un nouveau chien**
   - Cliquer sur "+ Nouveau" (bouton en haut à droite)
   - Remplir le formulaire :
     - Nom : ex. "Max"
     - Race : ex. "Labrador"
     - Sexe : Mâle/Femelle
     - Date de naissance
     - Statut : Disponible
     - Photo (optionnel)
   - Cliquer sur "Enregistrer"

4. **Répéter** pour créer plusieurs exemples

### Via SQL (plus rapide) :

```sql
-- Créer 3 chiens exemples
-- REMPLACER 'UUID_DU_COMPTE' par l'UUID du compte testrefuge

INSERT INTO public.dogs (
    name,
    breed,
    gender,
    birth_date,
    adoption_status,
    professional_account_id,
    is_urgent,
    description
) VALUES
(
    'Max',
    'Labrador',
    'male',
    '2020-06-15',
    'available',
    'UUID_DU_COMPTE',
    false,
    'Chien adorable cherche famille aimante'
),
(
    'Luna',
    'Berger Allemand',
    'female',
    '2019-03-20',
    'available',
    'UUID_DU_COMPTE',
    true,
    'Urgence - Refuge plein, cherche foyer rapidement'
),
(
    'Rocky',
    'Croisé',
    'male',
    '2021-11-10',
    'pending',
    'UUID_DU_COMPTE',
    false,
    'En cours d''adoption, rencontre prévue ce week-end'
);

-- Vérifier
SELECT name, breed, adoption_status
FROM public.dogs
WHERE professional_account_id = 'UUID_DU_COMPTE';
```

---

## 🔍 RÉSUMÉ DES CAUSES POSSIBLES

| Problème | Symptôme | Solution |
|----------|----------|----------|
| **Chiens orphelins** | `professional_account_id IS NULL` | Réassigner (Étape 4) |
| **Mauvais UUID** | Chiens liés à un autre compte | Réassigner avec bon UUID |
| **Chiens supprimés** | Aucun chien dans la table | Recréer (Étape 5) |
| **Compte supprimé** | Compte testrefuge inexistant | Recréer le compte pro |

---

## 📌 NOTES IMPORTANTES

### Tables forum ✅
Les tables forum **n'existent pas** dans votre base Supabase (erreur lors de l'exécution du script).
→ **Rien à faire**, elles n'ont jamais été créées ou ont déjà été supprimées.

### Logs utiles

Si le problème persiste, vérifiez les logs dans la console navigateur (F12) :

```javascript
// Ouvrir /pro/dashboard avec la console ouverte
// Chercher ces logs :
✅ "ProDashboard: Compte pro trouvé: Test Refuge"
✅ "ProDashboard: Account by user_id: { ... }"

❌ "ProDashboard: Aucun compte pro trouvé" → Compte testrefuge introuvable
❌ "Erreur chargement chiens" → Problème de requête SQL
```

---

## 🆘 BESOIN D'AIDE ?

Si le problème persiste après les étapes ci-dessus, partagez-moi :

1. **Le résultat de l'étape 1** (compte testrefuge)
   ```
   id: ...
   organization_name: ...
   email: ...
   ```

2. **Le résultat de l'étape 2** (nombre de chiens)
   ```
   nombre_chiens: 0 ou X
   ```

3. **Le résultat de l'étape 3** (chiens orphelins)
   ```
   Nombre de chiens orphelins: X
   ```

Et je vous donnerai la solution exacte ! 🎯
