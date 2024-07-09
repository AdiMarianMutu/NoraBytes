import type { ReflexiveDetachedValue } from '@norabytes/reflexive-store';
import type { Primitive } from 'type-fest';
import type { StoreContext } from './store-context';

// prettier-ignore
export type StoreMap<StoreModel> = {
  [K in keyof StoreModel]:

  // Types which must be wrapped with the `DetachedValue` type.
  StoreModel[K] extends
    ((...args: any[]) => any) |
    undefined |
    void 
    ? DetachedValueWrapperRequired :

  // Valid Types.
  StoreModel[K] extends ReflexiveDetachedValue<infer U> ? StoreContext<U> : 
  StoreModel[K] extends Primitive | Array<any> ? StoreContext<StoreModel[K]> :

  // Recursively keep mapping the `StoreModel`.
  StoreMap<StoreModel[K]>;
}

type DetachedValueWrapperRequired = 'USE_THE_DETACHED_VALUE_WRAPPER';
