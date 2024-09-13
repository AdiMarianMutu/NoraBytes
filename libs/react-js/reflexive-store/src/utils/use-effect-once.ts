import { useEffect, useRef } from 'react';

/** Custom {@link useEffect} hook which will be run once. _(In `StrictMode` as well)_ */
export function useEffectOnce(effect: () => React.EffectCallback) {
  const cleanUpFn = useRef<() => void>(() => {});
  const ref = useRef(false);

  useEffect(() => {
    if (!ref.current) {
      cleanUpFn.current = effect();
    }

    return () => {
      if (!ref.current) {
        ref.current = true;
        return;
      }

      cleanUpFn.current();
    };
  }, [effect]);
}
