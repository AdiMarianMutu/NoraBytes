import { Store, STORE_DEFAULT_VALUES } from './mocks';

describe('Store Initialization', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error', async () => {
    const store = new Store();

    const t = () => store.store.primitives.string;

    expect(t).toThrow(/invoke the 'initStore' method/);
  });

  it(`'storeIsReady' should be true`, async () => {
    const store = new Store();

    store.initStore(STORE_DEFAULT_VALUES);

    expect(store.storeIsReady).toBeTruthy();
  });
});
