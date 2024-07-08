import { DetachedValue } from '../../utils';
import type { StoreModelMockup } from '../mocks';
import { TestClass } from './test-class';

const PRIMITIVES: StoreModelMockup['primitives'] = {
  string: '',
  number: 0,
  bigInt: BigInt(0x1fffffffffffff),
  bool: false,
  symbol: Symbol('NoraBytes'),
  _opts: {
    string: new DetachedValue(undefined),
    number: new DetachedValue(undefined),
    bigInt: new DetachedValue(undefined),
    bool: new DetachedValue(undefined),
    symbol: new DetachedValue(undefined),
  },
};

export const STORE_DEFAULT_VALUES: StoreModelMockup = {
  primitives: PRIMITIVES,
  arrays: {
    string: [],
    number: [],
    bigInt: [],
    bool: [],
    symbol: [],
  },
  compelx: {
    methods: {
      void: new DetachedValue(() => {}),
      string: new DetachedValue(() => 'Hello NoraBytes!'),
      wParams: new DetachedValue((key: string, value: string) => {
        return { key, value };
      }),
      wGenericParams: new DetachedValue(<T>() => null as T),
    },
    class: new DetachedValue(new TestClass()),
    union: {
      string: 'B',
      bool: false,
      mixed: new DetachedValue(new TestClass()),
    },
  },
  detachedValue: new DetachedValue(PRIMITIVES),
};
