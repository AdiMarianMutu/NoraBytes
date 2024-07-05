import type { InjectionToken, Provider, Type } from 'injection-js';

export interface ContainerModule {
  /** Imports into this container the `providers` of one or more {@link ContainerModule | ContainerModules}. */
  modules?: ContainerModule[];

  /** The `dependencies` which must be provided by this `container`. */
  providers?: Provider[];
}

export type DependencyToken<T> = Type<T> | InjectionToken<T>;
