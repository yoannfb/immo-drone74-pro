/**
 * SCRIPT STANDALONE - Tous les JS en un seul fichier
 * ===================================================
 * Sans modules ES6, sans backticks problématiques
 */

(function() {
  'use strict';
  
  // ========================================
  // UTILITAIRES DOM
  // ========================================
  
  function $(selector) {
    return document.querySelector(selector);
  }
  
  function $$(selector) {
    return document.querySelectorAll(selector);
  }
  
  // ========================================
  // CONFIGURATION
  // ========================================
  
  function loadConfig() {
    try {
      var configScript = document.getElementById('property-config');
      if (!configScript) {
        console.error('Configuration non trouvée');
        return null;
      }
      
      var config = JSON.parse(configScript.textContent.trim());
      console.log('Configuration chargée');
      return config;
    } catch (error) {
      console.error('Erreur config:', error);
      return null;
    }
  }
  
  function applyAgencyColors(agency) {
    if (!agency) return;
    
    var root = document.documentElement;
    
    if (agency.primaryColor) {
      root.style.setProperty('--color-primary', agency.primaryColor);
    }
    
    if (agency.accentColor) {
      root.style.setProperty('--color-accent', agency.accentColor);
    }
  }
  
  // ========================================
  // VIDEO
  // ========================================
  
  // NOUVELLE VERSION - Support multi-vidéos
function initVideo(videos) {
  if (!videos || !videos.length) {
    console.log('Pas de vidéos');
    return;
  }
  
  var container = document.getElementById('videoContainer');
  if (!container) {
    console.log('Container vidéo non trouvé');
    return;
  }
  
  container.innerHTML = ''; // Vide le container
  
  // Crée une vidéo pour chaque élément du tableau
  videos.forEach(function(video, index) {
    // Wrapper pour chaque vidéo
    var wrapper = document.createElement('div');
    wrapper.className = 'video__wrapper';
    
    // Titre de la vidéo (optionnel)
    if (video.title) {
      var title = document.createElement('h3');
      title.className = 'video__title';
      title.textContent = video.title;
      wrapper.appendChild(title);
    }
    
    // Container avec aspect ratio
    var aspectContainer = document.createElement('div');
    aspectContainer.className = 'video-section__aspect';
    
    // Iframe
    var iframe = document.createElement('iframe');
    iframe.src = video.url;
    iframe.className = 'video__iframe';
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    
    aspectContainer.appendChild(iframe);
    wrapper.appendChild(aspectContainer);
    container.appendChild(wrapper);
  });
  
  console.log('Vidéos initialisées:', videos.length);
}
  
  // ========================================
  // HEADER
  // ========================================
  
  var lastScroll = 0;
  
  function initHeader() {
    var header = $('.header');
    if (!header) return;
    
    window.addEventListener('scroll', function() {
      var currentScroll = window.pageYOffset;
      
      if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('hidden');
      } else {
        header.classList.remove('hidden');
      }
      
      lastScroll = currentScroll;
    });
  }
  
  // ========================================
  // GALERIE + LIGHTBOX
  
  
  // ========================================
  // ANIMATIONS SCROLL
  // ========================================
  
  function initScrollAnimations() {
    var reveals = $$('.reveal');
    
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });
    
    reveals.forEach(function(element) {
      observer.observe(element);
    });
  }
  
  // ========================================
  // POPULATE CONTENT
  // ========================================
  
  function populateContent(config) {
    // Titre principal (Hero)
    var heroTitle = document.getElementById('propertyTitle');
    if (heroTitle && config.property && config.property.title) {
      heroTitle.textContent = config.property.title;
    }
    
    // Localisation (Hero)
    var heroLocation = document.getElementById('propertyLocation');
    if (heroLocation && config.property && config.property.location) {
      heroLocation.innerHTML = '<svg class="hero__location-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>' + config.property.location;
    }
    
    // Prix (Hero)
    var heroPrice = document.getElementById('propertyPrice');
    if (heroPrice && config.property && config.property.price) {
      heroPrice.textContent = config.property.price;
    }
    
    // Image/Vidéo Hero
    var heroMedia = document.getElementById('heroMedia');
    if (heroMedia && config.media) {
      if (config.media.heroImage) {
        var img = document.createElement('img');
        img.className = 'hero__image';
        img.src = config.media.heroImage;
        img.alt = config.property.title || 'Image principale';
        heroMedia.appendChild(img);
      }
    }
    
    // VIDÉOS - appelé depuis init()
    // Meta title
    if (config.property && config.property.title) {
      document.title = config.property.title + ' - ' + (config.property.location || '');
    }
    
    // Features - Bulles animées
if (config.features && config.features.length > 0) {
  var featuresContainer = document.querySelector('.features__bubbles');
  if (featuresContainer) {
    featuresContainer.innerHTML = '';
    
    // Tailles variées
    var sizes = ['small', 'medium', 'large'];
    
    config.features.forEach(function(feature, index) {
      // Alterne les tailles
      var sizeClass = sizes[index % sizes.length];
      
      // Crée la bulle
      var bubble = document.createElement('div');
      bubble.className = 'feature-bubble feature-bubble--' + sizeClass + ' reveal';
      
      // Choix de l'icône selon le label (ton code existant)
      var emoji = '🏠';
      var value = feature.value.toLowerCase();

      console.log('Label original:', feature.value);
      console.log('Label lowercase:', value);
      
      if (value.includes('habitable') || value.includes('superficie')) emoji = '📐';
      if (value.includes('terrain')) emoji = '🌳';
      if (value.includes('chambre')) emoji = '🛏️';
      if (value.includes('salle') || value.includes('bain')) emoji = '🚿';
      if (value.includes('annee') || value.includes('construction')) emoji = '📅';
      if (value.includes('garage')) emoji = '🚗';
      if (value.includes('piscine')) emoji = '🏊';
      if (value.includes('etage') || value.includes('étage')) emoji = '🏢';
      if (value.includes('piece') || value.includes('pièce')) emoji = '🚪';
      if (value.includes('terrasse')) emoji = '🏡';
      if (value.includes('cave') || value.includes('cellier')) emoji = '🍷';
      if (value.includes('grenier')) emoji = '📦';
      
      // Icône
      var icon = document.createElement('div');
      icon.className = 'feature-bubble__icon';
      icon.textContent = emoji;
      
      // Valeur
      var value = document.createElement('div');
      value.className = 'feature-bubble__value';
      value.textContent = feature.value;
      
      // Label
      var labelDiv = document.createElement('div');
      labelDiv.className = 'feature-bubble__label';
      labelDiv.textContent = feature.label;
      
      // Assemble
      bubble.appendChild(icon);
      bubble.appendChild(value);
      bubble.appendChild(labelDiv);
      
      featuresContainer.appendChild(bubble);
    });
    
    console.log('Features bulles initialisées:', config.features.length);
  }
}
    
    // Amenities
    if (config.amenities && config.amenities.length > 0) {
      var amenitiesList = $('#amenitiesList');
      if (amenitiesList) {
        amenitiesList.innerHTML = '';
        config.amenities.forEach(function(amenity) {
          var item = document.createElement('div');
          item.className = 'amenities__item reveal';
          
          var icon = document.createElement('span');
          icon.className = 'amenities__icon';
          icon.textContent = '✓';
          
          var text = document.createTextNode(' ' + amenity);
          
          item.appendChild(icon);
          item.appendChild(text);
          amenitiesList.appendChild(item);
        });
      }
    }
    
    // Proximity
    if (config.proximity && config.proximity.items) {
      var proximityGrid = document.getElementById('proximityGrid');
      if (proximityGrid) {
        proximityGrid.innerHTML = '';
        config.proximity.items.forEach(function(item) {
          var div = document.createElement('div');
          div.className = 'proximity__item reveal';
          
          var label = document.createElement('span');
          label.className = 'proximity__label';
          label.textContent = item.label;
          
          var distance = document.createElement('span');
          distance.className = 'proximity__distance';
          distance.textContent = item.distance;
          
          div.appendChild(label);
          div.appendChild(distance);
          proximityGrid.appendChild(div);
        });
      }
    }
    
    // Google Maps
    if (config.location && config.location.mapUrl) {
      var mapContainer = document.getElementById('mapContainer');
      if (mapContainer) {
        var iframe = document.createElement('iframe');
        iframe.className = 'map__frame';
        iframe.src = config.location.mapUrl;
        iframe.width = '100%';
        iframe.height = '450';
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        mapContainer.appendChild(iframe);
        console.log('Carte initialisée');
      }
    }
    // Description
if (config.property && config.property.description) {
  var description = config.property.description;
  
  // Intro
  var introDiv = document.getElementById('descriptionIntro');
  if (introDiv && description.intro) {  // ← description au lieu de config.description
    introDiv.textContent = description.intro;
  }
  
  // Paragraphes
  var textDiv = document.getElementById('descriptionText');
  if (textDiv && description.paragraphs) {  // ← description
    textDiv.innerHTML = '';
    description.paragraphs.forEach(function(para) {  // ← description
      var p = document.createElement('p');
      p.textContent = para;
      textDiv.appendChild(p);
    });
  }
  
  // Points forts
  var highlightsGrid = document.getElementById('highlightsGrid');
  if (highlightsGrid && description.highlights) {  // ← description
    highlightsGrid.innerHTML = '';
    description.highlights.forEach(function(highlight) {  // ← description
      var item = document.createElement('div');
      item.className = 'description__highlight-item';
      
      var icon = document.createElement('div');
      icon.className = 'description__highlight-icon';
      icon.textContent = '✓';
      
      var text = document.createTextNode(highlight);
      
      item.appendChild(icon);
      item.appendChild(text);
      highlightsGrid.appendChild(item);
    });
  }
}
  }
  
  // ========================================
  // INITIALISATION
  // ========================================
  
  function init() {
    console.log('Initialisation...');
    
    // Charge config
    var config = loadConfig();
    if (!config) {
      console.error('Impossible de charger la config');
      return;
    }
    
    // Applique couleurs agence
    if (config.agency) {
      applyAgencyColors(config.agency);
    }
    
    // Populate content
    populateContent(config);
    // Home Staging
      if (config.homeStaging) {
        initHomeStaging(config.homeStaging);
      }
    
    // Init composants
    initHeader();
    
    if (config.media && config.media.videos) {
      initVideo(config.media.videos);
    }
    
    if (config.media && config.media.gallery) {
      initGallery(config.media.gallery);
    }
    
    // Animations
    initScrollAnimations();
    
    console.log('Initialisation terminée');
  }
  
  // Lance l'initialisation quand le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  /**
 * HOME STAGING - Sliders comparaison avant/après
 * ==============================================
 */

