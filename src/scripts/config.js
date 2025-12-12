/**
 * Config Module
 * =============
 * Charge et parse la configuration JSON du bien immobilier
 */

/**
 * Charge la configuration depuis le script JSON dans le HTML
 * @returns {Object|null} Configuration parsée ou null si erreur
 */
export function loadConfig() {
  try {
    const configScript = document.getElementById('property-config');
    
    if (!configScript) {
      console.error('❌ Script de configuration non trouvé');
      return null;
    }
    
    const configText = configScript.textContent.trim();
    
    if (!configText) {
      console.error('❌ Configuration JSON vide');
      return null;
    }
    
    const config = JSON.parse(configText);
    console.log('✅ Configuration chargée:', config);
    
    return config;
  } catch (error) {
    console.error('❌ Erreur lors du chargement de la config:', error);
    return null;
  }
}

/**
 * Applique les couleurs de l'agence aux variables CSS
 * @param {Object} agency - Objet agency de la config
 */
export function applyAgencyColors(agency) {
  if (!agency) return;
  
  const root = document.documentElement;
  
  if (agency.primaryColor) {
    root.style.setProperty('--color-primary', agency.primaryColor);
    console.log('🎨 Couleur primaire appliquée:', agency.primaryColor);
  }
  
  if (agency.accentColor) {
    root.style.setProperty('--color-accent', agency.accentColor);
    console.log('🎨 Couleur accent appliquée:', agency.accentColor);
  }
}

/**
 * Valide la configuration
 * @param {Object} config - Configuration à valider
 * @returns {boolean} true si valide
 */
export function validateConfig(config) {
  if (!config) {
    console.error('❌ Config est null ou undefined');
    return false;
  }
  
  // Vérifications minimales
  const required = ['property', 'media', 'agency'];
  
  for (const key of required) {
    if (!config[key]) {
      console.error(`❌ Clé requise manquante: ${key}`);
      return false;
    }
  }
  
  console.log('✅ Configuration valide');
  return true;
}
