/**
 * DOM Utils
 * =========
 * Fonctions utilitaires pour manipulation DOM
 */

/**
 * Sélectionne un élément dans le DOM
 * @param {string} selector - Sélecteur CSS
 * @returns {Element|null} Élément trouvé ou null
 */
export function $(selector) {
  return document.querySelector(selector);
}

/**
 * Sélectionne tous les éléments correspondants
 * @param {string} selector - Sélecteur CSS
 * @returns {NodeList} Liste des éléments
 */
export function $$(selector) {
  return document.querySelectorAll(selector);
}

/**
 * Définit le texte d'un élément de manière sécurisée
 * @param {string} selector - Sélecteur CSS
 * @param {string} text - Texte à insérer
 */
export function setText(selector, text) {
  const element = $(selector);
  if (element && text) {
    element.textContent = text;
  }
}

/**
 * Définit l'attribut d'un élément
 * @param {string} selector - Sélecteur CSS
 * @param {string} attr - Nom de l'attribut
 * @param {string} value - Valeur de l'attribut
 */
export function setAttr(selector, attr, value) {
  const element = $(selector);
  if (element && value) {
    element.setAttribute(attr, value);
  }
}

/**
 * Crée un élément HTML
 * @param {string} tag - Nom de la balise
 * @param {Object} attrs - Attributs de l'élément
 * @param {string} content - Contenu HTML ou texte
 * @returns {Element} Élément créé
 */
export function createElement(tag, attrs = {}, content = '') {
  const element = document.createElement(tag);
  
  // Applique les attributs
  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'className') {
      element.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dataKey, dataValue]) => {
        element.dataset[dataKey] = dataValue;
      });
    } else {
      element.setAttribute(key, value);
    }
  });
  
  // Ajoute le contenu
  if (content) {
    element.innerHTML = content;
  }
  
  return element;
}

/**
 * Vide le contenu d'un élément
 * @param {string|Element} target - Sélecteur ou élément
 */
export function empty(target) {
  const element = typeof target === 'string' ? $(target) : target;
  if (element) {
    element.innerHTML = '';
  }
}

/**
 * Ajoute une classe à un élément
 * @param {string|Element} target - Sélecteur ou élément
 * @param {string} className - Classe à ajouter
 */
export function addClass(target, className) {
  const element = typeof target === 'string' ? $(target) : target;
  if (element) {
    element.classList.add(className);
  }
}

/**
 * Retire une classe d'un élément
 * @param {string|Element} target - Sélecteur ou élément
 * @param {string} className - Classe à retirer
 */
export function removeClass(target, className) {
  const element = typeof target === 'string' ? $(target) : target;
  if (element) {
    element.classList.remove(className);
  }
}

/**
 * Toggle une classe sur un élément
 * @param {string|Element} target - Sélecteur ou élément
 * @param {string} className - Classe à toggler
 */
export function toggleClass(target, className) {
  const element = typeof target === 'string' ? $(target) : target;
  if (element) {
    element.classList.toggle(className);
  }
}

/**
 * Vérifie si un élément a une classe
 * @param {string|Element} target - Sélecteur ou élément
 * @param {string} className - Classe à vérifier
 * @returns {boolean}
 */
export function hasClass(target, className) {
  const element = typeof target === 'string' ? $(target) : target;
  return element ? element.classList.contains(className) : false;
}

/**
 * Scroll smooth vers un élément
 * @param {string|Element} target - Sélecteur ou élément
 */
export function scrollTo(target) {
  const element = typeof target === 'string' ? $(target) : target;
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}