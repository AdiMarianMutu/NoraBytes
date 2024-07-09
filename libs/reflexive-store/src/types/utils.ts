import type { DetachedValue } from '../utils';

export type ReflexiveStoreToDotNotation<T, Depth extends number = 8, CurrentDepth extends number[] = []> = [
  ...CurrentDepth,
  0
]['length'] extends Depth
  ? ''
  : T extends object
  ? {
      [K in keyof T]-?: T[K] extends any[]
        ? K
        : T[K] extends DetachedValue<any>
        ? K
        : Join<K, ReflexiveStoreToDotNotation<T[K], Depth, [...CurrentDepth, 0]>>;
    }[keyof T]
  : '';

type Join<K, P> = K extends string ? (P extends string ? `${K}${'' extends P ? '' : '.'}${P}` : never) : never;
