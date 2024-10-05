import {
  ReflexiveStore as ReflexiveStoreBase,
  reflexiveStoreObservableFactory,
  type ReflexiveStoreMap,
  type ReflexiveStoreToDotNotation,
  type ReflexiveStoreObservable,
} from '@norabytes/reflexive-store';
import { BehaviorSubject, type Observable, type OperatorFunction } from 'rxjs';
import type { RequiredDeep } from 'type-fest';
import { useContext, useMemo } from 'react';
import type { IReflexiveStore, StoreMap, InitStoreConfig, StoreContext, StoreReduceResult } from './types';
import { StoreContextBuilder, useEffectOnce } from './utils';
import { LifeCycleOrchestrator } from './providers';

export class ReflexiveStore<StoreModel extends Record<string, any>>
  extends ReflexiveStoreBase<StoreModel, StoreMap<StoreModel> & ReflexiveStoreMap<StoreModel>>
  implements IReflexiveStore<StoreModel>
{
  componentIsMounted$: ReflexiveStoreObservable<boolean | null>;

  protected override readonly storeContextBuilder: StoreContextBuilder<StoreModel, this>;

  private readonly componentIsMountedSubject = new BehaviorSubject<boolean | null>(null);

  constructor() {
    super();

    this.storeContextBuilder = new StoreContextBuilder<StoreModel, this>();

    this.componentIsMounted$ = reflexiveStoreObservableFactory(this.componentIsMountedSubject, this.storeDisposeEvent$);
  }

  override storeContextFactory<T>(value: T): StoreContext<T>;
  override storeContextFactory<T>(value: T, ...pipe: OperatorFunction<any, any>[]): StoreContext<unknown>;
  override storeContextFactory<T>(value: T, ...pipe: OperatorFunction<any, any>[]): StoreContext<unknown> {
    return super.storeContextFactory(value, ...pipe) as StoreContext<unknown>;
  }

  useInitStore(props: RequiredDeep<StoreModel>, config?: InitStoreConfig<this>): this {
    const [_disposeEvent$, _disposeEventIsFrom] = this.getDisposeEventFromCtxOrOwn();
    this.storeDisposeEvent$ = _disposeEvent$;

    // Eager initialization.
    useMemo(() => this.initStore(props, config), []);

    useEffectOnce(() => {
      // Needed to make sure that if the store is disposed
      // after an unmount, we'll have to re-init it.
      // Completely safe to use because the `initStore` does return itself if already initialized.
      this.initStore(props, config);

      // From functional component
      config?.onMountCallback?.(this);
      // Directly from the class
      this.componentIsMountedSubject.next(true);

      return () => {
        this.componentIsMountedSubject.next(false);

        if (_disposeEventIsFrom === 'own') {
          this.disposeStore();
        } else {
          _disposeEvent$.subscribe(() => {
            this.disposeStore();
          });
        }
      };
    });

    return this;
  }

  useReduceStore<T extends ReflexiveStoreToDotNotation<StoreModel>[]>(...ctx: T): StoreReduceResult<StoreModel, T> {
    const storeContexts = super.reduceStore(...ctx);

    return storeContexts.map((ctx) => (ctx as StoreContext<any>).useValue()) as StoreReduceResult<StoreModel, T>;
  }

  useDispose(callback: () => void | Promise<void>): void {
    useEffectOnce(() => {
      this.storeDisposeEvent$.subscribe(() => callback);

      return () => {};
    });
  }

  private getDisposeEventFromCtxOrOwn(): [Observable<void>, 'ctx' | 'own'] {
    const { disposeEvent$: ctxDisposeEvent$ } = useContext(LifeCycleOrchestrator.Context);
    const disposeEventIsFromCtx = ctxDisposeEvent$ !== undefined;

    return [ctxDisposeEvent$ ?? this.storeDisposeEvent$, disposeEventIsFromCtx ? 'ctx' : 'own'];
  }
}
