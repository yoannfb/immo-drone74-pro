/**
 * Animations Module
 * =================
 * Gestion des animations scroll reveal avec Intersection Observer
 */

/**
 * Initialise les animations scroll reveal
 */
export function initScrollAnimations() {
  // Vérifie le support d'Intersection Observer
  if (!('IntersectionObserver' in window)) {
    console.warn('⚠️ IntersectionObserver non supporté, animations désactivées');
    // Affiche tous les éléments immédiatement
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }
  
  // Options de l'observer
  const options = {
    root: null, // viewport
    rootMargin: '0px 0px -100px 0px', // Déclenche 100px avant le bas du viewport
    threshold: 0.1 // 10% de l'élément visible
  };
  
  // Callback quand un élément entre dans le viewport
  const callback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Ajoute la classe visible
        entry.target.classList.add('visible');
        
        // Arrête d'observer cet élément (animation une seule fois)
        observer.unobserve(entry.target);
      }
    });
  };
  
  // Crée l'observer
  const observer = new IntersectionObserver(callback, options);
  
  // Observe tous les éléments avec la classe .reveal
  const elements = document.querySelectorAll('.reveal');
  elements.forEach(el => observer.observe(el));
  
  console.log(`✅ ${elements.length} animations scroll initialisées`);
}

/**
 * Anime l'apparition d'éléments avec délai échelonné
 * @param {string} selector - Sélecteur des éléments
 * @param {number} delay - Délai entre chaque élément (ms)
 */
export function staggerAnimation(selector, delay = 100) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, index * delay);
  });
}

/**
 * Fade in d'un élément
 * @param {Element} element - Élément à animer
 * @param {number} duration - Durée en ms
 */
export function fadeIn(element, duration = 300) {
  element.style.opacity = '0';
  element.style.display = 'block';
  
  let start = null;
  
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    
    element.style.opacity = Math.min(progress / duration, 1);
    
    if (progress < duration) {
      requestAnimationFrame(animate);
    }
  }
  
  requestAnimationFrame(animate);
}

/**
 * Fade out d'un élément
 * @param {Element} element - Élément à animer
 * @param {number} duration - Durée en ms
 */
export function fadeOut(element, duration = 300) {
  let start = null;
  const initialOpacity = parseFloat(getComputedStyle(element).opacity) || 1;
  
  function animate(timestamp) {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    
    element.style.opacity = initialOpacity * (1 - progress / duration);
    
    if (progress < duration) {
      requestAnimationFrame(animate);
    } else {
      element.style.display = 'none';
    }
  }
  
  requestAnimationFrame(animate);
}