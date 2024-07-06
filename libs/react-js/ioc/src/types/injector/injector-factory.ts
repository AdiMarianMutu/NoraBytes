import type { ReflectiveInjector } from 'injection-js';
import type * as AdvancedTypes from 'type-fest';
import type { InjectorTypes } from '../../types';

export interface IInjectorFactory {
  /** Inject the provided {@link InjectorTypes.IProviderModule | ProviderModule} into the `root` {@link ReflectiveInjector | container}. */
  injectIntoRoot(module: InjectorTypes.IProviderModule): void;

  /**
   * Inject the provided {@link InjectorTypes.IProviderModule | ProviderModule} into the selected `scoped` {@link ReflectiveInjector | container}.
   * @param key The unique {@link key} which has been used during the creation of this `scoped` container.
   */
  injectIntoScoped(key: string, module: InjectorTypes.IProviderModule): void;

  /**
   * Create a new `scoped` {@link ReflectiveInjector | container}.
   *
   * Check {@link CreateScopedInjectorParams}.
   */
  createScopedInjector({ key, module, fromRootInjector }: CreateScopedInjectorParams): ReflectiveInjector;

  /**
   * Create a new `transient` {@link ReflectiveInjector | container}.
   *
   * Check {@link CreateTransientInjectorParams}.
   */
  createTransientInjector({ module, fromRootInjector }: CreateTransientInjectorParams): ReflectiveInjector;

  /** Returns the `root` {@link ReflectiveInjector | container}. */
  getRootInjector(): ReflectiveInjector;

  /** Returns the `scoped` {@link ReflectiveInjector | container} matching the provided {@link key}. */
  getScopedInjector(key: string): ReflectiveInjector | undefined;

  /**
   * Get a `dependency` from the `root` {@link ReflectiveInjector | container}.
   *
   * @param token The {@link DependencyToken}.
   * @param notFoundValue Optionally you can provide a `default` value which will be used in the case the required `dependency` can't be resolved.
   */
  getSingleton<T>(token: InjectorTypes.DependencyToken<T>, notFoundValue?: T): T;

  /**
   * Get a `dependency` from the specified `scoped` {@link ReflectiveInjector | container}.
   *
   * @param token The {@link DependencyToken}.
   * @param notFoundValue Optionally you can provide a `default` value which will be used in the case the required `dependency` can't be resolved.
   */
  getScoped<T>(key: string, token: InjectorTypes.DependencyToken<T>, notFoundValue?: T): T;

  /**
   * Can be used to `resolve` and `instantiate` a `singleton` dependency from the `root` {@link ReflectiveInjector | container}.
   *
   * @param token The {@link DependencyToken}.
   * @param notFoundValue Optionally you can provide a `default` value which will be used in the case the required `dependency` can't be resolved.
   */
  getTransientFromRoot<T>(token: InjectorTypes.DependencyToken<T>, notFoundValue?: T): T;

  /**
   * Can be used to `resolve` and `instantiate` a `singleton` dependency from the specified `scoped` {@link ReflectiveInjector | container}.
   *
   * @param key The unique {@link key} which has been used during the creation of this `scoped` container.
   * @param token The {@link DependencyToken}.
   */
  getTransientFromScoped<T>(key: string, token: InjectorTypes.DependencyToken<T>, notFoundValue?: T): T;

  /**
   * Delete the specified `scoped` {@link ReflectiveInjector | container} from the cache.
   *
   * @param key The unique {@link key} which has been used during the creation of this `scoped` container.
   */
  deleteScopedInjector(key: string): boolean;
}

export interface CreateTransientInjectorParams {
  /** The `dependencies` to be provided. */
  module: InjectorTypes.IProviderModule;

  /**
   * When set to `true`, the `transient` {@link ReflectiveInjector | container} will `inherit` all the resolved `dependencies`
   * from the {@link ReflectiveInjector | root container}.
   *
   * Defaults to `false`.
   */
  fromRootInjector?: boolean;
}

export interface CreateScopedInjectorParams extends AdvancedTypes.SetOptional<CreateTransientInjectorParams, 'module'> {
  /** The unique {@link key} of this `scoped` container.  */
  key: string;
}
