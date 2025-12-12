/**
 * Video Component
 * ===============
 * Détecte et initialise le player vidéo (YouTube, Vimeo, ou HTML5)
 */

import { $ } from '../utils/dom.js';

/**
 * Initialise le lecteur vidéo
 * @param {string} videoUrl - URL de la vidéo
 */
export function initVideo(videoUrl) {
  if (!videoUrl) {
    console.log('Pas de vidéo configurée');
    return;
  }
  
  const player = $('#videoPlayer');
  if (!player) return;
  
  let videoHTML = '';
  
  // Détecte le type de vidéo
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    // YouTube
    videoHTML = `<iframe src="${videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  } else if (videoUrl.includes('vimeo.com')) {
    // Vimeo
    videoHTML = `<iframe src="${videoUrl}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  } else if (videoUrl.match(/\.(mp4|mov|webm|ogg)$/i)) {
    // Vidéo directe HTML5
    videoHTML = `<video controls preload="metadata" playsinline><source src="${videoUrl}" type="video/mp4"></video>`;
  } else {
    // URL iframe générique
    videoHTML = `<iframe src="${videoUrl}" frameborder="0" allowfullscreen></iframe>`;
  }
  
  player.innerHTML = videoHTML;
  console.log('OK Video initialisee');
}