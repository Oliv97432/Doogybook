# 🤖 Guide Claude Code - Woofly/Doogybook

## 📋 Table des matières
- [Commandes essentielles](#commandes-essentielles)
- [Workflow quotidien](#workflow-quotidien)
- [Exemples pratiques](#exemples-pratiques)
- [Debugging](#debugging)
- [Git + Claude](#git--claude)
- [Astuces pro](#astuces-pro)

---

## 🚀 Commandes essentielles

### **Analyse et compréhension**
```bash
# Analyser la structure du projet
claude "Explique-moi la structure de ce projet"

# Comprendre un fichier spécifique
claude "Que fait le fichier src/pages/Dashboard.jsx ?"

# Trouver où est défini quelque chose
claude "Où est définie la fonction de connexion ?"

# Analyser les dépendances
claude "Quelles sont les dépendances principales et à quoi servent-elles ?"
```

### **Modifications de code**
```bash
# Corriger un bug
claude "Il y a une erreur dans Dashboard.jsx ligne 45, corrige-la"

# Ajouter une feature
claude "Ajoute un bouton de déconnexion dans le Header"

# Optimiser
claude "Optimise le composant DogProfile pour les performances"

# Refactoriser
claude "Refactorise cette fonction pour qu'elle soit plus lisible"
```

### **Création de composants**
```bash
# Créer un nouveau composant
claude "Crée un composant NotificationBadge qui affiche le nombre de notifications"

# Créer avec props spécifiques
claude "Crée un composant ProductCard avec image, titre, prix et bouton"

# Créer une page complète
claude "Crée une page Settings avec sections profil, notifications et confidentialité"
```

### **Debugging**
```bash
# Analyser une erreur
claude "J'ai cette erreur: [colle l'erreur], comment la corriger ?"

# Problème de logique
claude "Cette fonction devrait faire X mais elle fait Y, pourquoi ?"

# Performance
claude "Pourquoi cette page est lente à charger ?"

# Base de données
claude "La requête Supabase ne retourne rien, où est le problème ?"
```

---

## 🔄 Workflow quotidien

### **1. Démarrage de journée**
```bash
# Pull les derniers changements
git pull origin main

# Vérifie l'état du projet
claude "Résume les dernières modifications du projet"

# Lance le dev server
npm run dev
```

### **2. Développement**
```bash
# Avant de coder
git checkout -b feature/nom-feature

# Demande à Claude
claude "Je veux ajouter [feature], comment procéder ?"

# Claude modifie les fichiers
# Review avec git diff

# Test dans le navigateur
# Si OK, commit
```

### **3. Commit & Push**
```bash
# Vérifie les changements
git status
git diff

# Commit
git add .
git commit -m "Feat: Description de la feature"

# Push
git push origin feature/nom-feature

# Merge via GitHub (ou main si direct)
```

---

## 💡 Exemples pratiques

### **Exemple 1 : Ajouter une notification**
```bash
claude "Je veux afficher une notification toast quand un utilisateur crée un post. 
Ajoute ça dans src/components/community/CreatePost.jsx avec react-hot-toast"
```

**Claude va :**
1. Analyser CreatePost.jsx
2. Installer react-hot-toast si nécessaire
3. Modifier le fichier
4. Ajouter le toast au bon endroit

### **Exemple 2 : Corriger un bug de connexion**
```bash
claude "Les utilisateurs ne peuvent pas se connecter avec leur email. 
Le fichier Login.jsx utilise Supabase auth. Debug et corrige"
```

**Claude va :**
1. Analyser Login.jsx
2. Vérifier la config Supabase
3. Trouver le problème
4. Proposer la correction
5. Modifier le fichier

### **Exemple 3 : Optimiser les performances**
```bash
claude "Le Dashboard est lent. Analyse et optimise :
- Lazy loading des composants
- Memoization si nécessaire  
- Optimisation des requêtes Supabase"
```

**Claude va :**
1. Analyser Dashboard.jsx
2. Identifier les problèmes
3. Appliquer React.lazy()
4. Ajouter useMemo/useCallback si besoin
5. Optimiser les queries

---

## 🐛 Debugging

### **Erreurs courantes**

**Erreur : Cannot read property 'X' of undefined**
```bash
claude "J'ai cette erreur dans Dashboard.jsx: 
Cannot read property 'name' of undefined. 
Voici le code : [colle le code]"
```

**Erreur : Supabase RLS**
```bash
claude "Je reçois une erreur 'permission denied' quand je fais cette requête Supabase:
[colle la requête]
Vérifie les RLS policies"
```

**Erreur : Build failed**
```bash
claude "Le build Vercel échoue avec cette erreur: [colle l'erreur]
Trouve et corrige le problème"
```

### **Problèmes de style**
```bash
# CSS ne s'applique pas
claude "Mon bouton ne prend pas les styles Tailwind, pourquoi ?"

# Responsive cassé
claude "Le design mobile est cassé sur Dashboard.jsx, corrige"

# Layout problème
claude "Les éléments se chevauchent sur petit écran"
```

---

## 📊 Git + Claude

### **Workflow branches**
```bash
# Créer une feature
git checkout -b feature/shop-button
claude "Ajoute un bouton flottant vers la boutique dans tous les layouts"
git add .
git commit -m "Feat: Ajout bouton boutique flottant"
git push origin feature/shop-button

# Fix urgent
git checkout -b hotfix/login-bug
claude "Corrige le bug de connexion dans Login.jsx"
git add .
git commit -m "Fix: Correction bug connexion email"
git push origin hotfix/login-bug
```

### **Review de code**
```bash
# Avant de commit
git diff > changes.txt
claude "Review ces changements et dis-moi si tu vois des problèmes"

# Analyser un commit
git show abc123
claude "Analyse ce commit et explique ce qu'il fait"
```

### **Résoudre des conflits**
```bash
# Lors d'un merge conflict
claude "J'ai un conflit Git dans Dashboard.jsx entre ces deux versions:
<<<<<<< HEAD
[version 1]
=======
[version 2]
>>>>>>> feature-branch
Quelle est la meilleure résolution ?"
```

---

## 🎯 Astuces pro

### **1. Context précis**
```bash
# ❌ Vague
claude "Corrige le bug"

# ✅ Précis
claude "Dans src/pages/Dashboard.jsx ligne 78, la fonction fetchDogs() 
ne filtre pas par user_id. Ajoute le filtre WHERE user_id = auth.user.id"
```

### **2. Multi-fichiers**
```bash
# Modification coordonnée
claude "Je veux ajouter un système de favoris. 
Modifie :
- Dashboard.jsx pour ajouter l'icône
- hooks/useFavorites.js pour la logique
- Ajoute la table favorites dans le schema"
```

### **3. Génération de tests**
```bash
claude "Crée des tests Jest pour le composant ProductCard"

claude "Génère des données de test pour la table dogs (10 chiens)"
```

### **4. Documentation**
```bash
claude "Ajoute des commentaires JSDoc à toutes les fonctions de Dashboard.jsx"

claude "Génère un README.md pour le dossier src/components/community/"
```

### **5. Migration de code**
```bash
claude "Convertis ce composant Class en Function Component avec hooks"

claude "Migre cette logique de Redux vers Context API"
```

---

## 📱 Commandes spécifiques Woofly

### **Dashboard**
```bash
# Ajouter une quick action
claude "Ajoute une quick action 'Rendez-vous véto' dans QuickActions.jsx"

# Modifier le DailyTip
claude "Change le design de DailyTipCard pour qu'il soit plus coloré"
```

### **Community**
```bash
# Nouveau type de post
claude "Ajoute la possibilité de créer des sondages dans CreatePost.jsx"

# Filtres
claude "Ajoute des filtres par race dans CommunityHome.jsx"
```

### **Adoption**
```bash
# Formulaire d'adoption
claude "Améliore le formulaire d'adoption avec validation côté client"

# Galerie photos
claude "Ajoute un carousel pour les photos de chiens à adopter"
```

### **Profil**
```bash
# Upload photo
claude "Améliore l'upload photo dans DogProfile.jsx avec preview et crop"

# Carnet de santé
claude "Ajoute une timeline des vaccins dans le profil chien"
```

---

## 🔥 Mode rapide

### **Fix rapides**
```bash
# Typo
claude "Corrige toutes les fautes d'orthographe dans les fichiers FR"

# Import manquant
claude "Ajoute tous les imports manquants dans ce fichier"

# Console.log oubliés
claude "Supprime tous les console.log du projet"
```

### **Style rapide**
```bash
# Appliquer design system
claude "Applique les couleurs brand (bleu #3B82F6, violet #8B5CF6) partout"

# Consistency
claude "Assure-toi que tous les boutons utilisent rounded-3xl"

# Mobile
claude "Rends ce composant responsive pour mobile"
```

---

## 🚨 Troubleshooting Claude Code

### **Claude ne répond pas**
```bash
# Vérifie la clé API
echo $ANTHROPIC_API_KEY

# Réinstalle
npm install -g @anthropic-ai/claude-code@latest

# Clear cache
rm -rf ~/.claude/cache
```

### **Modifications non appliquées**
```bash
# Claude suggère mais ne modifie pas ? 
# Dis explicitement :
claude "Modifie directement le fichier Dashboard.jsx, ne me donne pas juste le code"
```

### **Context trop large**
```bash
# Si Claude est confus à cause de trop de fichiers
claude --files src/pages/Dashboard.jsx "Analyse uniquement ce fichier"
```

---

## 📚 Ressources

### **Documentation**
- Claude Code : https://docs.anthropic.com/claude/docs/claude-code
- React : https://react.dev
- Supabase : https://supabase.com/docs
- Tailwind : https://tailwindcss.com/docs

### **Raccourcis VS Code**
- `Ctrl + Shift + P` : Command Palette
- `Ctrl + \`` : Terminal
- `Ctrl + P` : Quick File Open
- `Alt + K` : Chat Claude (selon config)

### **Git Flow**
```
main (production)
  ├── develop (staging)
  │   ├── feature/nouvelle-feature
  │   ├── feature/autre-feature
  │   └── hotfix/bug-urgent
```

---

## 💾 Commandes à sauvegarder

**Mes commandes les plus utilisées :**
```bash
# Analyse complète
claude "Analyse ce projet et liste les améliorations possibles"

# Performance check
claude "Analyse les performances et suggère des optimisations"

# Security audit
claude "Vérifie s'il y a des problèmes de sécurité dans le code"

# Before deploy
claude "Vérifie que le projet est prêt pour le déploiement"
```

---

## 🎓 Pro Tips

1. **Commit souvent** : Avant chaque demande à Claude, commit ou stash
2. **Review toujours** : `git diff` avant de push
3. **Teste localement** : Vérifie que ça marche avant de push
4. **Context clair** : Plus tu es précis, meilleures sont les réponses
5. **Itère** : Si la première réponse n'est pas parfaite, précise ta demande

---

## ✅ Checklist avant production

```bash
# 1. Code quality
claude "Review complet du code, signale les problèmes"

# 2. Performance
claude "Vérifie que toutes les images sont optimisées"
claude "Tous les composants utilisent lazy loading ?"

# 3. Sécurité
claude "Vérifie les RLS policies Supabase"
claude "Pas de clés API exposées ?"

# 4. SEO
claude "Vérifie les meta tags et le sitemap"

# 5. Responsive
claude "Teste tous les composants sur mobile"

# 6. Accessibility
claude "Ajoute les attributs aria manquants"
```

---

## 📞 Support

**Si problème avec Claude Code :**
- Discord Anthropic : https://discord.gg/anthropic
- GitHub Issues : https://github.com/anthropics/claude-code
- Documentation : https://docs.anthropic.com

**Pour Woofly/Doogybook :**
- Ton GitHub : https://github.com/[ton-username]/woofly
- Ta stack : React + Vite + Supabase + Tailwind
- Déployé sur : Vercel (app.wooflyapp.com)

---

**🐕 Bon dev avec Claude Code ! 🚀**