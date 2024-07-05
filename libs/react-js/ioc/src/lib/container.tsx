import React, { useCallback } from 'react';
import { propsWithoutChildren } from './helpers';
import type { ContainerProviderProps } from './models';
import { InjectorContext } from './contexts';
import { useInjectInternal } from './hooks/helpers';

export function Container({ module, children, preInjection }: ContainerProviderProps) {
  const contextInjector = useInjectInternal(module);
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
