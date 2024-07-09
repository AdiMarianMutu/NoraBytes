import type { IProviderModule, InjectorContainer } from '../injector';

export interface InjectorProviderProps {
  children: React.ReactElement | null;

  /** The {@link IProviderModule | ProviderModule}. */
  module: IProviderModule;

  /**
   * Optionally you can control where the provided {@link IProviderModule | ProviderModule} should be injected into.
   *
   * - `'root'`: It'll be injected into the root {@link InjectorContainer}.
   *           _This means that components up the tree could also inject the provided {@link IProviderModule | ProviderModule}._
   * - `scoped:KEY`: It'll be injected into the `scoped` {@link InjectorContainer} having the provided {@link key}.
   * - `'transient'`: It'll be injected into a new {@link InjectorContainer} which will be available only
   *                to the provided {@link children}.
   * - `InjectorContainer`: You can directly provide a {@link InjectorContainer} instance.
   *
   * Defaults to `'transient'`.
   *
   * eg:
   * ```tsx
   * import { EMPTY_PROVIDER_MODULE } from '@norabytes/reactjs-ioc';
   * import { InjectorProvider } from '@norabytes/reactjs-ioc/r';
   *
   * <InjectorProvider injectInto="root" module={EMPTY_PROVIDER_MODULE}>
   *  <MyComponent />
   * </InjectorProvider>
   *
   * <InjectorProvider injectInto="transient" module={EMPTY_PROVIDER_MODULE}>
   *  <MyComponent />
   * </InjectorProvider>
   *
   * <InjectorProvider injectInto="scoped:MY_SCOPED_InjectorContainer_KEY" module={EMPTY_PROVIDER_MODULE}>
   *  <MyComponent />
   * </InjectorProvider>
   *
   * <InjectorProvider injectInto={myCustomReflectiveInjectorContainerInstance} module={EMPTY_PROVIDER_MODULE}>
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
   * import { InjectorProvider, useInject } from '@norabytes/reactjs-ioc/r';
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
