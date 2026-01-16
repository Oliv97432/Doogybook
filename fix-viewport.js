const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Fonction pour remplacer min-h-screen par min-h-[100dvh] sm:min-h-screen
function fixViewport(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;

    // Remplacer toutes les occurrences de min-h-screen qui ne sont pas déjà suivies de sm:min-h-screen
    // Pattern: min-h-screen qui n'est pas déjà précédé de [100dvh]
    content = content.replace(
      /className="([^"]*)\bmin-h-screen\b([^"]*)"/g,
      (match, before, after) => {
        // Si déjà corrigé, on ne touche pas
        if (before.includes('min-h-[100dvh]')) {
          return match;
        }

        // Remplacer min-h-screen par min-h-[100dvh] sm:min-h-screen
        const newBefore = before.replace(/\bmin-h-screen\b/, 'min-h-[100dvh] sm:min-h-screen');
        const newAfter = after.replace(/\bmin-h-screen\b/, '');

        return `className="${newBefore}${newAfter}"`;
      }
    );

    // Si le contenu a changé, sauvegarder
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corrigé: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`❌ Erreur sur ${filePath}:`, error.message);
    return false;
  }
}

// Trouver tous les fichiers .jsx et .tsx
const patterns = [
  'src/pages/**/*.jsx',
  'src/pages/**/*.tsx',
  'src/components/**/*.jsx',
  'src/components/**/*.tsx',
  'src/*.jsx',
  'src/*.tsx'
];

let totalFixed = 0;

patterns.forEach(pattern => {
  const files = glob.sync(pattern, { cwd: __dirname });
  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fixViewport(filePath)) {
      totalFixed++;
    }
  });
});

console.log(`\n📊 Total fichiers corrigés: ${totalFixed}`);
