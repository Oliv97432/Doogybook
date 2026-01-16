# Doogybook - Product Requirements Document

## Original Problem Statement
Transformer l'application web "Doogybook" en application mobile (PWA) avec optimisations de performance.

## User Persona
- Propriétaires de chiens francophones
- Utilisateurs mobiles principalement
- Utilisateurs "Pro" (éleveurs, refuges) avec fonctionnalités premium

## Core Requirements
1. **PWA Conversion** - Application installable sur mobile avec support hors-ligne
2. **Performance Mobile** - Chargement rapide sur appareils mobiles
3. **Branding** - Renommage de "Woofly" à "Doogybook"
4. **Suppression des publicités** - Retrait de Google AdSense
5. **Navigation mobile** - Scroll horizontal fonctionnel sur tous les onglets
6. **Accessibilité** - Contraste WCAG AA respecté

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Supabase (base de données, auth, storage)
- **Déploiement:** Vercel (lié à GitHub)
- **PWA:** Service Workers, Web App Manifest

## What's Been Implemented

### Date: 12 Janvier 2026

#### Optimisation Social-Feed (COMPLETED)
- **Infinite Scroll:** Pagination automatique (10 posts par page) au défilement
- **Pull-to-Refresh:** Glisser vers le bas pour actualiser sur mobile
- **Skeleton Loading:** Affichage de squelettes pendant le chargement
- **Lazy Loading Images:** Chargement des images au scroll via IntersectionObserver
- Fichiers modifiés:
  - `/app/woofly/src/pages/social-feed/index.jsx`
  - `/app/woofly/src/components/TabNavigation.jsx`

#### Navigation Mobile Scroll (IMPROVED)
- Simplification du CSS pour le scroll horizontal
- Auto-scroll vers l'onglet actif
- Classe `scrollbar-hide` appliquée correctement
- Tous les 6 onglets accessibles sur mobile (Mon Chien, Communauté, Adoption, Conseils, Recettes, Rappels)

### Travaux Précédents (Sessions antérieures)
- ✅ Conversion PWA complète
- ✅ Correction branding Woofly → Doogybook
- ✅ Suppression Google AdSense
- ✅ Amélioration contraste accessibilité
- ✅ Restauration générateur Instagram pour Pro
- ✅ Suppression footer sur pages spécifiques

## Prioritized Backlog

### P0 - Critical
- [x] Optimisation social-feed (infinite scroll, lazy loading)
- [x] Navigation mobile scroll horizontal

### P1 - Important
- [ ] Vérification production après déploiement Vercel
- [ ] Tests utilisateur sur mobile réel

### P2 - Nice to Have
- [ ] Optimisation autres pages lourdes
- [ ] Mode hors-ligne amélioré pour PWA

## Known Issues
- Le scroll de navigation doit être vérifié sur l'appareil mobile réel de l'utilisateur après déploiement

## Documentation Files
- `/app/woofly/PWA_README_FR.md`
- `/app/woofly/PERFORMANCE_OPTIMIZATIONS.md`
- `/app/woofly/SOCIAL_FEED_IMPROVEMENTS.md`
- `/app/woofly/BUILD_FIX.md`

## Deployment Notes
- Application déployée via Vercel connecté à GitHub
- Variables d'environnement Supabase à configurer dans Vercel Dashboard
