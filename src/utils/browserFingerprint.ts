// Utilitaire pour générer un fingerprint du navigateur
export const generateBrowserFingerprint = (): string => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Browser fingerprint', 2, 2);
    }
    
    const fingerprint = {
      // Informations de base du navigateur
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages?.join(',') || '',
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      
      // Informations d'écran
      screenWidth: screen.width,
      screenHeight: screen.height,
      screenColorDepth: screen.colorDepth,
      pixelDepth: screen.pixelDepth,
      
      // Informations de fenêtre
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      
      // Timezone
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      
      // Canvas fingerprint
      canvasFingerprint: canvas.toDataURL(),
      
      // WebGL fingerprint
      webglVendor: getWebGLInfo()?.vendor || '',
      webglRenderer: getWebGLInfo()?.renderer || '',
      
      // Plugins disponibles
      pluginsCount: navigator.plugins?.length || 0,
      
      // Storage disponible
      localStorageEnabled: isStorageAvailable('localStorage'),
      sessionStorageEnabled: isStorageAvailable('sessionStorage'),
      
      // Touch support
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      
      // Hardware concurrency
      hardwareConcurrency: navigator.hardwareConcurrency || 0,
      
      // Memory info (si disponible)
      deviceMemory: (navigator as any).deviceMemory || 0,
    };
    
    // Créer un hash simple du fingerprint
    const fingerprintString = JSON.stringify(fingerprint);
    return hashString(fingerprintString);
    
  } catch (error) {
    console.warn('Error generating browser fingerprint:', error);
    // Fallback simple
    return hashString(navigator.userAgent + screen.width + screen.height + new Date().getTimezoneOffset());
  }
};

// Fonction pour obtenir les informations WebGL
const getWebGLInfo = () => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;
    if (!gl) return null;
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return null;
    
    return {
      vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
      renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    };
  } catch {
    return null;
  }
};

// Fonction pour vérifier la disponibilité du storage
const isStorageAvailable = (type: 'localStorage' | 'sessionStorage'): boolean => {
  try {
    const storage = window[type];
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Hash simple pour créer un fingerprint
const hashString = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36);
};