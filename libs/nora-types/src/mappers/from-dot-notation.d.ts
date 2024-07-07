import { DotNotation } from './dot-notation';

/**
 * Can be used to infer the generic type from a {@link DotNotation} `Type`.
 */
export type FromDotNotation<T, P extends string> = PathValue<T, Split<P, '.'>>;

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

type PathValue<T, P extends string[]> = P extends [infer Key, ...infer Rest]
  ? Key extends keyof T
    ? Rest extends string[]
      ? PathValue<T[Key & keyof T], Rest>
      : T[Key & keyof T]
    : never
  : T;
