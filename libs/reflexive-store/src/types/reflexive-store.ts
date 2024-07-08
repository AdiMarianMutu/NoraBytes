import type { BehaviorSubject, Observable, OperatorFunction } from 'rxjs';
import type * as NoraTypes from '@norabytes/nora-types';
import type { RequiredDeep } from 'type-fest';
import type { StoreMap } from './store-map';
import type { StoreContext } from './store-context';
import type { DetachedValue } from '../utils';

export interface IReflexiveStore<StoreModel extends Record<string, any>> {
  /** Can be used to access the {@link store}. */
  store: StoreMap<StoreModel>;

  /**
   * Can be used to `imperatively` check if the store has been initialized.
   *
   * _Check also the {@link storeIsReady$} {@link Observable}._
   */
  storeIsReady: boolean;

  /**
   * Can be used to `imperatively` check if the store has been `disposed`.
   *
   * _Check also the {@link disposeEvent$} {@link Observable}._
   */
  storeIsDisposed: boolean;

  /**
   * Same as the {@link storeIsReady} property, however this property is an `Observable`.
   *
   * **The `takeUntil(`{@link disposeEvent$}`)` operator is already attached to this {@link Observable}.**
   */
  storeIsReady$: Observable<boolean>;

  /**
   * Low level `RxJS` observable which will emit once when the `dispose` flow has been triggered.
   *
   * You can use it to automatically unsubscribe from observables you manually created.
   *
   * **The `take(1)` operator is already attached to the pipe of this {@link Observable}.**
   *
   * eg:
   * ```ts
   * const notificationSubject = new BehaviorSubject<string>('');
   * const notification$ = notificationSubject.asObservable().pipe(takeUntil(this.store.disposeEvent$));
   * ```
   */
  disposeEvent$: Observable<boolean>;

  /**
   * Initialize the store.
   *
   * @param props Provide the store's default values.
   * @param config See {@link InitStoreConfig}.
   * @returns The `ReflexiveStore` instance having the store initialized.
   */
  initStore(props: RequiredDeep<StoreModel>, config?: InitStoreConfig): this;

  /**
   * Can be used to access all the {@link store} properties via `dot-notation` string.
   *
   * @param ctx The {@link store} properties.
   *
   * eg:
   * ```ts
   * const [firstName, lastName, dobDay, dobMonth, dobYear] = storeService.reduceStore('user.firstName', 'user.lastName', 'user.dob.day', 'user.dob.month', 'user.dob.year');
   *
   * lastName.setValue('Auditore');
   * console.log(firstName.getValue(), lastName.getValue(), dobDay.getValue(), dobMonth.getValue(), dobYear.getValue());
   * ```
   */
  reduceStore<T extends NoraTypes.Mappers.LeavesDotNotation<StoreModel>[]>(...ctx: T): StoreReduceResult<StoreModel, T>;

  /**
   * Factory `method` which can be used to generate a new {@link StoreContext} property on demand.
   *
   * @param value The `value` which should be wrapped into a {@link StoreContext} object.
   */
  storeContextFactory<T>(value: T): StoreContext<T>;

  /**
   * Factory `method` which can be used to generate a new {@link StoreContext} property on demand.
   *
   * @param value The `value` which should be wrapped into a {@link StoreContext} object.
   * @param initialPipe Extend the main pipe of the {@link StoreContext.value$}.
   *
   * _The `takeUntil(`{@link disposeEvent$}`)` operator will be automatically appended at the end of the main pipe._
   */
  storeContextFactory<T>(value: T, ...pipe: OperatorFunction<T, T>[]): StoreContext<T>;

  /**
   * Manually `invoke` this `method` to trigger the `dispose` process.
   *
   * _Invoking this method will `unsubscribe` all the {@link store} `observables` and completely delete the {@link store}._
   */
  disposeStore(): void;
}

export type InitStoreConfig = {
  /** You can override the internal `disposeEventSubject` by providing your own. */
  disposeEventSubject?: BehaviorSubject<boolean>;
};

export type StoreReduceResult<StoreModel, P extends string[]> = {
  [K in keyof P]: P[K] extends string
    ? NoraTypes.Mappers.FromDotNotation<StoreModel, P[K]> extends DetachedValue<infer U>
      ? StoreContext<U>
      : StoreContext<NoraTypes.Mappers.FromDotNotation<StoreModel, P[K]>>
    : never;
};
