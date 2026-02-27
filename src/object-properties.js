/**
 * Initial properties applied when a new senseav object is created.
 * Custom properties are merged onto the layout and read inside the component.
 */
export const properties = {
  version: '1.0.0',

  qHyperCubeDef: {
    qDimensions: [],
    qMeasures: [],
    qInitialDataFetch: [
      {
        // 2 columns (media URL + optional background image URL), 1 row
        qWidth: 2,
        qHeight: 1,
      },
    ],
  },

  // ── Playback options ────────────────────────────────────────────────────────
  /** 'auto' | 'audio' | 'video' */
  mediaTypeOverride: 'auto',
  autoplay: false,
  loop: false,
  muted: false,
  showControls: true,
};
