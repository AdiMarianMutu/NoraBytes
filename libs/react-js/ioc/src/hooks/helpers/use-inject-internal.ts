import { ReflectiveInjector, Injector as InjectorJs } from 'injection-js';
import { useContext } from 'react';
import type { ProviderModule } from '../../models';
import { Injector } from '../../injector';
import { InjectorContext } from '../../injector.context';
import { useOnce } from './use-once';

export function useInjectInternal(deps: ProviderModule) {
  const rootInjector = useContext(InjectorContext) as ReflectiveInjector;
  const contextInjector = useOnce(() => {
    if (rootInjector === InjectorJs.NULL) {
      return Injector.createTransientInjector({ deps, fromRootInjector: false });
    }

    return rootInjector.resolveAndCreateChild(Injector.unwrapDeps(deps));
  });

  return contextInjector;
}
