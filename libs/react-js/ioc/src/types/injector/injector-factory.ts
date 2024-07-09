import type { Injector, ReflectiveInjector } from 'injection-js';
import type * as AdvancedTypes from 'type-fest';
import type { IProviderModule, DependencyToken } from '../../types';

export interface IInjectorFactory {
  /** Inject the provided {@link IProviderModule | ProviderModule} into the `root` {@link InjectorContainer}. */
  injectIntoRoot(module: IProviderModule): void;

  /**
   * Inject the provided {@link IProviderModule | ProviderModule} into the selected `scoped` {@link InjectorContainer}.
   * @param key The unique {@link key} which has been used during the creation of this `scoped` InjectorContainer.
   */
  injectIntoScoped(key: string, module: IProviderModule): void;

  /**
   * Create a new `scoped` {@link InjectorContainer}.
   *
   * Check {@link CreateScopedInjectorParams}.
   */
  createScopedInjector({ key, module, fromRootInjector }: CreateScopedInjectorParams): InjectorContainer;

  /**
   * Create a new `transient` {@link InjectorContainer}.
   *
   * Check {@link CreateTransientInjectorParams}.
   */
  createTransientInjector({ module, fromRootInjector }: CreateTransientInjectorParams): InjectorContainer;

  /** Returns the `root` {@link InjectorContainer}. */
  getRootInjector(): InjectorContainer;

  /** Returns the `scoped` {@link InjectorContainer} matching the provided {@link key}. */
  getScopedInjector(key: string): InjectorContainer | undefined;

  /**
   * Get a `dependency` from the `root` {@link InjectorContainer}.
   *
   * @param token The {@link DependencyToken}.
   * @param notFoundValue Optionally you can provide a `default` value which will be used in the case the required `dependency` can't be resolved.
   */
  getSingleton<T>(token: DependencyToken<T>, notFoundValue?: T): T;

  /**
   * Get a `dependency` from the specified `scoped` {@link InjectorContainer}.
   *
   * @param token The {@link DependencyToken}.
   * @param notFoundValue Optionally you can provide a `default` value which will be used in the case the required `dependency` can't be resolved.
   */
  getScoped<T>(key: string, token: DependencyToken<T>, notFoundValue?: T): T;

  /**
   * Can be used to `resolve` and `instantiate` a `singleton` dependency from the `root` {@link InjectorContainer}.
   *
   * @param token The {@link DependencyToken}.
   * @param notFoundValue Optionally you can provide a `default` value which will be used in the case the required `dependency` can't be resolved.
   */
  getTransientFromRoot<T>(token: DependencyToken<T>, notFoundValue?: T): T;

  /**
   * Can be used to `resolve` and `instantiate` a `singleton` dependency from the specified `scoped` {@link InjectorContainer}.
   *
   * @param key The unique {@link key} which has been used during the creation of this `scoped` InjectorContainer.
   * @param token The {@link DependencyToken}.
   */
  getTransientFromScoped<T>(key: string, token: DependencyToken<T>, notFoundValue?: T): T;

  /**
   * Delete the specified `scoped` {@link InjectorContainer} from the cache.
   *
   * @param key The unique {@link key} which has been used during the creation of this `scoped` InjectorContainer.
   */
  deleteScopedInjector(key: string): boolean;
}

export interface CreateTransientInjectorParams {
  /** The `dependencies` to be provided. */
  module: IProviderModule;

  /**
   * When set to `true`, the `transient` {@link InjectorContainer} will `inherit` all the resolved `dependencies`
   * from the root {@link InjectorContainer}.
   *
   * Defaults to `false`.
   */
  fromRootInjector?: boolean;
}

export interface CreateScopedInjectorParams extends AdvancedTypes.SetOptional<CreateTransientInjectorParams, 'module'> {
  /** The unique {@link key} of this `scoped` InjectorContainer.  */
  key: string;
}

export type InjectorContainer = ReflectiveInjector & Injector;
