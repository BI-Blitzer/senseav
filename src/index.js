import { useElement, useLayout, useEffect } from '@nebula.js/stardust';

import { data } from './data';
import { properties } from './object-properties';
import { ext } from './ext';
import { mountPlayer, unmountPlayer } from './media-player';

import './style.css';

export default function supernova(galaxy) {
  return {
    qae: {
      properties,
      data,
    },

    ext: ext(galaxy),

    component() {
      const element = useElement();
      const layout = useLayout();

      useEffect(() => {
        // Clear any previous render before (re-)mounting
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }

        const player = mountPlayer(element, layout);

        // Cleanup: dispose Video.js and clear DOM when layout changes or
        // the component is unmounted
        return () => {
          unmountPlayer(player);
          while (element.firstChild) {
            element.removeChild(element.firstChild);
          }
        };
      }, [layout]);
    },
  };
}
