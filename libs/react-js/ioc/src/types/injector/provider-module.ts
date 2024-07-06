import type { InjectionToken, Provider, Type } from 'injection-js';

export interface IProviderModule {
  /** Returns all the {@link Provider | Providers} included into this `module`. */
  getProviders(): Provider[];
}

export interface ProviderModuleConstructor {
  /** Imports into this {@link IProviderModule | ProviderModule} the {@link providers} of one or more {@link IProviderModule | ProviderModules}. */
  imports?: IProviderModule[];

  /** The `dependencies` which must be provided by this {@link IProviderModule | ProviderModule}. */
  providers?: Provider[];
}

export type DependencyToken<T> = Type<T> | InjectionToken<T>;
