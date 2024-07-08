import { ReflexiveStore } from '../../../reflexive-store';
import type { StoreModelMockup } from './store.model';

export class Store extends ReflexiveStore<StoreModelMockup> {
  protected override onStoreInit(): void {
    global['__storeInitCallback'] = true;
  }

  protected override onDispose(): void {
    global['__storeDisposeEvent'] = true;
  }
}