function initHomeStaging(homeStagingData) {
  if (!homeStagingData || !homeStagingData.length) return;

  var container = document.getElementById('homeStagingGrid');
  if (!container) return;

  homeStagingData.forEach(function(item) {
    if (!item.styles || !item.styles.length) return;

    item.styles.forEach(function(style) {
      // Crée le comparateur
      var comparator = document.createElement('div');
      comparator.className = 'staging-comparator reveal';

      // Titre
      var title = document.createElement('h3');
      title.className = 'staging-comparator__title';
      title.textContent = item.room + ' - ' + style.name;

      // Sous-titre (optionnel)
      var subtitle = document.createElement('p');
      subtitle.className = 'staging-comparator__subtitle';
      subtitle.textContent = style.description || 'Transformation virtuelle';

      // Container du slider
      var slider = document.createElement('div');
      slider.className = 'staging-slider';

      // Image avant
      var beforeDiv = document.createElement('div');
      beforeDiv.className = 'staging-slider__before';
      var beforeImg = document.createElement('img');
      beforeImg.src = style.before;
      beforeImg.alt = 'Avant - ' + item.room;
      beforeDiv.appendChild(beforeImg);

      // Image après
      var afterDiv = document.createElement('div');
      afterDiv.className = 'staging-slider__after';
      var afterImg = document.createElement('img');
      afterImg.src = style.after;
      afterImg.alt = 'Après - ' + style.name;
      afterDiv.appendChild(afterImg);

      // Ligne de séparation
      var divider = document.createElement('div');
      divider.className = 'staging-slider__divider';

      // Curseur
      var handle = document.createElement('div');
      handle.className = 'staging-slider__handle';

      // Labels dynamiques (apparaissent selon la position du curseur)
      var labelBefore = document.createElement('div');
      labelBefore.className = 'staging-slider__label staging-slider__label--before';
      labelBefore.textContent = 'Avant';
      labelBefore.style.opacity = '0';
      labelBefore.style.transition = 'opacity 0.3s ease';

      var labelAfter = document.createElement('div');
      labelAfter.className = 'staging-slider__label staging-slider__label--after';
      labelAfter.textContent = 'Après';
      labelAfter.style.opacity = '0';
      labelAfter.style.transition = 'opacity 0.3s ease';

      // Instructions
      var instructions = document.createElement('p');
      instructions.className = 'staging-instructions';
      instructions.textContent = '← Glissez le curseur pour comparer →';

      // Assemble le slider
      slider.appendChild(beforeDiv);
      slider.appendChild(afterDiv);
      slider.appendChild(divider);
      slider.appendChild(handle);
      slider.appendChild(labelBefore);
      slider.appendChild(labelAfter);

      // Assemble le comparateur
      comparator.appendChild(title);
      comparator.appendChild(subtitle);
      comparator.appendChild(slider);
      comparator.appendChild(instructions);

      container.appendChild(comparator);

      // Initialise l'interactivité
      initSliderInteraction(slider, afterDiv, divider, handle, labelBefore, labelAfter);
    });
  });

  console.log('Home Staging initialisé');
}

