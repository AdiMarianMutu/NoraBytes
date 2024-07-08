import { Store, STORE_DEFAULT_VALUES } from './mocks';

describe('StoreContext.getValue', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const store = new Store();
  store.initStore(STORE_DEFAULT_VALUES);

  it(`should be an empty string`, async () => {
    const value = store.store.primitives.string.getValue();

    expect(value).toBe('');
  });

  it(`should be a number '0'`, async () => {
    const value = store.store.primitives.number.getValue();

    expect(value).toBe(0);
  });

  it(`should be a bigint '0x1fffffffffffff'`, async () => {
    const value = store.store.primitives.bigInt.getValue();

    expect(value).toBe(BigInt(0x1fffffffffffff));
  });

  it(`should be a boolean 'false'`, async () => {
    const value = store.store.primitives.bool.getValue();

    expect(value).toBe(false);
  });

  it(`should be a Symbol 'NoraBytes'`, async () => {
    const value = store.store.primitives.symbol.getValue();

    expect(value.toString()).toBe(Symbol('NoraBytes').toString());
  });

  it(`should be a string or undefined`, async () => {
    const value = store.store.primitives._opts.string.getValue();

    expect(value).toBe(undefined);
  });

  it(`should be an empty array`, async () => {
    const value = store.store.arrays.string.getValue();

    expect(value.length).toBe(0);
  });

  it(`should be a method which returns 'Hello NoraBytes!'`, async () => {
    const value = store.store.compelx.methods.string.getValue();

    expect(value()).toBe('Hello NoraBytes!');
  });

  it(`should be a method which returns '{ key: 'Nora', value: 'Bytes' }'`, async () => {
    const value = store.store.compelx.methods.wParams.getValue();

    expect(value('Nora', 'Bytes')).toEqual({ key: 'Nora', value: 'Bytes' });
  });

  it(`should be an instance of a class`, async () => {
    const value = store.store.compelx.class.getValue();

    expect(value.classProp0).toBe('NoraBytes');
    expect(value.classProp1).toBe(0);
  });

  it(`should be the Primitives object`, async () => {
    const value = store.store.detachedValue.getValue();

    expect(value).toEqual(STORE_DEFAULT_VALUES.primitives);
  });
});
