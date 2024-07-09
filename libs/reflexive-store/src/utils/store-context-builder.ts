import { BehaviorSubject, skip, tap } from 'rxjs';
import type { ReflexiveStore } from '../reflexive-store';
import type { StoreContext, SetValueCallbackParam, OnChangeCallbackParam, OnChangeWithPipeParams } from '../types';
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

    const subject = new BehaviorSubject<T>(value);
    const value$ = storeObservableFactory(subject, storeInstance.disposeEvent$);

    const getValue = () => {
      return this.getReflexiveOrDetachedValue(subject.getValue());
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

    const onChange = (params: OnChangeCallbackParam<T> | OnChangeWithPipeParams<T>): void => {
      if (!this.onChangeParamsHasPipeAttached(params)) {
        value$.pipe(skip(1), tap(params)).subscribe();

        return;
      }

      //@ts-expect-error Signature not matching.
      value$.pipe(skip(1), ...params.with, tap(params.do)).subscribe();
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

  protected onChangeParamsHasPipeAttached<T>(obj: any): obj is OnChangeWithPipeParams<T> {
    try {
      return 'with' in obj;
    } catch {
      return false;
    }
  }
}
