import { ReflexiveStoreContextBuilder } from '@norabytes/reflexive-store';
import { useMemo, useState } from 'react';
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
      const [, forceRerender] = useState(0);

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
                forceRerender((x) => x + 1);
              } else if (distinctValue === false) {
                forceRerender((x) => x + 1);
              }
            })
          )
          .subscribe();
      }, []);

      return currentValue;
    };

    return {
      ...storeContextBase,
      //@ts-expect-error U could be instantiated with an arbitrary type which could be unrelated to T.
      useValue,
    };
  }
}
