import type { BehaviorSubject, Observable, OperatorFunction } from 'rxjs';
import type { DetachedValue } from '../utils';

/** You can use the {@link StoreContext} to manipulate your `store` model properties. */
export type StoreContext<T> = {
  /** The low-level `RxJS` {@link BehaviorSubject} object. */
  subject: BehaviorSubject<T>;

  /**
   * The low-level `RxJS` {@link Observable} object.
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
  setValue(payload: T extends (...a: any[]) => any ? SetValueInvalidSignature : T): T;

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
  onChange(cb: OnChangeCallbackParam<T>): void;

  /**
   * Additionaly you can provide an `RxJS pipe` before the provided {@link OnChangeCallbackParam | callback} will be invoked.
   *
   * @param params **DEPRECATED**.
   * @deprecated **Use the new signature method: `store.inputTextValue.onChange([map((textValue) => textValue.length === 0)], (isEmpty) => console.log(isEmpty));`**
   * @removed `2.1.0`
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
  onChange(params: 'DEPRECATED'): void;

  /**
   * Additionaly you can provide an `RxJS pipe` before the provided {@link OnChangeCallbackParam | callback} will be invoked.
   *
   * @param pipe Array of `RxJS Operators`.
   * @param cb The `callback` which will be invoked after the {@link pipe}.
   *
   * eg:
   * ```ts
   * import { debounceTime, map } from 'rxjs';
   *
   * store.inputTextValue.onChange([
   *    debounceTime(250),
   *    map((x) => x.length === 0),
   *  ],
   *  (isEmpty) => {
   *    // Type inference works as expected,
   *    // the `isEmpty` value will show as `boolean` in your `IDE`.
   *    console.log(isEmpty);
   *  });
   * ```
   */
  onChange<A>(pipe: [OperatorFunction<T, A>], cb: OnChangeCallbackParam<A>): void;
  onChange<A, B>(pipe: [OperatorFunction<T, A>, OperatorFunction<A, B>], cb: OnChangeCallbackParam<B>): void;
  onChange<A, B, C>(
    pipe: [OperatorFunction<T, A>, OperatorFunction<A, B>, OperatorFunction<B, C>],
    cb: OnChangeCallbackParam<C>
  ): void;
  onChange<A, B, C, D>(
    pipe: [OperatorFunction<T, A>, OperatorFunction<A, B>, OperatorFunction<B, C>, OperatorFunction<C, D>],
    cb: OnChangeCallbackParam<D>
  ): void;
  onChange<A, B, C, D, E>(
    pipe: [
      OperatorFunction<T, A>,
      OperatorFunction<A, B>,
      OperatorFunction<B, C>,
      OperatorFunction<C, D>,
      OperatorFunction<D, E>
    ],
    cb: OnChangeCallbackParam<E>
  ): void;
  onChange<A, B, C, D, E, F>(
    pipe: [
      OperatorFunction<T, A>,
      OperatorFunction<A, B>,
      OperatorFunction<B, C>,
      OperatorFunction<C, D>,
      OperatorFunction<D, E>,
      OperatorFunction<E, F>
    ],
    cb: OnChangeCallbackParam<F>
  ): void;
  onChange<A, B, C, D, E, F, G>(
    pipe: [
      OperatorFunction<T, A>,
      OperatorFunction<A, B>,
      OperatorFunction<B, C>,
      OperatorFunction<C, D>,
      OperatorFunction<D, E>,
      OperatorFunction<E, F>,
      OperatorFunction<F, G>
    ],
    cb: OnChangeCallbackParam<G>
  ): void;
  onChange<A, B, C, D, E, F, G, H>(
    pipe: [
      OperatorFunction<T, A>,
      OperatorFunction<A, B>,
      OperatorFunction<B, C>,
      OperatorFunction<C, D>,
      OperatorFunction<D, E>,
      OperatorFunction<E, F>,
      OperatorFunction<F, G>,
      OperatorFunction<G, H>
    ],
    cb: OnChangeCallbackParam<H>
  ): void;
  onChange<A, B, C, D, E, F, G, H, I>(
    pipe: [
      OperatorFunction<T, A>,
      OperatorFunction<A, B>,
      OperatorFunction<B, C>,
      OperatorFunction<C, D>,
      OperatorFunction<D, E>,
      OperatorFunction<E, F>,
      OperatorFunction<F, G>,
      OperatorFunction<G, H>,
      OperatorFunction<G, I>
    ],
    cb: OnChangeCallbackParam<I>
  ): void;
  onChange<A, B, C, D, E, F, G, H, I>(
    pipe: [
      OperatorFunction<T, A>,
      OperatorFunction<A, B>,
      OperatorFunction<B, C>,
      OperatorFunction<C, D>,
      OperatorFunction<D, E>,
      OperatorFunction<E, F>,
      OperatorFunction<F, G>,
      OperatorFunction<G, H>,
      OperatorFunction<G, I>,
      ...OperatorFunction<any, any>[]
    ],
    cb: OnChangeCallbackParam<unknown>
  ): void;
  onChange<A, B, C, D, E, F, G, H, I>(
    pipe: [
      OperatorFunction<T, A>,
      OperatorFunction<A, B>,
      OperatorFunction<B, C>,
      OperatorFunction<C, D>,
      OperatorFunction<D, E>,
      OperatorFunction<E, F>,
      OperatorFunction<F, G>,
      OperatorFunction<G, H>,
      OperatorFunction<G, I>,
      ...OperatorFunction<any, any>[]
    ],
    cb: OnChangeCallbackParam<unknown>
  ): void;

  /** Imperative method to get the current value. */
  getValue(): T;
};

export type OnChangeCallbackParam<T> = (currentPayload: T) => void;
export type SetValueCallbackParam<T> = (currentPayload: T) => T;
export type SetValueInvalidSignature = 'DETACHED_VALUE_REQUIRED_OR_INVALID_METHOD_SIGNATURE_PROVIDED';

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
