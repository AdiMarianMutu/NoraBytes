import type { InjectionToken, Injector, ReflectiveInjector, Type } from 'injection-js';

export type DependencyToken<T> = Type<T> | InjectionToken<T>;

export declare abstract class InjectorContainer extends ReflectiveInjector {
  static THROW_IF_NOT_FOUND: object;
  static NULL: Injector;
  /**
   * Retrieves an instance from the injector based on the provided token.
   * If not found:
   * - Throws {@link NoProviderError} if no `notFoundValue` that is not equal to
   * Injector.THROW_IF_NOT_FOUND is given
   * - Returns the `notFoundValue` otherwise
   */
  abstract get<T>(token: DependencyToken<T>, notFoundValue?: T): T;
}