function initSliderInteraction(slider, afterDiv, divider, handle, labelBefore, labelAfter) {
  var isDragging = false;

  function updateSlider(x) {
    var rect = slider.getBoundingClientRect();
    var position = ((x - rect.left) / rect.width) * 100;
    
    // Limite entre 0 et 100
    position = Math.max(0, Math.min(100, position));

    // AVANT = gauche (visible par défaut en dessous)
    // APRÈS = droite → on clip "après" pour qu'il n'apparaisse qu'à droite du curseur
    // polygon: from position% to 100% (côté droit)
    afterDiv.style.clipPath = 'polygon(' + position + '% 0, 100% 0, 100% 100%, ' + position + '% 100%)';
    
    // Met à jour la position du diviseur et du curseur
    divider.style.left = position + '%';
    handle.style.left = position + '%';

    // --- LOGIQUE LABELS DYNAMIQUES ---
    // "Avant" apparaît quand la partie gauche (avant) est découverte à 80% → position >= 80
    // "Après" apparaît quand la partie droite (après) est découverte à 80% → position <= 20
    if (position >= 80) {
      labelBefore.style.opacity = '1';
    } else {
      labelBefore.style.opacity = '0';
    }

    if (position <= 20) {
      labelAfter.style.opacity = '1';
    } else {
      labelAfter.style.opacity = '0';
    }
  }

  function handleMove(e) {
    if (!isDragging) return;
    
    var x;
    if (e.type.includes('touch')) {
      x = e.touches[0].clientX;
    } else {
      x = e.clientX;
    }
    
    updateSlider(x);
  }

  function startDrag(e) {
    isDragging = true;
    slider.classList.add('is-dragging');
    
    var x;
    if (e.type.includes('touch')) {
      x = e.touches[0].clientX;
    } else {
      x = e.clientX;
    }
    
    updateSlider(x);
    e.preventDefault();
  }

  function stopDrag() {
    isDragging = false;
    slider.classList.remove('is-dragging');
  }

  // Events souris
  slider.addEventListener('mousedown', startDrag);
  document.addEventListener('mousemove', handleMove);
  document.addEventListener('mouseup', stopDrag);

  // Events tactiles (mobile)
  slider.addEventListener('touchstart', startDrag, { passive: false });
  document.addEventListener('touchmove', handleMove, { passive: false });
  document.addEventListener('touchend', stopDrag);

  // Hover effet
  slider.addEventListener('mouseenter', function() {
    handle.style.transform = 'translate(-50%, -50%) scale(1.1)';
  });

  slider.addEventListener('mouseleave', function() {
    if (!isDragging) {
      handle.style.transform = 'translate(-50%, -50%) scale(1)';
    }
  });
}

