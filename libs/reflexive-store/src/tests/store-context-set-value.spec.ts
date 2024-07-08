import { DetachedValue } from '../utils';
import { Store, STORE_DEFAULT_VALUES } from './mocks';

describe('StoreContext.setValue', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const store = new Store();
  store.initStore(STORE_DEFAULT_VALUES);

  it(`should set to 'NoraBytes'`, async () => {
    store.store.primitives.string.setValue('NoraBytes');
    const value = store.store.primitives.string.getValue();

    expect(value).toBe('NoraBytes');
  });

  it(`should set to '1969'`, async () => {
    store.store.primitives.number.setValue(1969);
    const value = store.store.primitives.number.getValue();

    expect(value).toBe(1969);
  });

  it(`should set to '0b11111111111111111111111111111111111111111111111111111'`, async () => {
    const bigInt = BigInt(0b11111111111111111111111111111111111111111111111111111);

    store.store.primitives.bigInt.setValue(bigInt);
    const value = store.store.primitives.bigInt.getValue();

    expect(value).toBe(bigInt);
  });

  it(`should set to 'true'`, async () => {
    store.store.primitives.bool.setValue(true);
    const value = store.store.primitives.bool.getValue();

    expect(value).toBe(true);
  });

  it(`should set Symbol to 'Hello NoraBytes!'`, async () => {
    store.store.primitives.symbol.setValue(Symbol('Hello NoraBytes!'));
    const value = store.store.primitives.symbol.getValue();

    expect(value.toString()).toBe(Symbol('Hello NoraBytes!').toString());
  });

  it(`should set to 'NoraBytes' from undefined`, async () => {
    store.store.primitives._opts.string.setValue('NoraBytes');
    const value = store.store.primitives._opts.string.getValue();

    expect(value).toBe('NoraBytes');
  });

  it(`should set to an array of strings`, async () => {
    const array = ['Hello', 'NoraBytes', '!'];

    store.store.arrays.string.setValue(array);
    const value = store.store.arrays.string.getValue();

    expect(value).toEqual(array);
  });

  it(`should set a method which returns '22/03/2013'`, async () => {
    store.store.compelx.methods.string.setValue(new DetachedValue(() => '22/03/2013'));
    const value = store.store.compelx.methods.string.getValue();

    expect(value()).toBe('22/03/2013');
  });

  it(`should set a method which returns '{ key: 'Hello', value: 'NoraBytes' }'`, async () => {
    const resultObj = { key: 'Hello', value: 'NoraBytes' };

    store.store.compelx.methods.wParams.setValue(new DetachedValue(() => resultObj));
    const value = store.store.compelx.methods.wParams.getValue();

    expect(value('Nora', 'Bytes')).toEqual(resultObj);
  });
});
