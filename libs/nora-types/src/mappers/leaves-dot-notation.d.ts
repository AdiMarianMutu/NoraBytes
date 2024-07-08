/**
 * Helper `Type` which can be used to map all the `leaves keys` in {@link T} to dot notation strings.
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
 * const t: DotNotation<MyInterface>;
 *
 * // It'll produce:
 * `isActive` | `user.firstName` | `user.lastName` | `dob.day` | `dob.month` | `dob.year` | `info.location.city`
 * ```
 *
 * @credits https://github.com/millsp/ts-toolbelt/discussions/286#discussion-3788755.
 */
export type LeavesDotNotation<T, Depth extends number = 10> = [Depth] extends [never]
  ? ''
  : T extends Record<string, any>
  ? {
      [K in keyof T]-?: IsStringLiteral<K> extends true ? Join<K, LeavesDotNotation<T[K], Prev[Depth]>> : '';
    }[keyof T]
  : '';

type IsStringLiteral<T> = T extends string ? ('' extends T ? false : true) : false;
type Join<K, P> = K extends string
  ? P extends string
    ? IsStringLiteral<P> extends true
      ? `${K}.${P}`
      : K
    : P extends number
    ? K
    : never
  : never;
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...0[]];
