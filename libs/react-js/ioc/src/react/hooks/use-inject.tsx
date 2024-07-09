import { useContext } from 'react';
import type { DependencyToken } from '../../types';
import { InjectorContext } from '../injector.context';

/**
 * ReactJS `hook` which can be used to `inject` the provided {@link token} into a `component`.
 *
 * @param token The {@link DependencyToken}.
 * @param notFoundValue Optionally you can provide a `default` value which will be used in the case the required `dependency` can't be resolved.
 */
export function useInject<T>(token: DependencyToken<T>, notFoundValue?: T): T {
  return useContext(InjectorContext).get(token, notFoundValue);
}
