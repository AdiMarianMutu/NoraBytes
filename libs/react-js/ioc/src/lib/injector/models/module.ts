import type { InjectionToken, Provider, Type } from 'injection-js';

export interface ProviderModule {
  /** Imports into this {@link ProviderModule} the {@link providers} of one or more {@link ProviderModule | ProviderModules}. */
  modules?: ProviderModule[];

  /** The `dependencies` which must be provided by this `container`. */
  providers?: Provider[];
}

export type DependencyToken<T> = Type<T> | InjectionToken<T>;
