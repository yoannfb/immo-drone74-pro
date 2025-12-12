/*
*

 
*
 Main Entry Point
 
*
 ================
 
*
 Initialise tous les composants
 */
import { loadConfig, validateConfig, applyAgencyColors } from './config.js';
import { setText, setAttr, $, createElement } from './utils/dom.js';
import { initScrollAnimations } from './utils/animations.js';
import { initHeader, populateHeader } from './components/header.js';
import { initGallery } from './components/gallery.js';
import { initVideo } from './components/video.js';
import { initMap, initProximity } from './components/map.js';
/*
*

 
*
 Initialise l'application
 */
async function init() {
  console.log('🚀 Initialisation...');
  // 1. Charge la config
  const config = loadConfig();
  if (!validateConfig(config)) {
    console.error('❌ Configuration invalide');
    return;
  }
  // 2. Applique les couleurs de l'agence
  applyAgencyColors(config.agency);
  // 3. Remplit le contenu
  populateContent(config);
  // 4. Init composants
  populateHeader(config);
  initHeader();
  initVideo(config.media?.videoUrl);
  initGallery(config.media?.gallery || []);
  initMap(config.location?.mapUrl);
  initProximity(config.proximity?.items);
  // 5. Init animations
  initScrollAnimations();
  console.log('✅ Initialisation terminée !');
}
/*
*

 
*
 Remplit le contenu de la page
 */
function populateContent(config) {
  const { property, media, features, amenities, agency, location, proximity } = config;
  // Hero
  setText('#propertyTitle', property.title);
  setText('#propertyLocation', property.location);
  setText('#propertyPrice', property.price);
  // Hero media
  const heroMedia = $('#heroMedia');
  if (heroMedia && media.heroImage) {
    heroMedia.innerHTML = 
`<img src="${media.heroImage}" alt="${property.title}" class="hero__image">`
;
  }
  // Features
  if (features && features.length > 0) {
    const grid = $('#featuresGrid');
    if (grid) {
      features.forEach((feature, index) => {
        const item = createElement('div', {
          className: 
`features__item reveal stagger-${(index % 4) + 1}`

        });
        item.innerHTML = `
          
<
div
 
class
=
"
features__icon
"
>

            
<
svg
 
width
=
"
32
"
 
height
=
"
32
"
 
viewBox
=
"
0 0 24 24
"
 
fill
=
"
none
"
 
stroke
=
"
currentColor
"
 
stroke-width
=
"
2
"
>

              
<
rect
 
x
=
"
3
"
 
y
=
"
3
"
 
width
=
"
18
"
 
height
=
"
18
"
 
rx
=
"
2
"
/>

            
</
svg
>

          
</
div
>

          
<
div
 
class
=
"
features__value
"
>
${feature.value}
</
div
>

          
<
div
 
class
=
"
features__label
"
>
${feature.label}
</
div
>

        `;
        grid.appendChild(item);
      });
    }
  }
  // Amenities
  if (amenities && amenities.length > 0) {
    const list = $('#amenitiesList');
    if (list) {
      amenities.forEach(amenity => {
        const item = createElement('div', { className: 'amenities__item reveal' });
        item.innerHTML = `
          
<
svg
 
class
=
"
amenities__icon
"
 
width
=
"
24
"
 
height
=
"
24
"
 
viewBox
=
"
0 0 24 24
"
 
fill
=
"
none
"
 
stroke
=
"
currentColor
"
 
stroke-width
=
"
2
"
>

            
<
polyline
 
points
=
"
20 6 9 17 4 12
"
/>

          
</
svg
>

          
<
span
 
class
=
"
amenities__text
"
>
${amenity}
</
span
>

        `;
        list.appendChild(item);
      });
    }
  }
  // Contact
  const contactButtons = $('#contactButtons');
  if (contactButtons && agency) {
    let buttonsHTML = '';
    if (agency.phone) {
      buttonsHTML += `
        <a href="tel:${agency.phone}" class="contact__button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Appeler
        </a>
      `;
    }

    if (agency.email) {
      buttonsHTML += `
        <a href="mailto:${agency.email}" class="contact__button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          Email
        </a>
      `;
    }

    if (agency.whatsapp) {
      buttonsHTML += `
        <a href="https://wa.me/${agency.whatsapp}" target="_blank" class="contact__button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          WhatsApp
        </a>
      `;
    }

    contactButtons.innerHTML = buttonsHTML;

  }
  // Footer
  setText('#footerAgencyName', agency.name);
  setText('#footerAgencyNameBottom', agency.name);
  setText('#footerAgencyAddress', 
`${agency.address || ''} ${agency.city || ''}`
);
  setAttr('#footerAgencyPhone', 'href', 
`tel:${agency.phone}`
);
  setText('#footerAgencyPhone', agency.phone);
  setAttr('#footerAgencyEmail', 'href', 
`mailto:${agency.email}`
);
  setText('#footerAgencyEmail', agency.email);
  setText('#footerPropertyRef', property.reference);
  setText('#footerPropertyLocation', property.location);
  if (config.droneService?.showBranding) {
    setText('#footerDroneService', config.droneService.name);
  } else {
    const droneCredit = $('#footerDroneCredit');
    if (droneCredit) droneCredit.style.display = 'none';
  }
}
// Init au chargement du DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
