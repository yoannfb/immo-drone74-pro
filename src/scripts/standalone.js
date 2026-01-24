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
    
    container.innerHTML = '';
    
    videos.forEach(function(video, index) {
      var wrapper = document.createElement('div');
      wrapper.className = 'video__wrapper';
      
      if (video.title) {
        var title = document.createElement('h3');
        title.className = 'video__title';
        title.textContent = video.title;
        wrapper.appendChild(title);
      }
      
      var aspectContainer = document.createElement('div');
      aspectContainer.className = 'video-section__aspect';
      
      var iframe = document.createElement('iframe');
      var videoUrl = video.url;
      if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
        videoUrl += (videoUrl.includes('?') ? '&' : '?') + 'rel=0&modestbranding=1&showinfo=0';
      }
      iframe.src = videoUrl;
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

      if (image.alt) {
        var caption = document.createElement('div');
        caption.className = 'gallery__caption';
        caption.textContent = image.alt;
        item.appendChild(caption);
      }
      
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
  // FEATURES - Bulles animées
  // ========================================
  
  function initFeaturesBubbles(features) {
    if (!features || !features.length) {
      console.log('Pas de features');
      return;
    }
    
    var container = document.querySelector('.features__bubbles');
    if (!container) {
      console.log('Container features non trouvé');
      return;
    }
    
    container.innerHTML = '';
    
    features.forEach(function(feature, index) {
      var textLength = (feature.label || '').length + (feature.value || '').length;
      var sizeClass;
      
      if (textLength < 20) {
        sizeClass = 'small';
      } else if (textLength < 35) {
        sizeClass = 'medium';
      } else {
        sizeClass = 'large';
      }
      
      var bubble = document.createElement('div');
      bubble.className = 'feature-bubble feature-bubble--' + sizeClass;
      
      var emoji = '🏠';
      var labelLower = (feature.label || '').toLowerCase();
      
      if (labelLower.includes('terrasse') || labelLower.includes('balcon')) emoji = '🏡';
      if (labelLower.includes('terrain') || labelLower.includes('jardin')) emoji = '🌳';
      if (labelLower.includes('piscine')) emoji = '🏊';
      if (labelLower.includes('cellier') || labelLower.includes('cave')) emoji = '🍷';
      if (labelLower.includes('garage')) emoji = '🚗';
      if (labelLower.includes('grenier') || labelLower.includes('comble')) emoji = '📦';
      
      var icon = document.createElement('div');
      icon.className = 'feature-bubble__icon';
      icon.textContent = emoji;
      
      var value = document.createElement('div');
      value.className = 'feature-bubble__value';
      value.textContent = feature.value;
      
      var label = document.createElement('div');
      label.className = 'feature-bubble__label';
      label.textContent = feature.label;
      
      bubble.appendChild(icon);
      bubble.appendChild(value);
      bubble.appendChild(label);
      
      container.appendChild(bubble);
    });
    
    console.log('Features bulles initialisées:', features.length);
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
  // HOME STAGING
  // ========================================
  
  function initHomeStaging(homeStagingData) {
    if (!homeStagingData || !homeStagingData.length) return;

    var container = document.getElementById('homeStagingGrid');
    if (!container) return;

    homeStagingData.forEach(function(item) {
      if (!item.styles || !item.styles.length) return;

      item.styles.forEach(function(style) {
        var comparator = document.createElement('div');
        comparator.className = 'staging-comparator reveal';

        var title = document.createElement('h3');
        title.className = 'staging-comparator__title';
        title.textContent = item.room + ' - ' + style.name;

        var subtitle = document.createElement('p');
        subtitle.className = 'staging-comparator__subtitle';
        subtitle.textContent = style.description || 'Transformation virtuelle';

        var slider = document.createElement('div');
        slider.className = 'staging-slider';

        var beforeDiv = document.createElement('div');
        beforeDiv.className = 'staging-slider__before';
        var beforeImg = document.createElement('img');
        beforeImg.src = style.before;
        beforeImg.alt = 'Avant - ' + item.room;
        beforeDiv.appendChild(beforeImg);

        var afterDiv = document.createElement('div');
        afterDiv.className = 'staging-slider__after';
        var afterImg = document.createElement('img');
        afterImg.src = style.after;
        afterImg.alt = 'Après - ' + style.name;
        afterDiv.appendChild(afterImg);

        var divider = document.createElement('div');
        divider.className = 'staging-slider__divider';

        var handle = document.createElement('div');
        handle.className = 'staging-slider__handle';

        var labelBefore = document.createElement('div');
        labelBefore.className = 'staging-slider__label staging-slider__label--before';
        labelBefore.textContent = 'Avant';

        var labelAfter = document.createElement('div');
        labelAfter.className = 'staging-slider__label staging-slider__label--after';
        labelAfter.textContent = 'Après';

        var instructions = document.createElement('p');
        instructions.className = 'staging-instructions';
        instructions.textContent = '← Glissez le curseur pour comparer →';

        slider.appendChild(beforeDiv);
        slider.appendChild(afterDiv);
        slider.appendChild(divider);
        slider.appendChild(handle);
        slider.appendChild(labelBefore);
        slider.appendChild(labelAfter);

        comparator.appendChild(title);
        comparator.appendChild(subtitle);
        comparator.appendChild(slider);
        comparator.appendChild(instructions);

        container.appendChild(comparator);

        initSliderInteraction(slider, afterDiv, divider, handle);
      });
    });

    console.log('Home Staging initialisé');
  }

  function initSliderInteraction(slider, afterDiv, divider, handle) {
    var isDragging = false;

    function updateSlider(x) {
      var rect = slider.getBoundingClientRect();
      var position = ((x - rect.left) / rect.width) * 100;
      position = Math.max(0, Math.min(100, position));
      afterDiv.style.clipPath = 'polygon(0 0, ' + position + '% 0, ' + position + '% 100%, 0 100%)';
      divider.style.left = position + '%';
      handle.style.left = position + '%';
    }

    function handleMove(e) {
      if (!isDragging) return;
      var x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      updateSlider(x);
    }

    function startDrag(e) {
      isDragging = true;
      slider.classList.add('is-dragging');
      var x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
      updateSlider(x);
      e.preventDefault();
    }

    function stopDrag() {
      isDragging = false;
      slider.classList.remove('is-dragging');
    }

    slider.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', stopDrag);
    slider.addEventListener('touchstart', startDrag, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', stopDrag);

    slider.addEventListener('mouseenter', function() {
      handle.style.transform = 'translate(-50%, -50%) scale(1.1)';
    });

    slider.addEventListener('mouseleave', function() {
      if (!isDragging) {
        handle.style.transform = 'translate(-50%, -50%) scale(1)';
      }
    });
  }
  
  // ========================================
  // NAVBAR
  // ========================================
  
  function initNavbar() {
    var navbar = document.querySelector('.navbar');
    var toggle = document.querySelector('.navbar__toggle');
    var menu = document.querySelector('.navbar__menu');
    var links = document.querySelectorAll('.navbar__link');
    
    if (!navbar) return;

    if (toggle && menu) {
      toggle.addEventListener('click', function() {
        toggle.classList.toggle('is-active');
        menu.classList.toggle('is-open');
      });

      links.forEach(function(link) {
        link.addEventListener('click', function() {
          if (window.innerWidth <= 768) {
            toggle.classList.remove('is-active');
            menu.classList.remove('is-open');
          }
        });
      });

      document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          if (!navbar.contains(e.target)) {
            toggle.classList.remove('is-active');
            menu.classList.remove('is-open');
          }
        }
      });
    }

    var lastScrollNav = 0;
    window.addEventListener('scroll', function() {
      var currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        navbar.classList.add('navbar--scrolled');
      } else {
        navbar.classList.remove('navbar--scrolled');
      }

      lastScrollNav = currentScroll;
    });

    function updateActiveLink() {
      var scrollPos = window.pageYOffset + 150;

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

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    console.log('Navbar initialisée');
  }
  
  // ========================================
  // POPULATE CONTENT
  // ========================================
  
  function populateContent(config) {
    var heroTitle = document.getElementById('propertyTitle');
    if (heroTitle && config.property && config.property.title) {
      heroTitle.textContent = config.property.title;
    }
    
    var heroLocation = document.getElementById('propertyLocation');
    if (heroLocation && config.property && config.property.location) {
      heroLocation.innerHTML = '<svg class="hero__location-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>' + config.property.location;
    }
    
    var heroPrice = document.getElementById('propertyPrice');
    if (heroPrice && config.property && config.property.price) {
      heroPrice.textContent = config.property.price;
    }
    
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
    
    if (config.media && config.media.videos) {
      initVideo(config.media.videos);
    }
    
    if (document.title && config.property && config.property.title) {
      document.title = config.property.title + ' - ' + (config.property.location || '');
    }
    
    if (config.features && config.features.length > 0) {
      initFeaturesBubbles(config.features);
    }
    
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
    
    if (config.property && config.property.description) {
      var description = config.property.description;
      
      var introDiv = document.getElementById('descriptionIntro');
      if (introDiv && description.intro) {
        introDiv.textContent = description.intro;
      }
      
      var textDiv = document.getElementById('descriptionText');
      if (textDiv && description.paragraphs) {
        textDiv.innerHTML = '';
        description.paragraphs.forEach(function(para) {
          var p = document.createElement('p');
          p.textContent = para;
          textDiv.appendChild(p);
        });
      }
      
      var highlightsGrid = document.getElementById('highlightsGrid');
      if (highlightsGrid && description.highlights) {
        highlightsGrid.innerHTML = '';
        description.highlights.forEach(function(highlight) {
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
    // Formulaire de contact
function initContactForm(config) {
  var form = document.getElementById('contactForm');
  if (!form) return;
  
  var bienRef = document.getElementById('bienReference');
  if (bienRef && config && config.property) {
    var reference = config.property.title + ' - ' + (config.property.location || '');
    bienRef.value = reference;
  }
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    var submitBtn = form.querySelector('.form__submit');
    var successMsg = document.getElementById('formSuccess');
    var errorMsg = document.getElementById('formError');
    
    successMsg.style.display = 'none';
    errorMsg.style.display = 'none';
    
    submitBtn.disabled = true;
    submitBtn.querySelector('.form__submit-text').textContent = 'Envoi en cours...';
    
    var formData = new FormData(form);
    
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
    .then(function(response) {
      if (response.ok) {
        successMsg.style.display = 'flex';
        form.reset();
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        submitBtn.disabled = false;
        submitBtn.querySelector('.form__submit-text').textContent = 'Envoyer le message';
      } else {
        throw new Error('Erreur réseau');
      }
    })
    .catch(function(error) {
      console.error('Erreur formulaire:', error);
      errorMsg.style.display = 'flex';
      submitBtn.disabled = false;
      submitBtn.querySelector('.form__submit-text').textContent = 'Envoyer le message';
    });
  });
  
  console.log('Formulaire de contact initialisé');
}

initContactForm(config);
    }
    // Performance énergétique
if (config.energyPerformance) {
  console.log('Initialisation Energy...');
  
  var ep = config.energyPerformance;
  
  // DPE
  if (ep.dpe) {
    var dpeValue = document.getElementById('dpeValue');
    if (dpeValue) {
      dpeValue.textContent = ep.dpe.value + ' ' + ep.dpe.unit;
    }
    
    // Active la bonne barre DPE
    var dpeBars = document.querySelectorAll('#dpeScale .energy__bar');
    dpeBars.forEach(function(bar) {
      bar.classList.remove('energy__bar--active');
      if (bar.getAttribute('data-rating') === ep.dpe.rating) {
        bar.classList.add('energy__bar--active');
        console.log('DPE:', ep.dpe.rating, 'activé');
      }
    });
  }
  
  // GES
  if (ep.ges) {
    var gesValue = document.getElementById('gesValue');
    if (gesValue) {
      gesValue.textContent = ep.ges.value + ' ' + ep.ges.unit;
    }
    
    // Active la bonne barre GES
    var gesBars = document.querySelectorAll('#gesScale .energy__bar');
    gesBars.forEach(function(bar) {
      bar.classList.remove('energy__bar--active');
      if (bar.getAttribute('data-rating') === ep.ges.rating) {
        bar.classList.add('energy__bar--active');
        console.log('GES:', ep.ges.rating, 'activé');
      }
    });
  }
  
  console.log('Energy initialisé');
}
  }
  
  // ========================================
  // INITIALISATION
  // ========================================
  
  function init() {
    console.log('Initialisation...');
    
    var config = loadConfig();
    if (!config) {
      console.error('Impossible de charger la config');
      return;
    }
    
    if (config.agency) {
      applyAgencyColors(config.agency);
    }
    
    populateContent(config);
    
    if (config.homeStaging) {
      initHomeStaging(config.homeStaging);
    }
    // Disclaimer Home Staging
if (config.homeStagingDisclaimer) {
  var container = document.getElementById('homeStagingGrid');
  if (container) {
    var disclaimer = document.createElement('div');
    disclaimer.className = 'home-staging__disclaimer';
    disclaimer.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg><div class="home-staging__disclaimer-content"><strong>Avertissement important</strong><p>' + config.homeStagingDisclaimer + '</p></div>';
    container.appendChild(disclaimer);
  }
}
    
    initHeader();
    initNavbar();
    
    if (config.media && config.media.gallery) {
      initGallery(config.media.gallery);
    }
    
    initScrollAnimations();
    
    console.log('Initialisation terminée');
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
})();