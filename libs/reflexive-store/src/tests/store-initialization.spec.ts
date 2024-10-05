import { Store, STORE_DEFAULT_VALUES } from './mocks';

describe('Store Initialization', () => {
  let store: Store;

  beforeEach(() => {
    store = new Store();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error', async () => {
    const t = () => store.store.primitives.string;

    expect(t).toThrow(/invoke the 'initStore' method/);
  });

  it(`'storeIsReady' should be true`, async () => {
    store.initStore(STORE_DEFAULT_VALUES);

    expect(store.storeIsReady).toBeTruthy();
  });

  it(`should invoke the 'onStoreInit' callbacks`, (done) => {
    let firstCbResult = false;

    store.onStoreInit({
      invoke: () => (firstCbResult = true),
    });
    store.onStoreInit({
      invoke: () => {
        if (!firstCbResult) return;

        done();
      },
    });

    store.initStore(STORE_DEFAULT_VALUES);
  });

  it(`should not invoke the 'onStoreInit' callbacks after the store already init`, () => {
    let result = false;

    store.initStore(STORE_DEFAULT_VALUES);

    store.onStoreInit({
      invoke: () => (result = true),
    });

    expect(result).toBeFalsy();
  });
});
