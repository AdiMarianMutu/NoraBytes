import { Store, STORE_DEFAULT_VALUES } from './mocks';

describe('Store Reduce', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const store = new Store();
  store.initStore(STORE_DEFAULT_VALUES);

  it(`'getValue' should successfully work`, async () => {
    const [arrayBigInt, emptyString] = store.reduceStore('arrays.bigInt', 'primitives.string');

    expect(arrayBigInt.getValue().length).toBe(0);
    expect(emptyString.getValue()).toBe('');
  });

  it(`'setValue' should successfully work`, async () => {
    const [arrayBigInt, emptyString] = store.reduceStore('arrays.bigInt', 'primitives.string');

    arrayBigInt.setValue([BigInt(10)]);
    emptyString.setValue('NOT_EMPTY');

    expect(arrayBigInt.getValue()).toEqual([BigInt(10)]);
    expect(emptyString.getValue()).toBe('NOT_EMPTY');
  });
});
