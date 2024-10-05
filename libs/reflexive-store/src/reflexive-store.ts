import { BehaviorSubject, first, map, type OperatorFunction } from 'rxjs';
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
  OnStoreInitConfig,
} from './types';

export class ReflexiveStore<
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
  storeDisposeEvent$: StoreObservable<void>;

  protected readonly storeContextBuilder: StoreContextBuilder<StoreModel, this>;

  private internalStore!: StoreMap;
  private storeInitializedSubject: BehaviorSubject<boolean>;
  private disposeEventSubject: BehaviorSubject<boolean>;

  private eventsCallbackMap = new Map<'onInit' | 'onDispose', (() => void)[]>([
    ['onInit', []],
    ['onDispose', []],
  ]);

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

  onStoreInit(config: OnStoreInitConfig): void {
    this.eventsCallbackMap.set('onInit', [...this.eventsCallbackMap.get('onInit'), config.invoke]);
  }

  onStoreDispose(cb: () => void): void {
    this.eventsCallbackMap.set('onDispose', [...this.eventsCallbackMap.get('onDispose'), cb]);
  }

  reduceStore<T extends ReflexiveStoreToDotNotation<StoreModel>[]>(...ctx: T): StoreReduceResult<StoreModel, T> {
    return ctx.reduce<StoreContext<StoreModel>[]>((reduceResult, storeModelDotNotationKey) => {
      const storeCtx = storeModelDotNotationKey.split('.').reduce((a, b) => a[b], this.store as any);

      return [...reduceResult, storeCtx];
    }, []) as StoreReduceResult<StoreModel, T>;
  }

  storeContextFactory<T>(value: T): StoreContext<T>;
  storeContextFactory<T>(value: T, ...pipe: OperatorFunction<any, any>[]): StoreContext<unknown>;
  storeContextFactory<T>(value: T, ...pipe: OperatorFunction<any, any>[]): StoreContext<unknown> {
    const extendsMainPipe = pipe !== undefined && pipe.length > 0;
    const storeContext = this.storeContextBuilder.build('<store-context-factory>', value, this);

    if (extendsMainPipe) {
      storeContext.value$ = storeObservableFactory(
        storeContext.subject,
        this.storeDisposeEvent$,
        ...pipe
      ) as StoreObservable<T>;
    }

    return storeContext;
  }

  disposeStore(): void {
    this.eventsCallbackMap.get('onDispose').forEach((cb) => cb());
    this.eventsCallbackMap.set('onDispose', []);

    this.internalStore = undefined as any;
    this.storeInitializedSubject.next(false);
    this.storeInitializedSubject.complete();
    this.disposeEventSubject.next(true);
    this.disposeEventSubject.complete();
  }

  /** **Internally used, do not use.** */
  protected iterateStoreModel<T extends Record<string, any>>(
    currentNode: StoreModel,
    cb: (pKey: string, pValue: unknown, pNode: Record<string, any>, pKeyPath: string) => unknown,
    currentNodeKey = ''
  ): T {
    const nodeMap = {} as T;

    for (const [pKey, pValue] of Object.entries(currentNode)) {
      const keyPath = currentNodeKey ? `${currentNodeKey}.${pKey}` : pKey;

      if (
        typeof pValue === 'object' &&
        pValue !== null &&
        !(pValue instanceof DetachedValue) &&
        !Array.isArray(pValue)
      ) {
        // Process nested nodes
        //@ts-expect-error Unknown type
        nodeMap[pKey] = this.iterateStoreModel(pValue as StoreModel, cb, keyPath);
      } else {
        // Call callback for leaf nodes
        //@ts-expect-error Unknown type
        nodeMap[pKey] = cb(pKey, pValue, currentNode, keyPath);
      }
    }

    return nodeMap;
  }

  private init(props: RequiredDeep<StoreModel>, config?: InitStoreConfig): void {
    this.storeInitializedSubject = new BehaviorSubject(false);
    this.storeIsReady$ = storeObservableFactory(this.storeInitializedSubject, this.storeDisposeEvent$);

    this.disposeEventSubject = config?.disposeEventSubject ?? new BehaviorSubject(false);
    this.storeDisposeEvent$ = this.disposeEventSubject.asObservable().pipe(
      first((x) => x === true),
      map(() => {})
    );

    this.buildStoreContext(props);
    this.emitOnStoreInit();
  }

  private buildStoreContext(props: RequiredDeep<StoreModel>): void {
    this.internalStore = this.iterateStoreModel(props as any, (key, value) => {
      return this.storeContextBuilder.build(key, value, this);
    });
  }

  private emitOnStoreInit(): void {
    this.storeInitializedSubject.next(true);
    this.eventsCallbackMap.get('onInit').forEach((cb) => cb());

    this.eventsCallbackMap.set('onInit', []);
  }
}
