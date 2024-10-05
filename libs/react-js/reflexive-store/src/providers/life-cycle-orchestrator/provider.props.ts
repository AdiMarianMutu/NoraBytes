import type { Observable } from 'rxjs';
import type { ProviderPropsBase } from '../provider-base.models';

export interface ProviderProps extends ProviderPropsBase {
  /**
   * The `disposeEvent` {@link Observable} which will be automatically used by all the children.
   *
   * This is useful when you have nested children components with their own `ReflexiveStore`
   * and you must ensure that their `store` will be disposed only when the parent _(the provider)_
   * is being disposed.
   */
  disposeEvent$: Observable<void>;
}
