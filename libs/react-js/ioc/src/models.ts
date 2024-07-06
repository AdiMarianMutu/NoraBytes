import type React from 'react';
import type { InjectionToken, Provider, ReflectiveInjector, Type } from 'injection-js';
import type * as AdvancedTypes from 'type-fest';

export type { AdvancedTypes };

//#region InjectorProvider

export interface InjectorProviderProps {
  children: React.ReactElement | null;

  /** The {@link ProviderModule}. */
  module: ProviderModule;

  /**
   * Can be used to get access to the component `dependencies` _before_ the component has been rendered _(mounted)_.
   *
   * eg:
   * ```tsx
   * import { InjectorProvider, useInject } from '@norabytes/reactjs-ioc';
   *
   * <InjectorProvider module={ContactUsForm.ProviderModule} preInjection={() => {
   *  const contactUsFormService = useInject(ContactUsForm.Service);
   *
   *  contactUsFormService.init();
   * }}>
   *  <MyComponent />
   * </InjectorProvider>
   * ```
   */
  preInjection?: () => void;
}

//#endregion

//#region Injector

export interface ProviderModule {
  /** Imports into this {@link ProviderModule} the {@link providers} of one or more {@link ProviderModule | ProviderModules}. */
  modules?: ProviderModule[];

  /** The `dependencies` which must be provided by this `container`. */
  providers?: Provider[];
}

export type DependencyToken<T> = Type<T> | InjectionToken<T>;

export interface IInjectorFactory {
  /**
   * Inject the provided dependencies into the `root` {@link ReflectiveInjector | container}.
   *
   * _All the injected deps will be `singletons`._
   * @param deps See {@link ProviderModule}.
   */
  injectIntoRoot(deps: ProviderModule): void;

  /**
   * Inject the provided dependencies into the selected `scoped` {@link ReflectiveInjector | container}.
   * @param key The unique {@link key} which has been used during the creation of this `scoped` container.
   * @param deps See {@link ProviderModule}.
   */
  injectIntoScoped(key: string, deps: ProviderModule): void;

  /**
   * Creates a new `scoped` {@link ReflectiveInjector | container}.
   * @param param0 See {@link CreateScopedInjectorParams}.
   */
  createScopedInjector({ key, deps, fromRootInjector }: CreateScopedInjectorParams): ReflectiveInjector;

  /**
   * Creates a new `transient` {@link ReflectiveInjector | container}.
   *
   * _All the resolved `deps` are not being cached._
   * @param param0 See {@link CreateTransientInjectorParams}.
   */
  createTransientInjector({ deps, fromRootInjector }: CreateTransientInjectorParams): ReflectiveInjector;

  getRootInjector(): ReflectiveInjector;

  getScopedInjector(key: string): ReflectiveInjector | undefined;

  /** Get a dependency from the `root` {@link ReflectiveInjector | container}. */
  getSingleton<T>(
    token: DependencyToken<T>,
    notFoundValue?: T
  ): typeof notFoundValue extends undefined ? T | undefined : T;

  /** Get a dependency from the specified `scoped` {@link ReflectiveInjector | container}. */
  getScoped<T>(
    key: string,
    token: DependencyToken<T>,
    notFoundValue?: T
  ): typeof notFoundValue extends undefined ? T | undefined : T;

  /** Can be used to `resolve` and `instantiate` a `singleton` dependency from the `root` {@link ReflectiveInjector | container}. */
  getTransientFromRoot<T>(provider: T): T | undefined;

  /** Can be used to `resolve` and `instantiate` a `singleton` dependency from the specified `scoped` {@link ReflectiveInjector | container}. */
  getTransientFromScoped<T>(key: string, provider: T): T | undefined;

  /** Deletes the specified `scoped` {@link ReflectiveInjector | container} from the cache. */
  deleteScopedInjector(key: string): boolean;

  /** Can be used to `recursively` unwrap a {@link ProviderModule}. */
  unwrapDeps(deps?: ProviderModule): Provider[];
}

export interface CreateTransientInjectorParams {
  /** The dependencies to be provided. */
  deps: ProviderModule;

  /**
   * When set to `true`, the `transient` {@link ReflectiveInjector | container} will be resolved from the {@link ReflectiveInjector | root container}.
   *
   * Defaults to `false`.
   */
  fromRootInjector?: boolean;
}

export interface CreateScopedInjectorParams extends AdvancedTypes.SetOptional<CreateTransientInjectorParams, 'deps'> {
  /** The unique {@link key} of this `scoped` container.  */
  key: string;
}

//#endregion
