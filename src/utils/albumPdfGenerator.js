import jsPDF from 'jspdf';

/**
 * Génère un PDF professionnel à partir des données de l'album photo
 * @param {Object} albumData - Données de l'album avec pages et photos
 * @param {string} fileName - Nom du fichier PDF à générer
 */
export const generateAlbumPDF = async (albumData, fileName = 'mon-album-photo.pdf') => {
  try {
    // Format A4 en paysage pour le mode album
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Dimensions A4 paysage
    const pageWidth = 297;
    const pageHeight = 210;
    const margin = 15;
    const contentWidth = pageWidth - (2 * margin);
    const contentHeight = pageHeight - (2 * margin);

    let isFirstPage = true;

    // Parcourir toutes les pages de l'album
    for (let i = 0; i < albumData.pages.length; i++) {
      const page = albumData.pages[i];

      // Ajouter une nouvelle page PDF (sauf pour la première)
      if (!isFirstPage) {
        pdf.addPage();
      }
      isFirstPage = false;

      // Ajouter le numéro de page en bas
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${i + 1}`, pageWidth / 2, pageHeight - 5, { align: 'center' });

      // Si la page n'a pas de photos, afficher un message
      if (page.photos.length === 0) {
        pdf.setFontSize(16);
        pdf.setTextColor(200, 200, 200);
        pdf.text('Page vide', pageWidth / 2, pageHeight / 2, { align: 'center' });
        continue;
      }

      // Charger et placer les photos selon le layout
      await placePhotosOnPDF(pdf, page, margin, contentWidth, contentHeight);
    }

    // Ajouter une page de couverture au début
    await addCoverPage(pdf, albumData);

    // Télécharger le PDF
    pdf.save(fileName);

    return { success: true, message: 'PDF généré avec succès!' };
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    return { success: false, message: 'Erreur lors de la génération du PDF: ' + error.message };
  }
};

/**
 * Place les photos sur une page PDF selon le layout
 */
const placePhotosOnPDF = async (pdf, page, margin, contentWidth, contentHeight) => {
  const { layout, photos } = page;

  // Définir les positions selon le layout
  let positions = [];

  switch (layout) {
    case 'fullPage':
      positions = [
        { x: margin, y: margin, width: contentWidth, height: contentHeight }
      ];
      break;

    case 'twoPerPage':
      const halfWidth = (contentWidth - 10) / 2;
      positions = [
        { x: margin, y: margin, width: halfWidth, height: contentHeight },
        { x: margin + halfWidth + 10, y: margin, width: halfWidth, height: contentHeight }
      ];
      break;

    case 'threePerPage':
      const largeWidth = (contentWidth * 0.6) - 5;
      const smallWidth = (contentWidth * 0.4) - 5;
      const halfHeight = (contentHeight - 10) / 2;
      positions = [
        { x: margin, y: margin, width: largeWidth, height: contentHeight },
        { x: margin + largeWidth + 10, y: margin, width: smallWidth, height: halfHeight },
        { x: margin + largeWidth + 10, y: margin + halfHeight + 10, width: smallWidth, height: halfHeight }
      ];
      break;

    default:
      positions = [
        { x: margin, y: margin, width: contentWidth, height: contentHeight }
      ];
  }

  // Placer chaque photo
  for (const photo of photos) {
    const position = positions[photo.slotIndex];
    if (!position) continue;

    try {
      // Charger l'image
      const imgData = await loadImage(photo.url);

      // Calculer les dimensions pour maintenir le ratio
      const { finalWidth, finalHeight, offsetX, offsetY } = calculateImageDimensions(
        imgData,
        position.width,
        position.height
      );

      // Ajouter l'image au PDF
      pdf.addImage(
        imgData.data,
        imgData.format,
        position.x + offsetX,
        position.y + offsetY,
        finalWidth,
        finalHeight
      );

      // Ajouter un cadre autour de l'image
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.rect(position.x, position.y, position.width, position.height);

      // Ajouter le titre et la légende si présents
      if (photo.title || photo.caption) {
        addPhotoText(pdf, photo, position);
      }

    } catch (error) {
      console.error('Erreur lors du chargement de l\'image:', error);
      // Afficher un placeholder en cas d'erreur
      pdf.setFillColor(240, 240, 240);
      pdf.rect(position.x, position.y, position.width, position.height, 'F');
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(12);
      pdf.text('Image non disponible', position.x + position.width / 2, position.y + position.height / 2, { align: 'center' });
    }
  }
};

/**
 * Charge une image et retourne ses données
 */
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Déterminer le format
      const format = url.toLowerCase().includes('.png') ? 'PNG' : 'JPEG';

      try {
        const dataUrl = canvas.toDataURL(`image/${format.toLowerCase()}`);
        resolve({ data: dataUrl, format, width: img.width, height: img.height });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Impossible de charger l\'image'));
    };

    img.src = url;
  });
};

/**
 * Calcule les dimensions finales de l'image pour maintenir le ratio
 */
const calculateImageDimensions = (imgData, maxWidth, maxHeight) => {
  const imgRatio = imgData.width / imgData.height;
  const boxRatio = maxWidth / maxHeight;

  let finalWidth, finalHeight, offsetX = 0, offsetY = 0;

  if (imgRatio > boxRatio) {
    // L'image est plus large que le conteneur
    finalWidth = maxWidth;
    finalHeight = maxWidth / imgRatio;
    offsetY = (maxHeight - finalHeight) / 2;
  } else {
    // L'image est plus haute que le conteneur
    finalHeight = maxHeight;
    finalWidth = maxHeight * imgRatio;
    offsetX = (maxWidth - finalWidth) / 2;
  }

  return { finalWidth, finalHeight, offsetX, offsetY };
};

/**
 * Ajoute le titre et la légende sur une photo
 */
const addPhotoText = (pdf, photo, position) => {
  const { title, caption, fontFamily, fontSize, textColor } = photo;

  // Convertir la couleur hex en RGB
  const rgb = hexToRgb(textColor || '#FFFFFF');

  // Zone de texte en bas de l'image
  const textAreaHeight = 25; // Hauteur de la zone de texte
  const textX = position.x + 5;
  const textY = position.y + position.height - textAreaHeight;

  // Fond semi-transparent pour le texte (simulation avec rectangle opaque)
  pdf.setFillColor(0, 0, 0);
  pdf.setGState(new pdf.GState({ opacity: 0.7 }));
  pdf.rect(position.x, textY, position.width, textAreaHeight, 'F');
  pdf.setGState(new pdf.GState({ opacity: 1 }));

  // Définir la police (utiliser une police de base compatible jsPDF)
  const pdfFont = mapFontToPDF(fontFamily);
  pdf.setFont(pdfFont.font, pdfFont.style);

  // Définir la couleur du texte
  pdf.setTextColor(rgb.r, rgb.g, rgb.b);

  let currentY = textY + 5;

  // Ajouter le titre
  if (title) {
    const titleSize = Math.min((fontSize || 14) * 0.35, 12); // Convertir px en pt pour PDF
    pdf.setFontSize(titleSize);
    pdf.setFont(pdfFont.font, 'bold');

    // Tronquer le texte s'il est trop long
    const maxWidth = position.width - 10;
    const titleText = truncateText(pdf, title, maxWidth);
    pdf.text(titleText, textX, currentY);
    currentY += titleSize * 0.5;
  }

  // Ajouter la légende
  if (caption) {
    const captionSize = Math.min(((fontSize || 14) - 2) * 0.35, 10);
    pdf.setFontSize(captionSize);
    pdf.setFont(pdfFont.font, 'normal');

    // Diviser le texte en plusieurs lignes si nécessaire
    const maxWidth = position.width - 10;
    const lines = pdf.splitTextToSize(caption, maxWidth);

    // Limiter à 2 lignes pour éviter le débordement
    const displayLines = lines.slice(0, 2);
    displayLines.forEach((line) => {
      if (currentY + captionSize * 0.5 < position.y + position.height - 2) {
        pdf.text(line, textX, currentY);
        currentY += captionSize * 0.5;
      }
    });
  }
};

/**
 * Convertit une couleur hex en RGB
 */
const hexToRgb = (hex) => {
  // Enlever le # si présent
  hex = hex.replace('#', '');

  // Convertir en RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
};

/**
 * Mappe les noms de polices web vers les polices jsPDF
 */
const mapFontToPDF = (fontFamily) => {
  const fontMap = {
    'Arial': { font: 'helvetica', style: 'normal' },
    'Georgia': { font: 'times', style: 'normal' },
    'Times New Roman': { font: 'times', style: 'normal' },
    'Courier New': { font: 'courier', style: 'normal' },
    'Verdana': { font: 'helvetica', style: 'normal' },
    'Comic Sans MS': { font: 'helvetica', style: 'normal' },
    'Impact': { font: 'helvetica', style: 'bold' },
    'Brush Script MT': { font: 'times', style: 'italic' }
  };

  return fontMap[fontFamily] || { font: 'helvetica', style: 'normal' };
};

/**
 * Tronque le texte s'il dépasse la largeur maximale
 */
const truncateText = (pdf, text, maxWidth) => {
  const textWidth = pdf.getTextWidth(text);

  if (textWidth <= maxWidth) {
    return text;
  }

  // Ajouter des points de suspension
  let truncated = text;
  while (pdf.getTextWidth(truncated + '...') > maxWidth && truncated.length > 0) {
    truncated = truncated.slice(0, -1);
  }

  return truncated + '...';
};

/**
 * Ajoute une page de couverture au début du PDF
 */
const addCoverPage = async (pdf, albumData) => {
  // Insérer une page au début
  pdf.insertPage(1);
  pdf.setPage(1);

  const pageWidth = 297;
  const pageHeight = 210;

  // Fond dégradé (simulé avec des rectangles)
  pdf.setFillColor(102, 126, 234);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Titre
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(40);
  pdf.text('Mon Album Photo', pageWidth / 2, 80, { align: 'center' });

  // Sous-titre
  pdf.setFontSize(16);
  pdf.text('Créé avec DoogyBook Premium', pageWidth / 2, 100, { align: 'center' });

  // Informations
  pdf.setFontSize(12);
  const date = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  pdf.text(`${albumData.pages.length} pages • ${date}`, pageWidth / 2, 130, { align: 'center' });

  // Compter le nombre total de photos
  const totalPhotos = albumData.pages.reduce((sum, page) => sum + page.photos.length, 0);
  pdf.text(`${totalPhotos} photo${totalPhotos > 1 ? 's' : ''}`, pageWidth / 2, 145, { align: 'center' });
};

/**
 * Génère un aperçu rapide (affiche les données dans la console)
 */
export const previewAlbumData = (albumData) => {
  console.log('=== APERÇU DES DONNÉES DE L\'ALBUM ===');
  console.log('Nombre de pages:', albumData.pages.length);

  albumData.pages.forEach((page, index) => {
    console.log(`\nPage ${index + 1}:`);
    console.log('  Layout:', page.layout);
    console.log('  Photos:', page.photos.length);
    page.photos.forEach((photo, photoIndex) => {
      console.log(`    Photo ${photoIndex + 1}: Slot ${photo.slotIndex}`);
    });
  });

  console.log('\n=== STRUCTURE COMPLÈTE ===');
  console.log(JSON.stringify(albumData, null, 2));
  console.log('=====================================');
};
