// Lazy loader pour jsPDF - Ne charge que quand vraiment nécessaire
let jsPDFModule = null;
let html2canvasModule = null;

export const loadJsPDF = async () => {
  if (!jsPDFModule) {
    jsPDFModule = await import('jspdf');
  }
  return jsPDFModule.default || jsPDFModule.jsPDF;
};

export const loadHtml2Canvas = async () => {
  if (!html2canvasModule) {
    html2canvasModule = await import('html2canvas');
  }
  return html2canvasModule.default;
};

// Hook React pour charger jsPDF
import { useState, useCallback } from 'react';

export const useJsPDF = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const generatePDF = useCallback(async (generateFn) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const jsPDF = await loadJsPDF();
      const html2canvas = await loadHtml2Canvas();
      
      await generateFn(jsPDF, html2canvas);
    } catch (err) {
      setError(err);
      console.error('Error loading PDF libraries:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { generatePDF, isLoading, error };
};
