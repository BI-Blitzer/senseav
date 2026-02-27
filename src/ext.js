/**
 * Property panel definition for the senseav extension.
 * Adds a "Media Settings" section to the standard appearance accordion.
 */
export function ext(galaxy) {
  return {
    definition: {
      component: 'accordion',
      items: {
        appearance: {
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
