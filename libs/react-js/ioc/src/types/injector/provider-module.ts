import type { Provider } from 'injection-js';

export interface IProviderModule {
  /** Returns all the {@link Provider | Providers} included into this `module`. */
  getProviders(): Provider[];
}

export interface ProviderModuleConstructor {
  /** Imports into this {@link IProviderModule | ProviderModule} the {@link providers} of one or more {@link IProviderModule | ProviderModules}. */
  imports?: IProviderModule[];

  /** The `dependencies` which must be provided by this {@link IProviderModule | ProviderModule}. */
  providers?: Provider[];

  /**
   * You can control which {@link Provider} should be exported by listing them into the {@link exports} property.
   *
   * _By default all the {@link providers} are exportable when imported through the {@link imports} property and the {@link exports} property is not provided._
   */
  exports?: Provider[];
}
