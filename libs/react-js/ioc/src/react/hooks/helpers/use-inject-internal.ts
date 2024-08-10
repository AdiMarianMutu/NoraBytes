import { ReflectiveInjector, Injector as InjectorJs } from 'injection-js';
import { useContext } from 'react';
import type { InjectorProviderProps } from '../../../types';
import { Injector } from '../../../injector';
import { InjectorContext } from '../../injector.context';
import { useOnce } from './use-once';

export function useInjectInternal({
  module,
  injectInto = 'transient',
  provideInjectorContainer,
}: Pick<InjectorProviderProps, 'module' | 'injectInto' | 'provideInjectorContainer'>) {
  const injectorContainer = useContext(InjectorContext) as ReflectiveInjector;

  const contextInjector = useOnce(() => {
    if (injectorContainer === InjectorJs.NULL) {
      if (provideInjectorContainer) {
        return provideInjectorContainer;
      } else if (injectInto === 'root') {
        Injector.injectIntoRoot(module);

        return Injector.getRootInjector();
      } else if (injectIntoIsScoped(injectInto)) {
        const key = injectInto.split(':')[1];
        Injector.injectIntoScoped(key, module);

        return Injector.getScopedInjector(key);
      } else if (injectInto === 'transient') {
        return Injector.createTransientInjector({ module, fromRootInjector: false });
      } else {
        return injectInto.resolveAndCreateChild(module.getProviders());
      }
    }

    return injectorContainer.resolveAndCreateChild(module.getProviders());
  });

  return contextInjector as ReflectiveInjector;
}

function injectIntoIsScoped(injectInto: any): injectInto is `scoped:${string}` {
  return typeof injectInto === 'string' && injectInto.startsWith('scoped:');
}
