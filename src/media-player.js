import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// ── Media type detection ───────────────────────────────────────────────────

const AUDIO_EXTENSIONS = new Set([
  'mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'opus', 'wma',
]);

const VIDEO_EXTENSIONS = new Set([
  'mp4', 'webm', 'ogv', 'avi', 'mov', 'mkv', 'm4v', 'wmv',
]);

// Hostnames whose share/post URLs are web pages, not direct media files.
// These are rendered as a "click to open" card (CSP blocks most iframes).
const LINK_DOMAINS = new Set([
  'gemini.google.com',
  'grok.com',
  'youtube.com', 'www.youtube.com', 'youtu.be',
  'vimeo.com', 'player.vimeo.com',
  'x.com', 'twitter.com',
  'facebook.com', 'www.facebook.com',
  'instagram.com', 'www.instagram.com',
  'tiktok.com', 'www.tiktok.com',
  'soundcloud.com', 'w.soundcloud.com',
  'spotify.com', 'open.spotify.com',
]);

function detectMediaType(url) {
  if (!url) return 'video';

  // 1. Extension-based detection (fastest, works for direct file URLs)
  const ext = url.split('?')[0].split('.').pop().toLowerCase();
  if (AUDIO_EXTENSIONS.has(ext)) return 'audio';
  if (VIDEO_EXTENSIONS.has(ext)) return 'video';

  // 2. Domain-based detection for known share/social platforms
  try {
    const { hostname } = new URL(url);
    if (LINK_DOMAINS.has(hostname)) return 'link';
  } catch (_) {
    // Malformed URL — fall through to default
  }

  return 'video'; // safe default for unrecognised URLs
}

export function resolveMediaType(url, override) {
  // 'iframe' from the old property value → treat as 'link'
  if (override === 'iframe') return 'link';
  if (override && override !== 'auto') return override;
  return detectMediaType(url);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function showMessage(container, text) {
  const msg = document.createElement('div');
  msg.className = 'senseav-empty';
  msg.textContent = text;
  container.appendChild(msg);
}

// ── DOM construction ───────────────────────────────────────────────────────

/**
 * Build the DOM structure inside `container`, initialise the appropriate
 * player, and return the Video.js instance (or null for link / no-data).
 *
 * Only renders when qHyperCube.qSize.qcy === 1 (exactly one selected value).
 *
 * DOM layout — VIDEO / AUDIO:
 *   .senseav-root.senseav-{video|audio}
 *     ├── .senseav-bg            (audio + bg image only – blurred backdrop)
 *     ├── .senseav-bg-overlay    (audio + bg image only – dark scrim)
 *     └── .senseav-player-wrapper
 *           └── video.video-js
 *
 * DOM layout — LINK (shared post / CSP-blocked page):
 *   .senseav-root.senseav-link
 *     └── a.senseav-open-card
 *           ├── span.senseav-open-icon
 *           ├── span.senseav-open-label
 *           └── span.senseav-open-url
 *
 * @param {HTMLElement} container  The nebula.js root element.
 * @param {Object}      layout     The Qlik Sense layout object.
 * @returns {Object|null}          Video.js player instance, or null.
 */
export function mountPlayer(container, layout) {
  const { qHyperCube } = layout;
  const qcy = qHyperCube?.qSize?.qcy ?? 0;

  // ── Single-value guard ─────────────────────────────────────────────────────
  if (qcy === 0) {
    showMessage(container, 'Add a dimension containing a media URL to get started.');
    return null;
  }
  if (qcy > 1) {
    showMessage(container, 'Select a single value to load media.');
    return null;
  }

  const matrix = qHyperCube?.qDataPages?.[0]?.qMatrix;
  if (!matrix?.length || !matrix[0][0]?.qText) {
    showMessage(container, 'Add a dimension containing a media URL to get started.');
    return null;
  }

  const row = matrix[0];
  const mediaUrl = row[0].qText;

  // Dimension 2 is optional; treat '-' (Qlik null display) as absent
  const rawBg = row.length > 1 ? row[1]?.qText : null;
  const bgImageUrl = rawBg && rawBg !== '-' ? rawBg : null;

  const { mediaTypeOverride, autoplay, loop, muted, showControls } = layout;
  const mediaType = resolveMediaType(mediaUrl, mediaTypeOverride);

  // ── LINK mode (shared post / page — renders a click-to-open card) ──────────
  if (mediaType === 'link') {
    const root = document.createElement('div');
    root.className = 'senseav-root senseav-link';
    container.appendChild(root);

    const card = document.createElement('a');
    card.className = 'senseav-open-card';
    card.href = mediaUrl;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    const icon = document.createElement('span');
    icon.className = 'senseav-open-icon';
    icon.textContent = '⧉';

    const label = document.createElement('span');
    label.className = 'senseav-open-label';
    label.textContent = 'Click to open media';

    const urlDisplay = document.createElement('span');
    urlDisplay.className = 'senseav-open-url';
    urlDisplay.textContent = mediaUrl;

    card.appendChild(icon);
    card.appendChild(label);
    card.appendChild(urlDisplay);
    root.appendChild(card);

    return null;
  }

  // ── AUDIO / VIDEO mode ─────────────────────────────────────────────────────
  const isAudio = mediaType === 'audio';
  const hasBg = isAudio && !!bgImageUrl;

  const root = document.createElement('div');
  root.className = `senseav-root senseav-${isAudio ? 'audio' : 'video'}`;
  container.appendChild(root);

  // Background image layers (audio with bg image only)
  if (hasBg) {
    const bg = document.createElement('div');
    bg.className = 'senseav-bg';
    bg.style.backgroundImage = `url("${bgImageUrl.replace(/\\/g, '/').replace(/"/g, '%22')}")`;
    root.appendChild(bg);

    const overlay = document.createElement('div');
    overlay.className = 'senseav-bg-overlay';
    root.appendChild(overlay);
  }

  // Player wrapper + video element
  const playerWrapper = document.createElement('div');
  playerWrapper.className = 'senseav-player-wrapper';
  root.appendChild(playerWrapper);

  const videoEl = document.createElement('video');
  videoEl.className = 'video-js vjs-default-skin';
  playerWrapper.appendChild(videoEl);

  const player = videojs(videoEl, {
    controls: showControls !== false,
    autoplay: !!autoplay,
    loop: !!loop,
    muted: !!muted,
    fill: !isAudio,   // fill container for video; audio uses natural height
    audio: isAudio,   // compact control bar for audio
    preload: 'metadata',
    sources: [{ src: mediaUrl }],
  });

  return player;
}

/**
 * Safely dispose a Video.js player instance.
 * @param {Object|null} player
 */
export function unmountPlayer(player) {
  if (player && !player.isDisposed()) {
    player.dispose();
  }
}
