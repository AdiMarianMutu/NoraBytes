import type React from 'react';
import type { Models } from './injector';

export interface InjectorProviderProps {
  children: React.ReactElement | null;

  /** The {@link Models.ProviderModule | ProviderModule}. */
  module: Models.ProviderModule;

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
