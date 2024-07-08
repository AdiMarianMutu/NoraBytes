import type { DetachedValue } from '../../../utils';
import type { TestClass } from '../test-class';

export interface StoreModelMockup {
  primitives: Primitives;
  arrays: {
    string: string[];
    number: number[];
    bigInt: bigint[];
    bool: boolean[];
    symbol: symbol[];
  };
  compelx: {
    methods: {
      void: DetachedValue<() => void>;
      string: DetachedValue<() => string>;
      wParams: DetachedValue<(key: string, value: any) => { key: string; value: any }>;
      wGenericParams: DetachedValue<<T>(value: T) => T>;
    };
    class: DetachedValue<TestClass>;
    union: {
      string: 'A' | 'B' | 'C';
      bool: true | false;
      mixed: number | string | string[] | DetachedValue<TestClass>;
    };
  };
  detachedValue: DetachedValue<Primitives>;
}

interface Primitives {
  string: string;
  number: number;
  bigInt: bigint;
  bool: boolean;
  symbol: symbol;
  _opts: {
    string: DetachedValue<string | undefined>;
    number: DetachedValue<number | undefined>;
    bigInt: DetachedValue<bigint | undefined>;
    bool: DetachedValue<boolean | undefined>;
    symbol: DetachedValue<symbol | undefined>;
  };
}
