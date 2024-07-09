import { Paths } from 'type-fest';

/**
 * Helper `Type` which can be used to map all `keys` in {@link T} to dot notation strings.
 *
 * eg:
 *
 * ```ts
 * interface MyInterface {
 *  user: {
 *    firstName: string;
 *    lastName: string;
 *    dob: {
 *      day: number;
 *      month: number;
 *      year: number;
 *    };
 *    info: {
 *      location: {
 *        city: string;
 *      };
 *    };
 *  };
 *  isActive: boolean;
 * }
 *
 * ToDotNotation<MyInterface>;
 * // =>
 * 'isActive' | 'user' | 'user.dob' | 'user.info' | 'user.info.location' | 'user.firstName' | 'user.lastName' | 'user.dob.day' | 'user.dob.month' | 'user.dob.year' | 'user.info.location.city'
 *
 * // Only leaves keys.
 * ToDotNotation<MyInterface, true>;
 * // =>
 * 'isActive' | 'user.firstName' | 'user.lastName' | 'user.dob.day' | 'user.dob.month' | 'user.dob.year' | 'user.info.location.city'
 * ```
 */
export type ToDotNotation<T, LeavesOnly extends boolean = false> = LeavesOnly extends false ? Paths<T> : PathsLeaves<T>;

type PathsLeaves<T> = T extends object
  ? {
      [K in keyof T]-?: T[K] extends any[] ? keyof T : Join<K, PathsLeaves<T[K]>>;
    }[keyof T]
  : '';

type Join<K, P> = K extends string ? (P extends string ? `${K}${'' extends P ? '' : '.'}${P}` : never) : never;
