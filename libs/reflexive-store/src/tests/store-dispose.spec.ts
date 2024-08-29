import { finalize } from 'rxjs';
import { Store, STORE_DEFAULT_VALUES } from './mocks';

describe('Store Dispose', () => {
  let store: Store;

  beforeEach(() => {
    store = new Store();
    store.initStore(STORE_DEFAULT_VALUES);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should be disposed`, async () => {
    store.disposeStore();

    expect(store.storeIsDisposed).toBeTruthy();
  });

  it(`should throw an error when trying to access a disposed store`, async () => {
    store.disposeStore();

    const t = () => store.store.primitives.string.setValue('NoraBytes');

    expect(t).toThrow(/is inaccessible/);
  });

  it(`should have all the subscriptions completed`, (done) => {
    store.store.arrays.bigInt.onChange([finalize(() => done())], () => {});

    store.disposeStore();
  }, 500);
});
