const fs = require('fs');
const path = require('path');

// Créer un SVG simple pour Woofly
const createSVGIcon = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <!-- Fond dégradé -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Rectangle de fond -->
  <rect width="512" height="512" fill="url(#grad)" rx="110"/>
  
  <!-- Cercle blanc -->
  <circle cx="256" cy="256" r="180" fill="white"/>
  
  <!-- Empreinte de patte -->
  <g fill="#8B5CF6">
    <!-- Patte principale -->
    <ellipse cx="256" cy="286" rx="70" ry="85"/>
    
    <!-- 4 doigts -->
    <circle cx="176" cy="196" r="38"/>
    <circle cx="226" cy="166" r="38"/>
    <circle cx="286" cy="166" r="38"/>
    <circle cx="336" cy="196" r="38"/>
  </g>
</svg>`;
};

// Sauvegarder le SVG
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const svgPath = path.join(iconsDir, 'icon.svg');
fs.writeFileSync(svgPath, createSVGIcon());

console.log('✅ Icône SVG créée avec succès dans:', svgPath);
console.log('\n📝 Pour générer les PNG, utilisez un convertisseur en ligne ou ImageMagick:');
console.log('   convert icon.svg -resize 192x192 icon-192x192.png');
console.log('   convert icon.svg -resize 512x512 icon-512x512.png');
console.log('\n💡 Ou visitez: https://realfavicongenerator.net pour générer toutes les tailles\n');
