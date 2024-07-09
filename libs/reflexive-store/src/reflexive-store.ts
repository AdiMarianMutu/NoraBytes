import { BehaviorSubject, first, skip, take, type OperatorFunction } from 'rxjs';
import type { RequiredDeep } from 'type-fest';
import { StoreContextBuilder, DetachedValue, storeObservableFactory } from './utils';
import type {
  IReflexiveStore,
  InitStoreConfig,
  StoreContext,
  StoreMap as StoreMapBase,
  StoreObservable,
  StoreReduceResult,
  ReflexiveStoreToDotNotation,
} from './types';

export abstract class ReflexiveStore<
  StoreModel extends Record<string, any>,
  StoreMap extends StoreMapBase<StoreModel> = StoreMapBase<StoreModel>
> implements IReflexiveStore<StoreModel>
{
  get store(): StoreMap {
    if (!this.storeIsReady) {
      throw new Error(`The ReflexiveStore is inaccessible because you must first invoke the 'initStore' method`);
    }

    return this.internalStore as StoreMap;
  }

  get storeIsReady(): boolean {
    return this.storeInitializedSubject?.getValue() ?? false;
  }

  get storeIsDisposed(): boolean {
    return this.disposeEventSubject?.getValue() ?? false;
  }

  storeIsReady$: StoreObservable<boolean>;
  disposeEvent$: StoreObservable<boolean>;

  protected readonly storeContextBuilder: StoreContextBuilder<StoreModel, this>;

  private internalStore!: StoreMap;
  private storeInitializedSubject: BehaviorSubject<boolean>;
  private disposeEventSubject: BehaviorSubject<boolean>;

  constructor() {
    this.storeContextBuilder = new StoreContextBuilder();
  }

  initStore(props: RequiredDeep<StoreModel>, config?: InitStoreConfig): this {
    if (this.storeIsReady) return this;

    if (props === undefined || props === null || Object.keys(props).length === 0) {
      throw new Error(`The provided 'props' parameter is either 'undefined', 'null' or an empty object`);
    }

    this.init(props, config);

    return this;
  }

  reduceStore<T extends ReflexiveStoreToDotNotation<StoreModel>[]>(...ctx: T): StoreReduceResult<StoreModel, T> {
    return ctx.reduce<StoreContext<StoreModel>[]>((reduceResult, storeModelDotNotationKey) => {
      const storeCtx = storeModelDotNotationKey.split('.').reduce((a, b) => a[b], this.store as any);

      return [...reduceResult, storeCtx];
    }, []) as StoreReduceResult<StoreModel, T>;
  }

  storeContextFactory<T>(value: T): StoreContext<T>;
  storeContextFactory<T>(value: T, ...pipe: OperatorFunction<T, T>[]): StoreContext<T>;
  storeContextFactory<T>(value: T, ...pipe: OperatorFunction<T, T>[]): StoreContext<T> {
    const extendsMainPipe = pipe !== undefined && pipe.length > 0;
    const storeContext = this.storeContextBuilder.build('<store-context-factory>', value, this);

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
        typeof pValue === 'object' && !Array.isArray(pValue) && !(pValue instanceof DetachedValue) && pValue !== null;

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
    this.storeIsReady$ = storeObservableFactory(this.storeInitializedSubject, this.disposeEvent$);

    this.buildStoreContext(props);
    this.subscribeToStoreIsReady();

    this.storeInitializedSubject.next(true);
  }

  private buildStoreContext(props: RequiredDeep<StoreModel>): void {
    this.internalStore = this.iterateStoreModel(props as any, (key, value) => {
      return this.storeContextBuilder.build(key, value, this);
    });
  }

  private subscribeToStoreIsReady(): void {
    this.storeIsReady$.pipe(first((isReady) => isReady)).subscribe(() => {
      this.onStoreInit();
    });
  }
}
