import type React from 'react';
import type { Models } from './injector';

export interface ContainerProviderProps {
  children: React.ReactElement | null;

  /**
   * The `container` module.
   *
   * @see {@link ContainerModule}
   */
  module: Models.ContainerModule;

  /**
   * Can be used to get access to the component `dependencies` before the component has been rendered.
   *
   * eg:
   * ```tsx
   * <DI.React.Container module={ContactUsForm.ComponentModule} preInjection={() => {
   *  const componentService = DI.React.useInject(MyComponent.Service);
   *
   *  componentService.init();
   * }}>
   *  <MyComponent />
   * </DI.React.Container>
   * ```
   */
  preInjection?: () => void;
}
