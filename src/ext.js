/**
 * Property panel definition for the senseav extension.
 *
 * The `data` section (uses: 'data') is required — it renders the
 * Dimensions panel in the Qlik Sense property pane.
 * The `settings` section adds the custom Media Settings controls.
 */
export function ext(galaxy) {
  return {
    definition: {
      type: 'items',
      component: 'accordion',
      items: {
        // ── Dimensions panel ──────────────────────────────────────────────
        data: {
          uses: 'data',
        },

        // ── Custom settings ───────────────────────────────────────────────
        settings: {
          uses: 'settings',
          items: {
            mediaSettings: {
              type: 'items',
              label: 'Media Settings',
              items: {
                mediaTypeOverride: {
                  ref: 'mediaTypeOverride',
                  label: 'Media Type',
                  component: 'dropdown',
                  type: 'string',
                  defaultValue: 'auto',
                  options: [
                    { label: 'Auto-detect from URL', value: 'auto' },
                    { label: 'Force Audio', value: 'audio' },
                    { label: 'Force Video', value: 'video' },
                    { label: 'Open as Link (shared posts)', value: 'link' },
                  ],
                },
                autoplay: {
                  ref: 'autoplay',
                  label: 'Autoplay',
                  component: 'switch',
                  type: 'boolean',
                  defaultValue: false,
                  options: [
                    { translation: 'Off', value: false },
                    { translation: 'On', value: true },
                  ],
                },
                loop: {
                  ref: 'loop',
                  label: 'Loop',
                  component: 'switch',
                  type: 'boolean',
                  defaultValue: false,
                  options: [
                    { translation: 'Off', value: false },
                    { translation: 'On', value: true },
                  ],
                },
                muted: {
                  ref: 'muted',
                  label: 'Start Muted',
                  component: 'switch',
                  type: 'boolean',
                  defaultValue: false,
                  options: [
                    { translation: 'Off', value: false },
                    { translation: 'On', value: true },
                  ],
                },
                showControls: {
                  ref: 'showControls',
                  label: 'Show Controls',
                  component: 'switch',
                  type: 'boolean',
                  defaultValue: true,
                  options: [
                    { translation: 'Off', value: false },
                    { translation: 'On', value: true },
                  ],
                },
              },
            },
          },
        },
      },
    },
    support: {
      export: false,
      snapshot: false,
      viewData: false,
    },
  };
}
