import { type OperatorFunction, BehaviorSubject, skip, tap } from 'rxjs';
import type { ReflexiveStore } from '../reflexive-store';
import type { StoreContext, SetValueCallbackParam, OnChangeCallbackParam } from '../types';
import { DetachedValue } from './detached-value';
import { isFunction, isClassInstance } from '../helpers';
import { storeObservableFactory } from './store-observable-factory';

export class StoreContextBuilder<
  StoreModel extends Record<string, any>,
  ReflexiveStoreInstance extends ReflexiveStore<StoreModel>
> {
  build<T>(key: string, value: T, storeInstance: ReflexiveStoreInstance): StoreContext<T> {
    if (this.valueShouldBeDetached(value)) {
      throw new Error(`The '${key}' property value must be initialized with the 'ReflexiveStore.detachValue' method!`);
    }

    const subject = new BehaviorSubject<T>(this.getReflexiveOrDetachedValue(value));
    const value$ = storeObservableFactory(subject, storeInstance.storeDisposeEvent$);

    const getValue = () => {
      return subject.getValue();
    };

    const setValue = (value: T | SetValueCallbackParam<T> | DetachedValue<(...a: any[]) => any>): T => {
      const detachedValueProvided = value instanceof DetachedValue;
      const callbackProvided = typeof value === 'function';
      let newValue: T;

      if (!detachedValueProvided && callbackProvided) {
        const cb = value as SetValueCallbackParam<T>;
        newValue = cb(getValue());
      } else {
        newValue = this.getReflexiveOrDetachedValue(value) as T;
      }

      subject.next(newValue);

      return getValue();
    };

    const onChange = (
      params: OnChangeCallbackParam<T> | OperatorFunction<any, any>[],
      cb?: OnChangeCallbackParam<T>
    ) => {
      if (typeof params === 'object' && !Array.isArray(params) && 'with' in params) {
        throw new Error(
          `Please use the new 'onChange' signature method.\r\nThe one you are using has been removed starting with 'v2.1.0'!`
        );
      }

      const withCustomPipe = Array.isArray(params);

      if (!withCustomPipe) {
        value$.pipe(skip(1), tap(params)).subscribe();

        return;
      }

      //@ts-expect-error Signature not matching.
      value$.pipe(skip(1), ...params, tap(cb)).subscribe();
    };

    return {
      subject,
      value$,
      getValue,
      setValue,
      onChange,
    } as StoreContext<T>;
  }

  protected valueShouldBeDetached<T>(value: T): boolean {
    return typeof value === 'undefined' || isFunction(value) || isClassInstance(value);
  }

  protected getReflexiveOrDetachedValue<T>(value: T): T {
    if (value instanceof DetachedValue) return value.getValue();

    return value;
  }
}
