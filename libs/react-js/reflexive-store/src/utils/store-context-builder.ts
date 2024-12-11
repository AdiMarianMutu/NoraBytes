import { ReflexiveStoreContextBuilder } from '@norabytes/reflexive-store';
import { useMemo, useReducer, useState } from 'react';
import { type OperatorFunction, pairwise, tap, startWith } from 'rxjs';
import isEqual from 'lodash.isequal';
import type { ReflexiveStore } from '../reflexive-store';
import type { StoreContext } from '../types';

export class StoreContextBuilder<
  StoreModel extends Record<string, any>,
  ReflexiveStoreInstance extends ReflexiveStore<StoreModel>
> extends ReflexiveStoreContextBuilder<StoreModel, ReflexiveStoreInstance> {
  override build<T, U = T>(key: string, value: T, storeInstance: ReflexiveStoreInstance): StoreContext<U> {
    const storeContextBase = super.build(key, value, storeInstance);

    const useValue = (distinctValue: boolean, ...pipe: OperatorFunction<T, U>[]) => {
      const currentValue = storeContextBase.getValue();
      const [stateReturnValue, setStateReturnValue] = useState<U>(currentValue as unknown as U);
      const [, forceRerender] = useReducer((x) => x + 1, 0);

      useMemo(() => {
        storeContextBase.value$
          .pipe(
            //@ts-expect-error Signature not matching.
            ...pipe,
            startWith(currentValue),
            pairwise(),
            tap<[U, U]>(([prevValue, newValue]) => {
              const valueHasChanged = !isEqual(prevValue, newValue);

              if (valueHasChanged) {
                setStateReturnValue(newValue);
              } else if (distinctValue === false) {
                // We must also make sure that we update the value just in case
                // as the `initialValue` of the `useState` value is not updated after
                // the 1st rendering cycle.
                setStateReturnValue(newValue);

                // Now we can force the re-render.
                forceRerender();
              }
            })
          )
          .subscribe();
      }, []);

      return stateReturnValue;
    };

    return {
      ...storeContextBase,
      //@ts-expect-error U could be instantiated with an arbitrary type which could be unrelated to T.
      useValue,
    };
  }
}
