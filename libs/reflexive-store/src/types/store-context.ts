import type { BehaviorSubject, Observable, OperatorFunction } from 'rxjs';
import type { DetachedValue } from '../utils';

/** You can use the {@link StoreContext} to manipulate your `store` model properties. */
export type StoreContext<T> = {
  /** The low-level `RxJS` {@link BehaviorSubject} object. */
  subject: BehaviorSubject<T>;

  /**
   * The low-level RxJS {@link Observable} object.
   *
   * _It is a modified {@link Observable} object which automatically appends at the end of the `pipeline` the `takeUntil(store.disposeEvent$)` operator._
   *
   * _Check {@link StoreObservable}._
   */
  value$: StoreObservable<T>;

  /**
   * Updates the current value with the provided `payload`.
   *
   * @param payload The new value.
   * @returns The updated value retrieved using the {@link getValue} method.
   */
  setValue(
    payload: T extends (...a: any[]) => any ? 'DETACHED_VALUE_REQUIRED_OR_INVALID_METHOD_SIGNATURE_PROVIDED' : T
  ): T;

  /**
   * When the property value is a `method`, you must use the {@link DetachedValue | ReflexiveDetachedValue} to correctly update the `method`.
   *
   * @param method The new `method`.
   * @returns The updated `method`.
   */
  setValue(method: DetachedValue<T>): T;

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

  /**
   * Can be used to register a {@link OnChangeCallbackParam | callback} which will be invoked whenever the `value` changes.
   *
   * eg:
   * ```ts
   * store.counter.onChange((currentCounterValue) => console.log(currentCounterValue));
   * ```
   */
  onChange<P extends OnChangeCallbackParam<T>>(cb: P): void;

  /**
   * Additionaly you can provide an `RxJS pipe` before the provided {@link OnChangeCallbackParam | callback} will be invoked.
   *
   * @param params Check {@link OnChangeWithPipeParams}.
   *
   * eg:
   * ```ts
   * import { debounceTime } from 'rxjs';
   *
   * store.inputTextValue.onChange({
   *  with: [debounceTime(250)],
   *  // The `do` callback will be invoked only after `250ms` have passed without another value change.
   *  do: (value) => console.log(value),
   * });
   * ```
   */
  onChange<P extends OnChangeWithPipeParams<T>>(params: P): void;

  /** Imperative method to get the current value. */
  getValue(): T;
};

export type OnChangeCallbackParam<T> = (currentPayload: T) => void;
export interface OnChangeWithPipeParams<T> {
  /** Can be used to provide any valid {@link OperatorFunction | RxJS OperatorFunction}. */
  with: OperatorFunction<T, T>[];

  /** The `callback` which will be invoked at the _very **end**_ of the `RxJS pipe`. */
  do: OnChangeCallbackParam<T>;
}
export type SetValueCallbackParam<T> = (currentPayload: T) => T;

/** Internal wrapper of the `RxJS` {@link Observable} object. */
export interface StoreObservable<T> extends Omit<Observable<T>, 'pipe'> {
  /**
   * The `takeUntil(store.disposeEvent$)` operator will be automatically attached at the end
   * of the pipe.
   *
   * Therefore when the `store.dispose` method is invoked, all the subscription are gonna be automatically unsubscribed.
   */
  pipe: Observable<T>['pipe'];
}
