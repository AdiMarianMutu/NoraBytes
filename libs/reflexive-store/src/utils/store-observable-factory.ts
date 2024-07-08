import { Observable, takeUntil, type OperatorFunction, type Subject } from 'rxjs';
import type { ReflexiveStoreObservable } from '../types';

export function storeObservableFactory<T>(
  valueSubject: Subject<T>,
  disposeEvent$: Observable<boolean>,
  ...pipeInitialExtension: OperatorFunction<T, T>[]
): ReflexiveStoreObservable<T> {
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
