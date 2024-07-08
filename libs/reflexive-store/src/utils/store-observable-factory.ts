import { takeUntil, type OperatorFunction, type Subject } from 'rxjs';
import type { IReflexiveStore, StoreObservable } from '../types';

export function storeObservableFactory<T>(
  valueSubject: Subject<T>,
  disposeEvent$: IReflexiveStore<T>['disposeEvent$'],
  ...pipeInitialExtension: OperatorFunction<T, T>[]
): StoreObservable<T> {
  const original$ = valueSubject.asObservable();
  const extended$ = valueSubject.asObservable();

  extended$.pipe = (...pipe: OperatorFunction<T, T>[]) => {
    return original$.pipe<T, T>(
      //@ts-expect-error Signature(s) not matching.
      ...[...pipeInitialExtension, ...pipe],
      takeUntil(disposeEvent$)
      // ,finalize(() => console.warn('value$ successfully finalized.'))
    );
  };

  return extended$;
}
