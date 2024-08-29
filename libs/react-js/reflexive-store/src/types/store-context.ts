import type { ReflexiveStoreContext, ReflexiveStoreObservable } from '@norabytes/reflexive-store';
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
   * @param pipe You can provide on the fly additional `RxJS` operators.
   *
   * @remarks _All the chained operators are gonna be automatically unsubscribed when the `store.disposeEvent$` observable emits!_
   */
  useValue<A>(distinctValue: boolean, op1: OperatorFunction<T, A>): A;
  useValue<A, B>(distinctValue: boolean, op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): B;
  useValue<A, B, C>(
    distinctValue: boolean,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>
  ): C;
  useValue<A, B, C, D>(
    distinctValue: boolean,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>
  ): D;
  useValue<A, B, C, D, E>(
    distinctValue: boolean,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>
  ): E;
  useValue<A, B, C, D, E, F>(
    distinctValue: boolean,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>
  ): F;
  useValue<A, B, C, D, E, F, G>(
    distinctValue: boolean,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>
  ): G;
  useValue<A, B, C, D, E, F, G, H>(
    distinctValue: boolean,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
    op8: OperatorFunction<G, H>
  ): H;
  useValue<A, B, C, D, E, F, G, H, I>(
    distinctValue: boolean,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
    op8: OperatorFunction<G, H>,
    op9: OperatorFunction<H, I>
  ): I;
  useValue<A, B, C, D, E, F, G, H, I>(
    distinctValue: boolean,
    op1: OperatorFunction<T, A>,
    op2: OperatorFunction<A, B>,
    op3: OperatorFunction<B, C>,
    op4: OperatorFunction<C, D>,
    op5: OperatorFunction<D, E>,
    op6: OperatorFunction<E, F>,
    op7: OperatorFunction<F, G>,
    op8: OperatorFunction<G, H>,
    op9: OperatorFunction<H, I>,
    ...ops: OperatorFunction<any, any>[]
  ): unknown;
}
