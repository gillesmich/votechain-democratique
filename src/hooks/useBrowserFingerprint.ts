import { useState, useEffect } from 'react';

// Fonction pour générer un fingerprint basique du navigateur
const generateBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
  }
  
  const canvasFingerprint = canvas.toDataURL();
  
  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    colorDepth: screen.colorDepth,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvas: canvasFingerprint.slice(-50), // Prendre seulement les derniers caractères
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory: (navigator as any).deviceMemory || 0,
    pixelRatio: window.devicePixelRatio || 1
  };
  
  // Créer un hash simple du fingerprint
  const fingerprintString = JSON.stringify(fingerprint);
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(36);
};

export const useBrowserFingerprint = () => {
  const [fingerprint, setFingerprint] = useState<string>('');

  useEffect(() => {
    try {
      const fp = generateBrowserFingerprint();
      setFingerprint(fp);
    } catch (error) {
      console.warn('Impossible de générer le fingerprint du navigateur:', error);
      setFingerprint('unknown');
    }
  }, []);

  return fingerprint;
};