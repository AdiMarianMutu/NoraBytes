import { ReflexiveStore as ReflexiveStoreBase, type ReflexiveStoreMap } from '@norabytes/reflexive-store';
import type * as NoraTypes from '@norabytes/nora-types';
import type { Observable } from 'rxjs';
import type { RequiredDeep } from 'type-fest';
import { useContext, useMemo } from 'react';
import isEqual from 'lodash.isequal';
import type { IReflexiveStore, StoreMap, InitStoreConfig, StoreContext, StoreReduceResult } from './types';
import { StoreContextBuilder, useEffectOnce } from './utils';
import { LifeCycleOrchestrator } from './providers';

export abstract class ReflexiveStore<StoreModel extends Record<string, any>>
  extends ReflexiveStoreBase<StoreModel, StoreMap<StoreModel> & ReflexiveStoreMap<StoreModel>>
  implements IReflexiveStore<StoreModel>
{
  protected override readonly storeContextBuilder: StoreContextBuilder<StoreModel, this>;

  constructor() {
    super();

    this.storeContextBuilder = new StoreContextBuilder<StoreModel, this>();
  }

  useInitStore(props: RequiredDeep<StoreModel>, config?: InitStoreConfig<this>): this {
    const [_disposeEvent$, _disposeEventIsFrom] = this.getDisposeEventFromCtxOrOwn();
    this.disposeEvent$ = _disposeEvent$;

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
      this.onComponentMount();

      return () => {
        if (_disposeEventIsFrom === 'own') {
          this.onDispose();
          this.disposeStore();
        } else {
          _disposeEvent$.subscribe(() => {
            this.onDispose();
            this.disposeStore();
          });
        }
      };
    });

    return this;
  }

  useBindToProps(props: Partial<StoreModel>): this {
    useMemo(() => {
      this.iterateStoreModel(props as StoreModel, (key, newValue, node, keyNodePath) => {
        const storeContext = this.extractStoreContextByDotNotation<typeof newValue>(keyNodePath, key);
        const currentValue = storeContext.getValue();

        if (isEqual(currentValue, newValue)) return;

        storeContext.setValue(newValue);
      });
    }, [props]);

    return this;
  }

  useReduceStore<T extends NoraTypes.Mappers.LeavesDotNotation<StoreModel>[]>(
    ...ctx: T
  ): StoreReduceResult<StoreModel, T> {
    const storeContexts = super.reduceStore(...ctx);

    return storeContexts.map((ctx) => (ctx as StoreContext<any>).useValue()) as StoreReduceResult<StoreModel, T>;
  }

  useDispose(callback: () => void | Promise<void>): void {
    useEffectOnce(() => {
      this.disposeEvent$.subscribe(() => callback);

      return () => {};
    });
  }

  /** You can override this method which will be `invoked` once the component did mount. */
  protected onComponentMount(): void {}

  private getDisposeEventFromCtxOrOwn(): [Observable<boolean>, 'ctx' | 'own'] {
    const { disposeEvent$: ctxDisposeEvent$ } = useContext(LifeCycleOrchestrator.Context);
    const disposeEventIsFromCtx = ctxDisposeEvent$ !== undefined;

    return [ctxDisposeEvent$ ?? this.disposeEvent$, disposeEventIsFromCtx ? 'ctx' : 'own'];
  }
}
