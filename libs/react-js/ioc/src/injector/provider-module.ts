// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Provider, ReflectiveInjector } from 'injection-js';
import type { InjectorTypes } from '../types';

/** Can be used to "bundle" the `dependencies` which you must provide to a {@link ReflectiveInjector | container}. */
export class ProviderModule implements InjectorTypes.IProviderModule {
  private readonly imports: InjectorTypes.IProviderModule[];
  private readonly providers: Provider[];
  private readonly exports: Provider[];

  constructor({ imports = [], providers = [], exports = [] }: InjectorTypes.ProviderModuleConstructor) {
    this.imports = imports;
    this.providers = providers;
    this.exports = exports;
  }

  getProviders(): Provider[] {
    const importsProviders = this.getProvidersFromImports(this.imports);

    return [...importsProviders, ...this.providers];
  }

  private getExportableProviders({
    providers = [],
    exports = [],
  }: InjectorTypes.ProviderModuleConstructor): Provider[] {
    if (exports.length === 0) return providers;

    return exports;
  }

  private getProvidersFromImports(imports: InjectorTypes.ProviderModuleConstructor['imports']): Provider[][] {
    if (!imports || imports.length === 0) return [];

    return imports.flatMap((module) => {
      const _module = module as InjectorTypes.ProviderModuleConstructor;
      const providers = this.getExportableProviders(_module);
      const nestedProviders = _module.imports ? this.getProvidersFromImports(_module.imports) : [];

      return [providers, ...nestedProviders];
    });
  }
}
