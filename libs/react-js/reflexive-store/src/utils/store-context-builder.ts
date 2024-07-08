import { ReflexiveStoreContextBuilder } from '@norabytes/reflexive-store';
import { useEffect, useState } from 'react';
import { type OperatorFunction, pairwise, tap, startWith } from 'rxjs';
import isEqual from 'lodash.isequal';
import type { ReflexiveStore } from '../reflexive-store';
import type { StoreContext } from '../types';

export class StoreContextBuilder<
  StoreModel extends Record<string, any>,
  ReflexiveStoreInstance extends ReflexiveStore<StoreModel>
> extends ReflexiveStoreContextBuilder<StoreModel, ReflexiveStoreInstance> {
  override build<T>(key: string, value: T, storeInstance: ReflexiveStoreInstance): StoreContext<T> {
    const storeContextBase = super.build(key, value, storeInstance);

    const useValue = (distinctValue: boolean, ...pipe: OperatorFunction<T, T>[]) => {
      const currentValue = storeContextBase.getValue();
      const [stateReturnValue, setStateReturnValue] = useState(currentValue);
      const [, forceRerender] = useState(0);

      useEffect(() => {
        storeContextBase.value$
          .pipe(
            //@ts-expect-error Signature not matching.
            ...pipe,
            startWith(currentValue),
            pairwise(),
            tap<[T, T]>(([prevValue, newValue]) => {
              const valueHasChanged = !isEqual(prevValue, newValue);

              if (valueHasChanged) {
                setStateReturnValue(newValue);
              } else if (distinctValue === false) {
                forceRerender((x) => x + 1);
              }
            })
          )
          .subscribe();
      }, []);

      return stateReturnValue;
    };

    return {
      ...storeContextBase,
      useValue,
    };
  }
}
