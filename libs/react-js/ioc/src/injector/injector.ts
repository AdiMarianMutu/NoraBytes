import { type Provider, ReflectiveInjector } from 'injection-js';
import type {
  ProviderModule,
  CreateScopedInjectorParams,
  CreateTransientInjectorParams,
  DependencyToken,
  IInjectorFactory,
} from '../models';

export class InjectorFactory implements IInjectorFactory {
  /**
   * The `root` {@link ReflectiveInjector | Injector}.
   *
   * Should be used to resolve app context level `singletons`.
   */
  private rootInjector = ReflectiveInjector.resolveAndCreate([]);

  private readonly scopedInjectors = new Map<string, ReflectiveInjector>();

  injectIntoRoot(deps: ProviderModule): void {
    const unwrapedDeps = this.unwrapDeps(deps);

    this.rootInjector = ReflectiveInjector.resolveAndCreate(unwrapedDeps, this.rootInjector);
  }

  injectIntoScoped(key: string, deps: ProviderModule): void {
    if (!this.scopedInjectorExists(key)) {
      throw new Error(
        `The provided deps cannot be injected into the '${key}' Scoped Injector because it does not exist`
      );
    }

    const unwrapedDeps = this.unwrapDeps(deps);
    const scopedInjector = this.scopedInjectors.get(key)!;

    this.scopedInjectors.set(key, ReflectiveInjector.resolveAndCreate(unwrapedDeps, scopedInjector));
  }

  createScopedInjector({ key, deps, fromRootInjector = false }: CreateScopedInjectorParams): ReflectiveInjector {
    if (this.scopedInjectorExists(key)) {
      throw new Error(`The '${key}' Scoped Injector can't be created because it does already exist`);
    }

    const unwrapedDeps = this.unwrapDeps(deps);

    if (!fromRootInjector) {
      const resolvedDeps = ReflectiveInjector.resolve(unwrapedDeps);
      return ReflectiveInjector.fromResolvedProviders(resolvedDeps);
    }

    return this.rootInjector.resolveAndCreateChild(unwrapedDeps);
  }

  createTransientInjector({ deps, fromRootInjector = false }: CreateTransientInjectorParams): ReflectiveInjector {
    const unwrapedDeps = this.unwrapDeps(deps);

    if (!fromRootInjector) {
      const resolvedDeps = ReflectiveInjector.resolve(unwrapedDeps);
      return ReflectiveInjector.fromResolvedProviders(resolvedDeps);
    }

    return ReflectiveInjector.resolveAndCreate(unwrapedDeps, this.rootInjector);
  }

  getRootInjector(): ReflectiveInjector {
    return this.rootInjector;
  }

  getScopedInjector(key: string): ReflectiveInjector | undefined {
    return this._getScopedInjector(key, false);
  }

  getSingleton<T>(
    token: DependencyToken<T>,
    notFoundValue?: T
  ): typeof notFoundValue extends undefined ? T | undefined : T {
    return this.rootInjector.get(token, notFoundValue);
  }

  getScoped<T>(
    key: string,
    token: DependencyToken<T>,
    notFoundValue?: T
  ): typeof notFoundValue extends undefined ? T | undefined : T {
    const scopedInjector = this._getScopedInjector(key)!;

    return scopedInjector.get(token, notFoundValue);
  }

  getTransientFromRoot<T>(provider: T): T | undefined {
    return this.rootInjector.resolveAndInstantiate(provider as Provider);
  }

  getTransientFromScoped<T>(key: string, provider: T): T | undefined {
    const scopedInjector = this._getScopedInjector(key)!;

    return scopedInjector.resolveAndInstantiate(provider as Provider);
  }

  deleteScopedInjector(key: string): boolean {
    return this.scopedInjectors.delete(key);
  }

  unwrapDeps(deps?: ProviderModule): Provider[] {
    if (deps === undefined) return [];

    const recursivelyUnrwapProvidersFromModule = (modules?: ProviderModule[]): Provider[][] => {
      return (
        modules?.flatMap((module) => {
          const providers = module.providers ?? [];
          const nestedProviders = module.modules ? recursivelyUnrwapProvidersFromModule(module.modules) : [];

          return [providers, ...nestedProviders];
        }) ?? []
      );
    };

    const moduleProviders = recursivelyUnrwapProvidersFromModule(deps.modules);
    const providers = deps.providers ?? [];

    return [...moduleProviders, ...providers];
  }

  private scopedInjectorExists(key: string): boolean {
    return this.scopedInjectors.has(key);
  }

  private _getScopedInjector(key: string, throwIfDoesNotExist = true): ReflectiveInjector | undefined {
    const scopedInjector = this.scopedInjectors.get(key);

    if (throwIfDoesNotExist && scopedInjector === undefined) {
      throw new Error(`The '${key}' Scoped Injector does not exist`);
    }

    return scopedInjector;
  }
}

export const Injector = new InjectorFactory();
