// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Provider, ReflectiveInjector } from 'injection-js';
import type { InjectorTypes } from '../types';

/** Can be used to "bundle" the `dependencies` which you must provide to a {@link ReflectiveInjector | container}. */
export class ProviderModule implements InjectorTypes.IProviderModule {
  private readonly imports?: InjectorTypes.IProviderModule[];
  private readonly providers?: Provider[];

  constructor({ imports, providers }: InjectorTypes.ProviderModuleConstructor) {
    this.imports = imports;
    this.providers = providers;
  }

  getProviders(): Provider[] {
    if (!this.hasImports() && !this.hasProviders()) return [];

    const importsProviders = this.getProvidersFromImports(this.imports);
    const providers = this.providers ?? [];

    return [...importsProviders, ...providers];
  }

  private hasImports(): boolean {
    return typeof this.imports !== 'undefined' && this.imports.length > 0;
  }

  private hasProviders(): boolean {
    return typeof this.providers !== 'undefined' && this.providers.length > 0;
  }

  private getProvidersFromImports(imports: InjectorTypes.ProviderModuleConstructor['imports']): Provider[][] {
    if (!imports || imports.length === 0) return [];

    return imports.flatMap((module) => {
      const _module = module as InjectorTypes.ProviderModuleConstructor;
      const providers = _module.providers ?? [];
      const nestedProviders = _module.imports ? this.getProvidersFromImports(_module.imports) : [];

      return [providers, ...nestedProviders];
    });
  }
}
