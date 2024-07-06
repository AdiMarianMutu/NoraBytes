import { type ReflectiveInjector, Injector as InjectorJs } from 'injection-js';
import { useContext } from 'react';
import type { InjectorProviderProps } from '../../types';
import { Injector } from '../../injector';
import { InjectorContext } from '../../injector.context';
import { useOnce } from './use-once';

export function useInjectInternal({
  module,
  injectInto = 'transient',
}: Pick<InjectorProviderProps, 'module' | 'injectInto'>) {
  const injectorContainer = useContext(InjectorContext) as ReflectiveInjector;

  const contextInjector = useOnce(() => {
    if (injectorContainer === InjectorJs.NULL) {
      if (injectInto === 'root') {
        return Injector.injectIntoRoot(module);
      } else if (injectIntoIsScoped(injectInto)) {
        const key = injectInto.split(':')[1];

        return Injector.injectIntoScoped(key, module);
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
