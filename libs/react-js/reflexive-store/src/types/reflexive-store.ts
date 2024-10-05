import type {
  IReflexiveStore as IReflexiveStoreBase,
  ReflexiveInitStoreConfig,
  ReflexiveDetachedValue,
  ReflexiveStoreMap,
  ReflexiveStoreToDotNotation,
} from '@norabytes/reflexive-store';
import type * as NoraTypes from '@norabytes/nora-types';
import type { OperatorFunction } from 'rxjs';
import type { RequiredDeep } from 'type-fest';
import type { StoreMap } from './store-map';
import type { StoreContext } from './store-context';

export interface IReflexiveStore<StoreModel extends Record<string, any>>
  extends IReflexiveStoreBase<StoreModel, StoreMap<StoreModel> & ReflexiveStoreMap<StoreModel>> {
  storeContextFactory<T>(value: T): StoreContext<T>;
  storeContextFactory<T>(value: T, ...pipe: OperatorFunction<any, any>[]): StoreContext<unknown>;

  /**
   * {@link React} `hook` which can be used to _initialize_ the internal `store` within a `ReactJS` _functional_ component.
   *
   * @param props `1:1` map of your {@link StoreModel} interface.
   * @param config See {@link InitStoreConfig}.
   * @remarks The `store` will be initialized **before** the component mount life-cycle.
   */
  useInitStore(props: RequiredDeep<StoreModel>, config?: InitStoreConfig<this>): this;

  /**
   * Can be used to access all the {@link store} properties via `dot-notation` string and automatically `re-render` the component whenever one of them changes.
   * @param ctx The {@link store} properties.
   *
   * eg:
   *
   * ```ts
   * const [firstName, lastName, dobDay, dobMonth, dobYear] = storeService.useReduceStore('user.firstName', 'user.lastName', 'user.dob.day', 'user.dob.month', 'user.dob.year');
   *
   * console.log(firstName, lastName, dobDay, dobMonth, dobYear);
   * ```
   */
  useReduceStore<T extends ReflexiveStoreToDotNotation<StoreModel>[]>(...ctx: T): StoreReduceResult<StoreModel, T>;

  /**
   * {@link React} `hook` which will be invoked when the _internal_ `disposeEvent$` observable emits.
   *
   * @param callback The `callback` method to be invoked.
   */
  useDispose(callback: () => void | Promise<void>): void;
}

export interface InitStoreConfig<ThisInstance> extends ReflexiveInitStoreConfig {
  /** Optionally you can provide a `callback` which will be `invoked` once the component did mount. */
  onMountCallback?: (instance: ThisInstance) => void | Promise<void>;
}

export type StoreReduceResult<StoreModel, P extends string[]> = {
  [K in keyof P]: P[K] extends string
    ? NoraTypes.Mappers.FromDotNotation<StoreModel, P[K]> extends ReflexiveDetachedValue<infer U>
      ? U
      : NoraTypes.Mappers.FromDotNotation<StoreModel, P[K]>
    : never;
};
