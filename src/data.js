/**
 * Data targets configuration for the senseav supernova.
 *
 * Dimension 1 (required): Network URL of the audio or video file.
 * Dimension 2 (optional): Network URL of an image to display as a blurred
 *   background behind the audio player controls (audio mode only).
 *
 * No measures are used.
 */
export const data = {
  targets: [
    {
      path: '/qHyperCubeDef',
      dimensions: {
        min: 1,
        max: 2,
        description(properties, dimensionIndex) {
          return dimensionIndex === 0
            ? 'Media URL – network path to an audio or video file'
            : 'Background Image URL – displayed behind the audio player (audio only)';
        },
      },
      measures: {
        min: 0,
        max: 0,
      },
    },
  ],
};
