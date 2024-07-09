import type { Provider } from 'injection-js';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { IProviderModule, ProviderModuleConstructor, InjectorContainer } from '../types';

/** Can be used to "bundle" the `dependencies` which you must provide to a {@link InjectorContainer}. */
export class ProviderModule implements IProviderModule {
  private readonly imports: IProviderModule[];
  private readonly providers: Provider[];
  private readonly exports: Provider[];

  constructor({ imports = [], providers = [], exports = [] }: ProviderModuleConstructor) {
    this.imports = imports;
    this.providers = providers;
    this.exports = exports;
  }

  getProviders(): Provider[] {
    const importsProviders = this.getProvidersFromImports(this.imports);

    return [...importsProviders, ...this.providers];
  }

  private getExportableProviders({ providers = [], exports = [] }: ProviderModuleConstructor): Provider[] {
    if (exports.length === 0) return providers;

    return exports;
  }

  private getProvidersFromImports(imports: ProviderModuleConstructor['imports']): Provider[][] {
    if (!imports || imports.length === 0) return [];

    return imports.flatMap((module) => {
      const _module = module as ProviderModuleConstructor;
      const providers = this.getExportableProviders(_module);
      const nestedProviders = _module.imports ? this.getProvidersFromImports(_module.imports) : [];

      return [providers, ...nestedProviders];
    });
  }
}
