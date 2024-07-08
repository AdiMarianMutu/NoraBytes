import { BehaviorSubject, Observable, takeUntil, skip, take, type OperatorFunction } from 'rxjs';
import type * as NoraTypes from '@norabytes/nora-types';
import type { RequiredDeep } from 'type-fest';
import { type StoreContextBuilder, isDetachedValue, storeObservableFactory } from './utils';
import type { IReflexiveStore, InitStoreConfig, StoreContext, StoreMap, StoreReduceResult } from './types';

export abstract class ReflexiveStore<StoreModel extends Record<string, any>> implements IReflexiveStore<StoreModel> {
  get store(): StoreMap<StoreModel> {
    if (!this.storeIsReady) {
      throw new Error(`The ReflexiveStore is inaccessible because you must first invoke the 'initStore' method`);
    }

    return this.internalStore as StoreMap<StoreModel>;
  }

  get storeIsReady(): boolean {
    return this.storeInitializedSubject?.getValue() ?? false;
  }

  get storeIsDisposed(): boolean {
    return this.disposeEventSubject?.getValue() ?? false;
  }

  storeIsReady$: Observable<boolean>;
  disposeEvent$: Observable<boolean>;

  protected readonly storeContextBuilder: StoreContextBuilder<StoreModel, this>;

  private internalStore!: StoreMap<StoreModel>;
  private storeInitializedSubject: BehaviorSubject<boolean>;
  private disposeEventSubject: BehaviorSubject<boolean>;

  initStore(props: RequiredDeep<StoreModel>, config?: InitStoreConfig): this {
    if (this.storeIsReady) return this;

    if (props === undefined || props === null || Object.keys(props).length === 0) {
      throw new Error(`The provided 'props' parameter is either 'undefined', 'null' or an empty object`);
    }

    this.init(props, config);

    return this;
  }

  reduceStore<T extends NoraTypes.Mappers.DotNotation<StoreModel>[]>(...ctx: T): StoreReduceResult<StoreModel, T> {
    return ctx.reduce<StoreContext<StoreModel>[]>((reduceResult, storeModelDotNotationKey) => {
      const storeCtx = storeModelDotNotationKey.split('.').reduce((a, b) => a[b], this.store as any);

      return [...reduceResult, storeCtx];
    }, []) as StoreReduceResult<StoreModel, T>;
  }

  storeContextFactory<T>(value: T): StoreContext<T>;
  storeContextFactory<T>(value: T, ...pipe: OperatorFunction<T, T>[]): StoreContext<T>;
  storeContextFactory<T>(value: T, ...pipe: OperatorFunction<T, T>[]): StoreContext<T> {
    const extendsMainPipe = pipe !== undefined && pipe.length > 0;
    const storeContext = this.storeContextBuilder.build(value, this);

    if (extendsMainPipe) {
      storeContext.value$ = storeObservableFactory(storeContext.subject, this.disposeEvent$, ...pipe);
    }

    return storeContext;
  }

  disposeStore(): void {
    this.internalStore = undefined as any;
    this.storeInitializedSubject.next(false);
    this.storeInitializedSubject.complete();
    this.disposeEventSubject.next(true);
    this.disposeEventSubject.complete();
  }

  /** You can override this method to execute your business logic once the {@link store} has been initalized. */
  protected onStoreInit(): void {}

  /** You can override this method to execute your business logic _before_ the {@link store} `dispose` process. */
  protected onDispose(): void {}

  /** **Internally used, do not use.** */
  protected iterateStoreModel<T extends Record<string, any>>(
    currentNode: StoreModel,
    cb: (pKey: string, pValue: unknown, pNode: Record<string, any>, pKeyPath: string) => unknown,
    currentNodeKey = ''
  ): T {
    const nodeMap = {} as T;

    for (const [pKey, pValue] of Object.entries(currentNode)) {
      const isNestedKvpObject =
        typeof pValue === 'object' && !Array.isArray(pValue) && !isDetachedValue(pValue) && pValue !== null;

      // The current node has nested nodes, we process them too
      if (isNestedKvpObject && Object.keys(pValue as any).length > 0) {
        currentNodeKey += `${pKey}.`;

        //@ts-expect-error Unknown type
        nodeMap[pKey] = this.iterateStoreModel(pValue as StoreModel, cb, currentNodeKey);
      } else {
        //@ts-expect-error Unknown type
        nodeMap[pKey] = cb(pKey, pValue, currentNode, currentNodeKey.substring(0, currentNodeKey.length - 1));
      }
    }

    return nodeMap;
  }

  protected extractStoreContextByDotNotation<T>(keyNodePath: string, currentKey: string): StoreContext<T> {
    const isRootNode = keyNodePath.length === 0;
    const keyDotPath = `${isRootNode ? '' : `${keyNodePath}.`}${currentKey}`;

    return keyDotPath.split('.').reduce((a, b) => a[b], this.store as any);
  }

  private init(props: RequiredDeep<StoreModel>, config?: InitStoreConfig): void {
    this.storeInitializedSubject = new BehaviorSubject(false);
    this.disposeEventSubject = config?.disposeEventSubject ?? new BehaviorSubject(false);
    this.disposeEvent$ = this.disposeEventSubject.asObservable().pipe(skip(1), take(1));
    this.storeIsReady$ = this.storeInitializedSubject.asObservable().pipe(takeUntil(this.disposeEvent$));

    this.buildStoreContext(props);
    this.onStoreInit();

    this.storeInitializedSubject.next(true);
  }

  private buildStoreContext(props: RequiredDeep<StoreModel>): void {
    this.internalStore = this.iterateStoreModel(props as any, (_, value) => {
      return this.storeContextBuilder.build(value, this);
    });
  }
}
