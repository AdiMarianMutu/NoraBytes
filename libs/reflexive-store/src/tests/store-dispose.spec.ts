import { finalize } from 'rxjs';
import { Store, STORE_DEFAULT_VALUES } from './mocks';

describe('Store Dispose', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it(`should be disposed`, async () => {
    const store = new Store();
    store.initStore(STORE_DEFAULT_VALUES);
    store.disposeStore();

    expect(store.storeIsDisposed).toBeTruthy();
  });

  it(`should throw an error when trying to access a disposed store`, async () => {
    const store = new Store();
    store.initStore(STORE_DEFAULT_VALUES);
    store.disposeStore();

    const t = () => store.store.primitives.string.setValue('NoraBytes');

    expect(t).toThrow(/is inaccessible/);
  });

  it(`should have all the subscriptions completed`, (done) => {
    const store = new Store();
    store.initStore(STORE_DEFAULT_VALUES);

    store.store.arrays.bigInt.onChange({
      with: [finalize(() => done())],
      do: () => {},
    });

    store.disposeStore();
  }, 500);
});
