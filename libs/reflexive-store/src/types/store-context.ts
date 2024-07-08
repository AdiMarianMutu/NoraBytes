import type { BehaviorSubject, Observable } from 'rxjs';

/** You can use the {@link StoreContext} to manipulate your `store` model properties. */
export type StoreContext<T> = {
  /** The low-level `RxJS` {@link BehaviorSubject} object. */
  subject: BehaviorSubject<T>;

  /**
   * The low-level RxJS {@link Observable} object.
   *
   * _It is a modified {@link Observable} object which automatically appends at the end of the `pipeline` the `takeUntil(store.disposeEvent$)` operator._
   *
   * _Check {@link ReflexiveStoreObservable}._
   */
  value$: ReflexiveStoreObservable<T>;

  /**
   * Updates the current value with the provided `payload`.
   *
   * @param payload The new value.
   * @returns The updated value retrieved using the {@link getValue} method.
   */
  setValue(payload: T): T;

  /**
   * Updates the current value with the provided `payload`.
   *
   * @param cb Callback function which will be invoked with the `current` payload.
   * It must return the _new_ payload.
   *
   * @returns The updated value retrieved using the {@link getValue} method.
   *
   * eg:
   * ```ts
   * property.setValue((currentCounterValue) => currentCounterValue + 1);
   * ```
   */
  setValue(cb: SetValueCallbackParam<T>): T;

  /** Imperative method to get the current value. */
  getValue(): T;
};

export type SetValueCallbackParam<T> = (currentPayload: T) => T;

/** Internal wrapper of the `RxJS` {@link Observable} object. */
export interface ReflexiveStoreObservable<T> extends Omit<Observable<T>, 'pipe'> {
  /**
   * The `takeUntil(store.disposeEvent$)` operator will be automatically attached at the end
   * of the pipe.
   *
   * Therefore when the `store.dispose` method is invoked, all the subscription are gonna be automatically unsubscribed.
   */
  pipe: Observable<T>['pipe'];
}
