import type { ReflexiveStoreContext } from '@norabytes/reflexive-store';
import type { OperatorFunction } from 'rxjs';

export interface StoreContext<T> extends ReflexiveStoreContext<T> {
  /**
   * {@link React} `hook` which can be used to retrieve the value of the property inside a _functional_ component.
   *
   * @param distinctValue When set to `false` it'll re-render the `component` even if the `value` didn't change. _(Defaults to `true`)_
   */
  useValue(distinctValue?: boolean): T;

  /**
   * {@link React} `hook` which can be used to retrieve the value of the property inside a _functional_ component.
   *
   * @param distinctValue When set to `false` it'll re-render the `component` even if the `value` didn't change.
   * @param pipe You can provide on the fly additional `RxJS` operarotrs.
   *
   * @remarks _All the chained operators are gonna be automatically unsubscribed when the `store.disposeEvent$` observable emits!_
   */
  useValue(distinctValue: boolean, ...pipe: OperatorFunction<T, T>[]): T;
}
