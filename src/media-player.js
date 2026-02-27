import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// ── Media type detection ───────────────────────────────────────────────────

const AUDIO_EXTENSIONS = new Set([
  'mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'opus', 'wma',
]);

const VIDEO_EXTENSIONS = new Set([
  'mp4', 'webm', 'ogv', 'avi', 'mov', 'mkv', 'm4v', 'wmv',
]);

function detectMediaType(url) {
  if (!url) return 'video';
  const ext = url.split('?')[0].split('.').pop().toLowerCase();
  if (AUDIO_EXTENSIONS.has(ext)) return 'audio';
  if (VIDEO_EXTENSIONS.has(ext)) return 'video';
  return 'video'; // safe default
}

export function resolveMediaType(url, override) {
  if (override && override !== 'auto') return override;
  return detectMediaType(url);
}

// ── DOM construction + Video.js initialisation ─────────────────────────────

/**
 * Build the DOM structure inside `container`, initialise Video.js, and
 * return the player instance (or null when there is no data to display).
 *
 * DOM layout for VIDEO:
 *   .senseav-root.senseav-video
 *     └── .senseav-player-wrapper
 *           └── video.video-js
 *
 * DOM layout for AUDIO (with optional blurred background image):
 *   .senseav-root.senseav-audio
 *     ├── .senseav-bg            (absolute, blurred bg image – optional)
 *     ├── .senseav-bg-overlay    (dark scrim so controls are readable)
 *     └── .senseav-player-wrapper
 *           └── video.video-js
 *
 * @param {HTMLElement} container  The nebula.js root element.
 * @param {Object}      layout     The Qlik Sense layout object.
 * @returns {Object|null}          Video.js player, or null.
 */
export function mountPlayer(container, layout) {
  const matrix = layout.qHyperCube?.qDataPages?.[0]?.qMatrix;

  if (!matrix?.length || !matrix[0][0]?.qText) {
    const msg = document.createElement('div');
    msg.className = 'senseav-empty';
    msg.textContent = 'Add a dimension containing a media URL to get started.';
    container.appendChild(msg);
    return null;
  }

  const row = matrix[0];
  const mediaUrl = row[0].qText;

  // Dimension 2 is optional; treat '-' (Qlik null display) as absent
  const rawBg = row.length > 1 ? row[1]?.qText : null;
  const bgImageUrl = rawBg && rawBg !== '-' ? rawBg : null;

  const { mediaTypeOverride, autoplay, loop, muted, showControls } = layout;
  const mediaType = resolveMediaType(mediaUrl, mediaTypeOverride);
  const isAudio = mediaType === 'audio';
  const hasBg = isAudio && !!bgImageUrl;

  // ── Root wrapper ──────────────────────────────────────────────────────────
  const root = document.createElement('div');
  root.className = `senseav-root senseav-${isAudio ? 'audio' : 'video'}`;
  container.appendChild(root);

  // ── Background image layers (audio only) ──────────────────────────────────
  if (hasBg) {
    const bg = document.createElement('div');
    bg.className = 'senseav-bg';
    // Use setAttribute for the style so the URL never touches innerHTML
    bg.style.backgroundImage = `url("${bgImageUrl.replace(/\\/g, '/').replace(/"/g, '%22')}")`;
    root.appendChild(bg);

    const overlay = document.createElement('div');
    overlay.className = 'senseav-bg-overlay';
    root.appendChild(overlay);
  }

  // ── Player wrapper + video element ────────────────────────────────────────
  const playerWrapper = document.createElement('div');
  playerWrapper.className = 'senseav-player-wrapper';
  root.appendChild(playerWrapper);

  const videoEl = document.createElement('video');
  videoEl.className = 'video-js vjs-default-skin';
  playerWrapper.appendChild(videoEl);

  // ── Initialise Video.js ───────────────────────────────────────────────────
  const player = videojs(videoEl, {
    controls: showControls !== false,
    autoplay: !!autoplay,
    loop: !!loop,
    muted: !!muted,
    // fill: true makes Video.js stretch to the parent element (video mode)
    fill: !isAudio,
    // audio: true activates the compact audio-only control bar
    audio: isAudio,
    preload: 'metadata',
    sources: [{ src: mediaUrl }],
  });

  return player;
}

/**
 * Safely dispose a Video.js player.
 * @param {Object|null} player
 */
export function unmountPlayer(player) {
  if (player && !player.isDisposed()) {
    player.dispose();
  }
}
