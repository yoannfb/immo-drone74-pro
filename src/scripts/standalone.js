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
  
  function initVideo(videoUrl) {
    if (!videoUrl) {
      console.log('Pas de vidéo');
      return;
    }
    
    var player = $('#videoPlayer');
    if (!player) return;
    
    var iframe = document.createElement('iframe');
    iframe.src = videoUrl;
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    
    player.innerHTML = '';
    player.appendChild(iframe);
    
    console.log('Vidéo initialisée');
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
  
  var currentImageIndex = 0;
  var galleryImages = [];
  
  function initGallery(images) {
    if (!images || images.length === 0) {
      console.log('Pas d\'images');
      return;
    }
    
    galleryImages = images;
    var grid = $('#galleryGrid');
    if (!grid) return;
    
    images.forEach(function(image, index) {
      var item = document.createElement('div');
      item.className = 'gallery__item reveal';
      
      var img = document.createElement('img');
      img.src = image.url;
      img.alt = image.alt || 'Photo du bien';
      img.className = 'gallery__image';
      img.loading = 'lazy';
      
      item.appendChild(img);
      item.addEventListener('click', function() {
        openLightbox(index);
      });
      
      grid.appendChild(item);
    });
    
    initLightbox();
    console.log('Galerie initialisée');
  }
  
  function initLightbox() {
    var lightbox = $('#lightbox');
    var closeBtn = $('#lightboxClose');
    var prevBtn = $('#lightboxPrev');
    var nextBtn = $('#lightboxNext');
    
    if (!lightbox) return;
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeLightbox);
    }
    
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) closeLightbox();
    });
    
    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        navigate(-1);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        navigate(1);
      });
    }
    
    document.addEventListener('keydown', function(e) {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }
  
  function openLightbox(index) {
    currentImageIndex = index;
    var lightbox = $('#lightbox');
    var image = $('#lightboxImage');
    
    if (!lightbox || !image) return;
    
    var currentImage = galleryImages[index];
    image.src = currentImage.url;
    image.alt = currentImage.alt || 'Photo';
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    var lightbox = $('#lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function navigate(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
      currentImageIndex = galleryImages.length - 1;
    } else if (currentImageIndex >= galleryImages.length) {
      currentImageIndex = 0;
    }
    
    openLightbox(currentImageIndex);
  }
  
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
    
    // Image/Vidéo Hero  - DESAVTIVE car géré par le template HTML
    /*
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
      */
    
    // Meta title
    if (config.property && config.property.title) {
      document.title = config.property.title + ' - ' + (config.property.location || '');
    }
    
    // Features
    if (config.features && config.features.length > 0) {
      var featuresGrid = $('#featuresGrid');
      if (featuresGrid) {
        featuresGrid.innerHTML = '';
        config.features.forEach(function(feature) {
          var item = document.createElement('div');
          item.className = 'features__item reveal';
          
          // Choix de l'icône selon le label
          var emoji = '🏠';
          var label = feature.label.toLowerCase();
          
          if (label.includes('habitable') || label.includes('superficie')) emoji = '📐';
          if (label.includes('terrain')) emoji = '🌳';
          if (label.includes('chambre')) emoji = '🛏️';
          if (label.includes('salle') || label.includes('bain')) emoji = '🚿';
          if (label.includes('année') || label.includes('construction')) emoji = '📅';
          if (label.includes('garage')) emoji = '🚗';
          if (label.includes('piscine')) emoji = '🏊';
          if (label.includes('etage')) emoji = '🏢';
          if (label.includes('piece')) emoji = '🚪';
          
          var icon = document.createElement('div');
          icon.className = 'features__icon';
          icon.textContent = emoji;
          icon.style.fontSize = '2.5rem';
          
          var value = document.createElement('div');
          value.className = 'features__value';
          value.textContent = feature.value;
          
          var labelDiv = document.createElement('div');
          labelDiv.className = 'features__label';
          labelDiv.textContent = feature.label;
          
          item.appendChild(icon);
          item.appendChild(value);
          item.appendChild(labelDiv);
          featuresGrid.appendChild(item);
        });
      }
    }
    
// Amenities
    if (config.amenities && config.amenities.length > 0) {
      var amenitiesList = document.getElementById('amenitiesList');
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
    
    // Init composants
    initHeader();
    
    if (config.media && config.media.videoUrl) {
      initVideo(config.media.videoUrl);
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
  
})();