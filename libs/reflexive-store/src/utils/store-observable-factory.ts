import { takeUntil, type OperatorFunction, type Subject } from 'rxjs';
import type { IReflexiveStore, StoreObservable } from '../types';

export function storeObservableFactory<T>(
  valueSubject: Subject<T>,
  disposeEvent$: IReflexiveStore<T>['storeDisposeEvent$'],
  ...pipeInitialExtension: OperatorFunction<any, any>[]
): StoreObservable<T> {
  const original$ = valueSubject.asObservable();
  const extended$ = valueSubject.asObservable();

  //@ts-expect-error T could be instantiated with an arbitrary type which could be unrelated to U.
  extended$.pipe = (...pipe: OperatorFunction<any, any>[]) => {
    return original$.pipe(
      //@ts-expect-error Signature(s) not matching.
      ...[...pipeInitialExtension, ...pipe],
      takeUntil(disposeEvent$)
      // ,finalize(() => console.warn('value$ successfully finalized.'))
    );
  };

  return extended$;
}
