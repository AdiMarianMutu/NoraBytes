/**
 * Helper `Type` which can be used to mapp all {@link Key}s in {@link T} to dot notation strings.
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
 */
export type DotNotation<T extends Record<string, unknown>, Key = keyof T> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${DotNotation<T[Key]>}`
    : `${Key}`
  : never;
