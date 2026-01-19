# 🔍 DIAGNOSTIC - Erreur 406 (Not Acceptable) sur API Supabase

## ❌ Erreur Détectée

```javascript
GET https://malcggmelsviujxawpwr.supabase.co/rest/v1/professional_accounts?select=id%2Cis_active&user_id=eq.b642262f-4615-4545-89ed-b3c5a3544d26
→ 406 (Not Acceptable)
```

---

## 🎯 Causes Possibles

### 1. Row Level Security (RLS) Non Configuré ⚠️

**Symptôme:** La table existe mais les requêtes retournent 406

**Solution:**
```sql
-- Exécuter dans Supabase SQL Editor
\i supabase/FIX_PROFESSIONAL_ACCOUNTS_RLS.sql
```

**OU manuellement:**

```sql
-- Activer RLS
ALTER TABLE professional_accounts ENABLE ROW LEVEL SECURITY;

-- Créer policy de lecture
CREATE POLICY "Users can view their own account"
ON professional_accounts
FOR SELECT
USING (auth.uid() = user_id);
```

---

### 2. Policies Trop Restrictives 🔒

**Symptôme:** RLS activé mais aucune policy ne permet la lecture

**Vérification:**
```sql
-- Voir toutes les policies actives
SELECT policyname, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'professional_accounts';
```

**Si vide ou policies incorrectes:**
→ Exécuter `FIX_PROFESSIONAL_ACCOUNTS_RLS.sql`

---

### 3. Header Accept Manquant/Incorrect 📡

**Symptôme:** Requête sans header `Accept: application/json`

**Vérification côté client:**
```javascript
// Dans le code React/JS, vérifier:
import { supabase } from './lib/supabase';

const { data, error } = await supabase
  .from('professional_accounts')
  .select('id, is_active')
  .eq('user_id', userId);

// Supabase JS client ajoute automatiquement le header Accept
// Si erreur persiste → problème RLS
```

---

### 4. Problème de Format de Données 📊

**Symptôme:** Colonne demandée n'existe pas ou type incorrect

**Vérification:**
```sql
-- Vérifier structure de la table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'professional_accounts'
ORDER BY ordinal_position;
```

**Colonnes requises:**
- `id` (UUID)
- `user_id` (UUID)
- `is_active` (BOOLEAN)
- `organization_name` (TEXT)
- etc.

---

### 5. Utilisateur Non Authentifié 🔐

**Symptôme:** `auth.uid()` retourne NULL

**Vérification:**
```javascript
// Vérifier l'authentification
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user); // Doit retourner un objet user

if (!user) {
  console.error('❌ Utilisateur non authentifié');
  // Rediriger vers /login
}
```

---

## 🔧 SOLUTION COMPLÈTE - Étape par Étape

### Étape 1: Vérifier que la table existe

```sql
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_name = 'professional_accounts'
);
```

**Résultat attendu:** `true`

---

### Étape 2: Vérifier RLS

```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'professional_accounts';
```

**Résultat attendu:** `rowsecurity = true`

**Si `false`:**
```sql
ALTER TABLE professional_accounts ENABLE ROW LEVEL SECURITY;
```

---

### Étape 3: Exécuter le script de correction

**Dans Supabase Dashboard > SQL Editor:**

1. Copier le contenu de `FIX_PROFESSIONAL_ACCOUNTS_RLS.sql`
2. Coller dans l'éditeur
3. Cliquer sur **"RUN"**
4. Vérifier les messages de succès

**OU via CLI:**
```bash
supabase db execute supabase/FIX_PROFESSIONAL_ACCOUNTS_RLS.sql
```

---

### Étape 4: Tester la requête

**Dans Supabase Dashboard > SQL Editor:**

```sql
-- Test en tant qu'utilisateur authentifié
-- (Remplacer par un vrai user_id de votre base)
SET request.jwt.claims = '{"sub": "VOTRE_USER_ID_ICI"}';

-- Tester la requête
SELECT id, is_active, organization_name
FROM professional_accounts
WHERE user_id = 'VOTRE_USER_ID_ICI';
```

