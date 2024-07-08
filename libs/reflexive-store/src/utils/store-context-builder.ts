import { BehaviorSubject } from 'rxjs';
import type { ReflexiveStore } from '../reflexive-store';
import type { SetValueCallbackParam, StoreContext } from '../types';
import { isDetachedValue } from './is-detached-value';
import { storeObservableFactory } from './store-observable-factory';

export class StoreContextBuilder<
  StoreModel extends Record<string, any>,
  ReflexiveStoreInstance extends ReflexiveStore<StoreModel>
> {
  build<T>(value: T, storeInstance: ReflexiveStoreInstance): StoreContext<T> {
    if (typeof value === 'function') return value as any;

    const subject = new BehaviorSubject<T>(value);
    const value$ = storeObservableFactory(subject, storeInstance.disposeEvent$);

    const getValue = () => {
      return this.getReflexiveOrDetachedValue(subject.getValue());
    };

    const setValue = (value: T | SetValueCallbackParam<T>): T => {
      const callbackProvided = typeof value === 'function';
      const newValue = callbackProvided ? (value as SetValueCallbackParam<T>)(getValue()) : value;

      subject.next(newValue);

      return getValue();
    };

    return {
      subject,
      value$,
      getValue,
      setValue,
    } as StoreContext<T>;
  }

  protected getReflexiveOrDetachedValue<T>(value: T): T {
    if (isDetachedValue(value)) return value.value as T;

    return value;
  }
}
