import { useEffect, useState } from 'react';
import { breakpoints } from '../theme/breakpoints';
import _ from 'lodash';

/**
 * useBreakpoints
 * return a list of activeBreakpoints
 */
export function useBreakpoints(): string[] {
  const [activeBreakpoints, setActive] = useState<string[]>([]);

  // address 'TypeError: window.matchMedia is not a function'
  const matchMedia =
    window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener: function () {},
        removeListener: function () {},
      };
    };

  useEffect(() => {
    const handleWindowResize = _.throttle(() => {
      const active = Object.keys(breakpoints).filter((name) => {
        if (typeof window !== 'undefined') {
          const mq = matchMedia(breakpoints[name]);
          return mq.matches;
        }
        return null;
      });
      setActive(active);
    }, 500);

    handleWindowResize();

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleWindowResize);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleWindowResize);
      }
    };
  }, []);

  return activeBreakpoints;
}
