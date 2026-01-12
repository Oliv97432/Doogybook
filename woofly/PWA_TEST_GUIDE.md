# 🧪 Guide de Test Rapide - PWA Woofly

## ✅ Tests de Validation PWA

### 1. TEST BASIQUE (2 minutes)

```bash
# Vérifier que l'app tourne
curl -I http://localhost:5173/

# Vérifier le manifest
curl -I http://localhost:5173/manifest.json

# Vérifier le Service Worker
curl -I http://localhost:5173/sw.js

# Vérifier les icônes
curl -I http://localhost:5173/icons/icon-192x192.png
```

**Résultats attendus:** Tous doivent retourner `200 OK`

---

### 2. TEST DANS LE NAVIGATEUR (5 minutes)

#### Chrome/Edge:

1. **Ouvrir:** http://localhost:5173/
2. **F12** → DevTools
3. **Application** tab:
   - ✅ **Manifest:** Voir les infos Woofly
   - ✅ **Service Workers:** Status "activated"
   - ✅ **Cache Storage:** woofly-v1.0.0 créé
4. **Lighthouse** tab:
   - ✅ Lancer audit "Progressive Web App"
   - ✅ Score attendu: 90+

#### Test Installation:

1. Attendre 3 secondes
2. Popup "Installer Woofly" apparaît
3. Cliquer "Installer"
4. L'app s'ouvre dans sa fenêtre
5. ✅ Icône dans la barre des tâches

---

### 3. TEST MODE OFFLINE (2 minutes)

1. Ouvrir l'app installée (ou dans Chrome)
2. F12 → **Network** tab
3. Cocher "**Offline**"
4. Recharger la page
5. ✅ Page offline s'affiche (avec 🐾)
6. Décocher "Offline"
7. ✅ Page se recharge automatiquement

---

### 4. TEST MOBILE (si déployé en HTTPS)

#### Android:
```
1. Ouvrir Chrome mobile
2. Aller sur l'URL HTTPS
3. Menu ⋮ → "Installer l'application"
4. Icône sur l'écran d'accueil
5. Ouvrir → Plein écran ✅
```

#### iOS:
```
1. Ouvrir Safari
2. Bouton Partager 📤
3. "Sur l'écran d'accueil"
4. Ajouter
5. Ouvrir depuis l'écran d'accueil ✅
```

---

## 🔍 Commandes de Débogage

### Logs du Service Worker:
```javascript
// Dans la console (F12):
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations);
});
```

### Forcer la mise à jour:
```javascript
// Dans la console:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations[0].update();
});
```

### Vider le cache:
```javascript
// Dans la console:
caches.keys().then(keys => {
  keys.forEach(key => caches.delete(key));
});
```

### Désinstaller le SW:
```javascript
// Dans la console:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister());
});
```

---

## ✅ Checklist Finale

Avant de déclarer "PWA prête":

- [ ] Manifest accessible et valide
- [ ] Service Worker enregistré et actif
- [ ] Icônes toutes tailles disponibles
- [ ] Installation fonctionne (desktop)
- [ ] Mode offline fonctionne
- [ ] Lighthouse score PWA > 90
- [ ] Responsive sur mobile
- [ ] HTTPS en production
- [ ] Tests sur Chrome, Firefox, Safari
- [ ] Tests sur Android et iOS

---

## 🚨 Erreurs Communes

### "Failed to register service worker"
- ✅ Vérifier que sw.js est dans /public/
- ✅ Vérifier la syntaxe JavaScript
- ✅ Tester sur HTTPS ou localhost uniquement

### "Manifest parse error"
- ✅ Valider JSON: https://jsonlint.com
- ✅ Vérifier les chemins des icônes
- ✅ Vérifier start_url

### "Installation prompt doesn't show"
- ✅ HTTPS requis (sauf localhost)
- ✅ Manifest valide
- ✅ Service Worker actif
- ✅ localStorage pas "dismissed"
- ✅ Pas déjà installée

### "Icons not loading"
- ✅ Vérifier /public/icons/ existe
- ✅ Vérifier les liens symboliques
- ✅ Remplacer par vraies PNG si SVG ne marche pas

---

## 📊 Résultats Attendus

### Lighthouse PWA Score:
```
✅ Installable                     : 100%
✅ PWA Optimized                   : 100%
✅ Fast and reliable               : 90%+
✅ Works offline                   : 100%
✅ Provides a service worker       : 100%

Score Total PWA: 90-100 🎯
```

### Cache Performance:
```
First Load:    ~2-3s (normal)
Second Load:   ~0.3s (from cache) ⚡
Offline:       Instant (from cache) 🚀
```

---

## 🎉 Validation Complète

Si tous les tests passent:
```
✅ PWA fonctionnelle
✅ Installable
✅ Offline capable
✅ Production ready (avec vraies icônes)
```

**Status:** READY TO DEPLOY 🚀
