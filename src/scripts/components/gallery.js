/**
 * Gallery Component
 * =================
 * Gestion galerie photos + lightbox
 */

import { $, $$, addClass, removeClass, createElement } from '../utils/dom.js';

let currentImageIndex = 0;
let images = [];

/**
 * Initialise la galerie
 * @param {Array} galleryImages - Tableau d'images {url, alt}
 */
export function initGallery(galleryImages) {
  if (!galleryImages || galleryImages.length === 0) {
    console.warn('WARNING: Pas d\'images pour la galerie');
    return;
  }
  
  images = galleryImages;
  const grid = $('#galleryGrid');
  
  if (!grid) return;
  
  // Crée les items de galerie
  galleryImages.forEach((image, index) => {
    const item = createElement('div', {
      className: 'gallery__item reveal',
      dataset: { index: index }
    });
    
    item.innerHTML = `
      <img src="${image.url}" alt="${image.alt || 'Photo du bien'}" class="gallery__image" loading="lazy">
      <div class="gallery__overlay">
        <p class="gallery__caption">${image.alt || ''}</p>
      </div>
      <div class="gallery__zoom-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
          <line x1="11" y1="8" x2="11" y2="14"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </div>
    `;
    
    // Click pour ouvrir lightbox
    item.addEventListener('click', () => openLightbox(index));
    
    grid.appendChild(item);
  });
  
  // Init lightbox
  initLightbox();
  
  console.log(`OK: Galerie initialisee avec ${galleryImages.length} images`);
}

/**
 * Initialise le lightbox
 */
function initLightbox() {
  const lightbox = $('#lightbox');
  const closeBtn = $('#lightboxClose');
  const prevBtn = $('#lightboxPrev');
  const nextBtn = $('#lightboxNext');
  
  if (!lightbox) return;
  
  // Fermer
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  
  // Navigation
  if (prevBtn) {
    prevBtn.addEventListener('click', () => navigate(-1));
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => navigate(1));
  }
  
  // Clavier
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  });
}

/**
 * Ouvre le lightbox
 * @param {number} index - Index de l'image
 */
function openLightbox(index) {
  currentImageIndex = index;
  const lightbox = $('#lightbox');
  const image = $('#lightboxImage');
  const caption = $('#lightboxCaption');
  
  if (!lightbox || !image) return;
  
  const currentImage = images[index];
  
  image.src = currentImage.url;
  image.alt = currentImage.alt || 'Photo du bien';
  
  if (caption) {
    caption.textContent = currentImage.alt || '';
  }
  
  addClass(lightbox, 'active');
  document.body.style.overflow = 'hidden'; // Empêche scroll
}

/**
 * Ferme le lightbox
 */
function closeLightbox() {
  const lightbox = $('#lightbox');
  removeClass(lightbox, 'active');
  document.body.style.overflow = ''; // Restore scroll
}

/**
 * Navigation dans le lightbox
 * @param {number} direction - -1 (prev) ou 1 (next)
 */
function navigate(direction) {
  currentImageIndex += direction;
  
  // Boucle
  if (currentImageIndex < 0) {
    currentImageIndex = images.length - 1;
  } else if (currentImageIndex >= images.length) {
    currentImageIndex = 0;
  }
  
  openLightbox(currentImageIndex);
}