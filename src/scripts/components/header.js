/**

Header Component
================
Gestion du header (scroll behavior, sticky)
*/

import { addClass, removeClass } from '../utils/dom.js';
/**

Initialise le header
*/
export function initHeader() {
const header = document.getElementById('header');
if (!header) return;

let lastScroll = 0;
const scrollThreshold = 100;
window.addEventListener('scroll', () => {
const currentScroll = window.pageYOffset;
// Ajoute classe scrolled si scroll > 50px
if (currentScroll > 50) {
  addClass(header, 'scrolled');
} else {
  removeClass(header, 'scrolled');
}

// Cache le header en scrollant vers le bas, montre en scrollant vers le haut
if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
  // Scroll down
  addClass(header, 'hidden');
} else {
  // Scroll up
  removeClass(header, 'hidden');
}

lastScroll = currentScroll;
});
console.log('✅ Header initialisé');
}
/**

Remplit les infos du header avec les données
@param {Object} config - Configuration complète
*/
export function populateHeader(config) {
const { agency, droneService } = config;

// Logo agence
if (agency?.logo) {
const logo = document.getElementById('agencyLogo');
const logoLink = document.getElementById('agencyLogoLink');
if (logo) {
  logo.src = agency.logo;
  logo.alt = `Logo ${agency.name}`;
}

if (logoLink && agency.website) {
  logoLink.href = agency.website;
  logoLink.target = '_blank';
  logoLink.rel = 'noopener noreferrer';
}
}
// Badge drone
if (droneService?.showBranding && droneService?.name) {
const droneServiceName = document.getElementById('droneServiceName');
if (droneServiceName) {
droneServiceName.textContent = droneService.name;
}
} else {
// Cache le badge si pas de branding
const droneBadge = document.getElementById('droneBadge');
if (droneBadge) {
droneBadge.style.display = 'none';
}
}
}