**OU via API REST:**
```bash
curl -X GET \
  'https://malcggmelsviujxawpwr.supabase.co/rest/v1/professional_accounts?select=id,is_active&user_id=eq.USER_ID' \
  -H 'apikey: VOTRE_ANON_KEY' \
  -H 'Authorization: Bearer VOTRE_ACCESS_TOKEN' \
  -H 'Accept: application/json'
```

---

### Étape 5: Vérifier dans l'application

**Dans le code de l'application:**

```javascript
// AuthContext.jsx ou composant concerné
import { supabase } from './lib/supabase';

async function checkProfessionalAccount() {
  try {
    // Vérifier l'utilisateur authentifié
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('❌ Auth error:', authError);
      return;
    }

    if (!user) {
      console.warn('⚠️ Utilisateur non connecté');
      return;
    }

    console.log('✅ User authenticated:', user.id);

    // Requête sur professional_accounts
    const { data, error } = await supabase
      .from('professional_accounts')
      .select('id, is_active, organization_name')
      .eq('user_id', user.id)
      .maybeSingle(); // maybeSingle() au lieu de single() si peut être null

    if (error) {
      console.error('❌ Supabase error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return;
    }

    if (data) {
      console.log('✅ Professional account found:', data);
    } else {
      console.log('ℹ️ No professional account for this user');
    }

  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}
```

---

## 📋 CHECKLIST DE DIAGNOSTIC

Cocher au fur et à mesure:

- [ ] Table `professional_accounts` existe dans Supabase
- [ ] RLS activé sur la table
- [ ] Au moins une policy SELECT existe
- [ ] Policy permet la lecture pour l'utilisateur connecté
- [ ] Utilisateur est bien authentifié (`auth.uid()` ≠ NULL)
- [ ] Requête utilise le bon format (Supabase JS client)
- [ ] Headers HTTP corrects (Accept: application/json)
- [ ] Colonnes demandées existent dans la table
- [ ] Script `FIX_PROFESSIONAL_ACCOUNTS_RLS.sql` exécuté
- [ ] Test manuel dans SQL Editor réussit

---

## 🎯 SOLUTION RAPIDE (TL;DR)

```bash
# 1. Exécuter le script de correction
# Dans Supabase Dashboard > SQL Editor
Run: supabase/FIX_PROFESSIONAL_ACCOUNTS_RLS.sql

# 2. Vérifier l'authentification
# Dans le code React
const { data: { user } } = await supabase.auth.getUser();
console.log('User:', user);

# 3. Tester la requête
const { data, error } = await supabase
  .from('professional_accounts')
  .select('id, is_active')
  .eq('user_id', user.id)
  .maybeSingle();

console.log('Data:', data);
console.log('Error:', error);
```

---

## 📊 APRÈS LA CORRECTION

### Résultat Attendu

**Console navigateur (avant):**
```
❌ GET .../professional_accounts?... 406 (Not Acceptable)
```

**Console navigateur (après):**
```
✅ User authenticated: b642262f-4615-4545-89ed-b3c5a3544d26
✅ Professional account found: { id: "...", is_active: true, ... }
```

**OU si pas de compte pro:**
```
✅ User authenticated: b642262f-4615-4545-89ed-b3c5a3544d26
ℹ️ No professional account for this user
```

---

## 🔗 RESSOURCES

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Policies Guide](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Debugging 406 Errors](https://supabase.com/docs/guides/api#debugging)

---

## 💡 NOTES IMPORTANTES

1. **Erreur 406 ≠ Erreur 403**
   - 406 = Format de réponse non acceptable (souvent RLS mal configuré)
   - 403 = Forbidden (permissions insuffisantes)

2. **Les policies RLS sont cumulatives**
   - Si AUCUNE policy ne match → Erreur 406 ou résultat vide
   - Si AU MOINS UNE policy match → Requête réussit

3. **Policy SELECT publique**
   - Utile pour afficher les refuges/associations sur la page adoption
   - Limiter aux comptes `is_active = true AND is_verified = true`

4. **Testing RLS**
   - Toujours tester avec un vrai utilisateur authentifié
   - Utiliser `SET request.jwt.claims` dans SQL Editor pour simuler

---

**Créé le:** 2026-01-19
**Pour:** Doogybook v0.1.0
**Erreur:** 406 sur `/rest/v1/professional_accounts`
