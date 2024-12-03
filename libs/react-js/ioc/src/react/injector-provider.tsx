import { useCallback } from 'react';
import { propsWithoutChildren } from './helpers';
import type { InjectorProviderProps } from '../types';
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
  provideInjectorContainer,
  preInjection,
}: InjectorProviderProps) {
  const contextInjector = useInjectInternal({ module, injectInto, provideInjectorContainer });
  const childrenProps = propsWithoutChildren();

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
