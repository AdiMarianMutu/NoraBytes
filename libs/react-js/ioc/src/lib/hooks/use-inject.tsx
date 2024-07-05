import { useContext } from 'react';
import type { InjectionToken, Type } from 'injection-js';
import { InjectorContext } from '../contexts';

export function useInject<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T): T {
  return useContext(InjectorContext).get(token, notFoundValue);
}