// Export pour utilisation dans populateContent
window.initHomeStaging = initHomeStaging;

/**
 * NAVBAR - Navigation sticky avec ancres
 * ======================================
 */

function initNavbar() {
  var navbar = document.querySelector('.navbar');
  var toggle = document.querySelector('.navbar__toggle');
  var menu = document.querySelector('.navbar__menu');
  var links = document.querySelectorAll('.navbar__link');
  
  if (!navbar) return;

  // Toggle menu mobile
  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      toggle.classList.toggle('is-active');
      menu.classList.toggle('is-open');
    });

    // Ferme le menu au clic sur un lien
    links.forEach(function(link) {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 768) {
          toggle.classList.remove('is-active');
          menu.classList.remove('is-open');
        }
      });
    });

    // Ferme le menu au clic extérieur
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        if (!navbar.contains(e.target)) {
          toggle.classList.remove('is-active');
          menu.classList.remove('is-open');
        }
      }
    });
  }

  // Effet scroll (navbar plus compacte)
  var lastScroll = 0;
  window.addEventListener('scroll', function() {
    var currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    lastScroll = currentScroll;
  });

  // Active le lien correspondant à la section visible
  function updateActiveLink() {
    var scrollPos = window.pageYOffset + 150; // Offset pour la navbar

    links.forEach(function(link) {
      var href = link.getAttribute('href');
      if (!href || href === '#') return;

      var sectionId = href.replace('#', '');
      var section = document.getElementById(sectionId);
      
      if (section) {
        var sectionTop = section.offsetTop;
        var sectionBottom = sectionTop + section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          links.forEach(function(l) { l.classList.remove('active'); });
          link.classList.add('active');
        }
      }
    });
  }

  // Update au scroll
  window.addEventListener('scroll', updateActiveLink);
  
  // Update initial
  updateActiveLink();

  console.log('Navbar initialisée');
}

// Initialise au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNavbar);
} else {
  initNavbar();
}
});