#!/bin/bash
echo "🧪 Test de Validation PWA pour Woofly"
echo "====================================="
echo ""

# Test 1: App running
echo "📡 Test 1: Application en cours d'exécution..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/ | grep -q "200"; then
    echo "✅ Application accessible sur http://localhost:5173/"
else
    echo "❌ Application non accessible"
    exit 1
fi
echo ""

# Test 2: Manifest
echo "📄 Test 2: Manifest PWA..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/manifest.json | grep -q "200"; then
    echo "✅ Manifest accessible"
    # Vérifier le contenu
    if curl -s http://localhost:5173/manifest.json | grep -q "Woofly"; then
        echo "✅ Manifest contient les bonnes infos"
    fi
else
    echo "❌ Manifest non accessible"
fi
echo ""

# Test 3: Service Worker
echo "⚙️  Test 3: Service Worker..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/sw.js | grep -q "200"; then
    echo "✅ Service Worker accessible"
    # Vérifier le contenu
    if curl -s http://localhost:5173/sw.js | grep -q "CACHE_NAME"; then
        echo "✅ Service Worker correctement configuré"
    fi
else
    echo "❌ Service Worker non accessible"
fi
echo ""

# Test 4: Icônes
echo "🎨 Test 4: Icônes PWA..."
ICON_FOUND=0
for size in 72 96 128 144 152 192 384 512; do
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/icons/icon-${size}x${size}.png | grep -q "200"; then
        ((ICON_FOUND++))
    fi
done
echo "✅ $ICON_FOUND/8 icônes disponibles"
echo ""

# Test 5: Page offline
echo "🌐 Test 5: Page offline..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5173/offline.html | grep -q "200"; then
    echo "✅ Page offline disponible"
else
    echo "⚠️  Page offline non accessible (optionnel)"
fi
echo ""

# Résumé
echo "======================================"
echo "✅ Tests PWA terminés!"
echo ""
echo "🎯 Prochaines étapes:"
echo "  1. Ouvrir http://localhost:5173/ dans Chrome"
echo "  2. Attendre le prompt d'installation (3 secondes)"
echo "  3. Cliquer 'Installer' pour tester l'installation"
echo "  4. F12 → Application → Manifest/Service Workers"
echo "  5. F12 → Lighthouse → Audit PWA"
echo ""
echo "📚 Documentation complète: PWA_README_FR.md"
echo "======================================"
