import { useCallback } from 'react';
import { propsWithoutChildren } from './helpers';
import type { InjectorReactTypes } from '../types';
import { InjectorContext } from './injector.context';
import { useInjectInternal } from './hooks/helpers';

/**
 * {@link https://legacy.reactjs.org/docs/higher-order-components.html | High-Order Component} which must be used to provide the `dependencies` provided by the {@link module}.
 *
 * Check {@link InjectorProviderProps} for more examples and functionalities.
 *
 * eg:
 * ```tsx
 * import { InjectorProvider } from '@norabytes/reactjs-ioc';
 *
 * <InjectorProvider module={ContactUsForm.ProviderModule}>
 *  <MyComponent />
 * // You can now use `useInject` inside `MyComponent`
 * // to automatically inject the current instance of any dependency provided within the `module` prop.
 * </InjectorProvider>
 * ```
 */
export function InjectorProvider({
  module,
  children,
  injectInto = 'transient',
  preInjection,
}: InjectorReactTypes.InjectorProviderProps) {
  const contextInjector = useInjectInternal({ module, injectInto });
  const childrenProps = propsWithoutChildren(children?.props);

  const Renderer = useCallback(() => {
    preInjection?.();

    return <></>;
  }, [childrenProps]);

  return (
    <InjectorContext.Provider value={contextInjector}>
      <Renderer />
      {children}
    </InjectorContext.Provider>
  );
}
