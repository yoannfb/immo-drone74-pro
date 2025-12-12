/*
*

 
*
 Map Component
 
*
 =============
 
*
 Gestion Google Maps + proximités
 */
import { $, createElement } from '../utils/dom.js';
/*
*

 
*
 Initialise la carte
 
*
 @param {string} mapUrl - URL embed Google Maps
 */
export function initMap(mapUrl) {
  if (!mapUrl) {
    console.warn('⚠️ Pas de carte configurée');
    const mapSection = $('#map');
    if (mapSection) {
      mapSection.style.display = 'none';
    }
    return;
  }
  const container = $('#mapContainer');
  if (!container) return;
  container.innerHTML = 
`<iframe src="${mapUrl}" width="100%" height="500" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
;
  console.log('✅ Carte initialisée');
}
/*
*

 
*
 Initialise les proximités
 
*
 @param {Array} proximityItems - Tableau {label, distance}
 */
export function initProximity(proximityItems) {
  if (!proximityItems || proximityItems.length === 0) {
    const proximitySection = $('#proximitySection');
    if (proximitySection) {
      proximitySection.style.display = 'none';
    }
    return;
  }
  const grid = $('#proximityGrid');
  if (!grid) return;
  proximityItems.forEach((item, index) => {
    const element = createElement('div', {
      className: 
`proximity__item reveal stagger-${(index % 3) + 1}`

    });
    element.innerHTML = `
      <span class="proximity__label">${item.label}</span>
      <span class="proximity__distance">${item.distance}</span>
    `;

    grid.appendChild(element);

  });
  console.log(
`✅ ${proximityItems.length} proximités initialisées`
);
}
