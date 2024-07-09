import type { IProviderModule, InjectorContainer } from '../injector';

export interface InjectorProviderProps {
  children: React.ReactElement | null;

  /** The {@link IProviderModule | ProviderModule}. */
  module: IProviderModule;

  /**
   * Optionally you can control where the provided {@link IProviderModule | ProviderModule} should be injected into.
   *
   * - `'root'`: It'll be injected into the root {@link ReflectiveInjector | InjectorContainer}.
   *           _This means that components up the tree could also inject the provided {@link IProviderModule | ProviderModule}._
   * - `scoped:KEY`: It'll be injected into the `scoped` {@link ReflectiveInjector | InjectorContainer} having the provided {@link key}.
   * - `'transient'`: It'll be injected into a new {@link ReflectiveInjector | InjectorContainer} which will be available only
   *                to the provided {@link children}.
   * - `ReflectiveInjector`: You can directly provide a {@link ReflectiveInjector | InjectorContainer} instance.
   *
   * Defaults to `'transient'`.
   *
   * eg:
   * ```tsx
   * import { InjectorProvider } from '@norabytes/reactjs-ioc';
   *
   * <InjectorProvider injectInto="root" module={MyProviderModule}>
   *  <MyComponent />
   * </InjectorProvider>
   *
   * <InjectorProvider injectInto="transient" module={MyProviderModule}>
   *  <MyComponent />
   * </InjectorProvider>
   *
   * <InjectorProvider injectInto="scoped:MY_SCOPED_InjectorContainer_KEY" module={MyProviderModule}>
   *  <MyComponent />
   * </InjectorProvider>
   *
   * <InjectorProvider injectInto={myCustomReflectiveInjectorContainerInstance} module={MyProviderModule}>
   *  <MyComponent />
   * </InjectorProvider>
   * ```
   */
  injectInto?: 'root' | `scoped:${string}` | 'transient' | InjectorContainer;

  /**
   * Can be used to get access to the component `dependencies` _before_ the component has been rendered _(mounted)_.
   *
   * eg:
   * ```tsx
   * import { InjectorProvider, useInject } from '@norabytes/reactjs-ioc';
   *
   * <InjectorProvider module={MyProviderModule} preInjection={() => {
   *  const myService = useInject(MyService);
   *
   *  myService.init();
   * }}>
   *  <MyComponent />
   * </InjectorProvider>
   * ```
   */
  preInjection?: () => void;
}
