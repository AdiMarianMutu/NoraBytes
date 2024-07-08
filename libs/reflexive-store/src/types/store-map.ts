import type { Primitive, RequiredDeep } from 'type-fest';
import type { StoreContext } from './store-context';
import type { DetachedValue } from './detached-value';

export type StoreMap<T> = RequiredDeep<_StoreMap<T>>;

// prettier-ignore
type _StoreMap<StoreModel> = {
  [K in keyof StoreModel]:

  // Types which must be wrapped with the `DetachedValue` type.
  StoreModel[K] extends
    ((...args: any[]) => any) |
    undefined |
    void 
    ? DetachedValueWrapperRequired :

  // Valid Types.
  StoreModel[K] extends DetachedValue<infer U> ? StoreContext<U> : 
  StoreModel[K] extends Primitive | Array<any> ? StoreContext<StoreModel[K]> :

  // Recursively keep mapping the `StoreModel`.
  _StoreMap<StoreModel[K]>;
}

type DetachedValueWrapperRequired = 'USE_THE_DETACHED_VALUE_WRAPPER';

// const a = {} as StoreMap<StoreModelMockup>;

// // Mockup StoreModel used to test the `StoreMap` generic type.
// interface StoreModelMockup {
//   string: string;
//   primitives: _Primitives;
//   arrays: _Arrays;
//   compelx: {
//     methods: _Methods;
//     classes: _Classes;
//     union: {
//       string: 'A' | 'B' | 'C';
//       bool: true | false;
//       mixed: number | string | string[];
//     };
//   };
//   record: {
//     _invalid: {
//       undefined: undefined;
//       void: void;
//       undefinedOpt?: undefined;
//       voidOpt?: void;
//     };
//     string: string;
//     stringOpt?: string;
//     detachedValue: DetachedValue<_Primitives>;
//   };
// }
// interface _Primitives {
//   string: string | undefined;
//   number: number;
//   bigInt: bigint;
//   bool: boolean;
//   symbol: symbol;
//   _opt: {
//     string?: string;
//     number?: number;
//     bigInt?: bigint;
//     bool?: boolean;
//     symbol?: symbol;
//   };
// }
// interface _Arrays {
//   string: string[];
//   number: number[];
//   bigInt: bigint[];
//   bool: boolean[];
//   symbol: symbol[];
//   _opt: {
//     string?: string[];
//     number?: number[];
//     bigInt?: bigint[];
//     bool?: boolean[];
//     symbol?: symbol[];
//   };
// }
// interface _Methods {
//   _invalids: {
//     void: () => void;
//     string: () => string;
//     wParams: (key: string, value: any) => { key: string; value: any };
//     wGenericParams: <T>(value: T) => T;
//     wGenericParamsAsync: <T>(value: T) => Promise<T>;
//     voidOpt?: () => void;
//     stringOpt?: () => string;
//     wParamsOpt?: (key: string, value: any) => { key: string; value: any };
//     wGenericParamsOpt?: <T>(value: T) => T;
//   };
//   void: DetachedValue<() => void>;
//   wGenericParams: DetachedValue<<T>(value: T) => T>;
//   wGenericParamsAsync: DetachedValue<<T>(value: T) => Promise<T>>;
//   voidOpt?: DetachedValue<() => void>;
//   wGenericParamsOpt?: DetachedValue<<T>(value: T) => T>;
// }
// interface _Classes {
//   invalid: _Class;
//   valid: DetachedValue<_Class>;
// }
// class _Class {
//   name: string;
//   age?: number;
// }
