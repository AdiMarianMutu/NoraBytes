import { type Provider, ReflectiveInjector } from 'injection-js';
import type {
  IInjectorFactory,
  IProviderModule,
  InjectorContainer,
  DependencyToken,
  CreateScopedInjectorParams,
  CreateTransientInjectorParams,
} from '../types';

export class InjectorFactory implements IInjectorFactory {
  /**
   * The `root` {@link InjectorContainer}.
   *
   * Should be used to resolve app context level `singletons`.
   */
  private rootInjector = ReflectiveInjector.resolveAndCreate([]);

  private readonly scopedInjectors = new Map<string, ReflectiveInjector>();

  injectIntoRoot(module: IProviderModule): void {
    const providers = module.getProviders();
    this.rootInjector = ReflectiveInjector.resolveAndCreate(providers, this.rootInjector);
  }

  injectIntoScoped(key: string, module: IProviderModule): void {
    if (!this.scopedInjectorExists(key)) {
      throw new Error(
        `The provided module cannot be injected into the '${key}' Scoped Injector because it does not exist`
      );
    }

    const existingScopedInjector = this.scopedInjectors.get(key)!;
    const providers = module.getProviders();

    existingScopedInjector.resolveAndCreateChild(providers);
  }

  createScopedInjector({ key, module, fromRootInjector = false }: CreateScopedInjectorParams): InjectorContainer {
    if (this.scopedInjectorExists(key)) {
      throw new Error(`The '${key}' Scoped Injector can't be created because it does already exist`);
    }

    const providers = module?.getProviders() ?? [];
    const scopedInjector = ReflectiveInjector.resolveAndCreate(
      providers,
      fromRootInjector ? this.rootInjector : undefined
    );

    this.scopedInjectors.set(key, scopedInjector);
    return scopedInjector;
  }

  createTransientInjector({ module, fromRootInjector = false }: CreateTransientInjectorParams): InjectorContainer {
    const providers = module.getProviders();

    return ReflectiveInjector.resolveAndCreate(providers, fromRootInjector ? this.rootInjector : undefined);
  }

  getRootInjector(): InjectorContainer {
    return this.rootInjector;
  }

  getScopedInjector(key: string): InjectorContainer | undefined {
    return this._getScopedInjector(key, false);
  }

  getSingleton<T>(token: DependencyToken<T>, notFoundValue?: T): T {
    return this.rootInjector.get(token, notFoundValue);
  }

  getScoped<T>(key: string, token: DependencyToken<T>, notFoundValue?: T): T {
    const scopedInjector = this._getScopedInjector(key)!;

    return scopedInjector.get(token, notFoundValue);
  }

  getTransientFromRoot<T>(token: DependencyToken<T>, notFoundValue?: T): T {
    const dependency = this.rootInjector.resolveAndInstantiate(token as Provider) as T;

    return (dependency ?? notFoundValue) as T;
  }

  getTransientFromScoped<T>(key: string, token: DependencyToken<T>, notFoundValue?: T): T {
    const dependency = this._getScopedInjector(key)!.resolveAndInstantiate(token as Provider);

    return (dependency ?? notFoundValue) as T;
  }

  deleteScopedInjector(key: string): boolean {
    return this.scopedInjectors.delete(key);
  }

  private scopedInjectorExists(key: string): boolean {
    return this.scopedInjectors.has(key);
  }

  private _getScopedInjector(key: string, throwIfDoesNotExist = true): InjectorContainer | undefined {
    const scopedInjector = this.scopedInjectors.get(key);

    if (throwIfDoesNotExist && scopedInjector === undefined) {
      throw new Error(`The '${key}' Scoped Injector does not exist`);
    }

    return scopedInjector;
  }
}

/** Global instance of the {@link InjectorFactory} `class`. */
export const Injector = new InjectorFactory();
