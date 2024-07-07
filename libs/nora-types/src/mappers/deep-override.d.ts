/**
 * Deeply overrides the `values` of {@link T}'s keys with {@link U}'s keys and values.
 *
 * eg:
 *
 * ```ts
 * interface T {
 *   firstName: string;
 *   lastName: string;
 *   nested: {
 *     nested1: {
 *       property0: string;
 *     };
 *   };
 * }
 *
 * interface U {
 *   type: string;
 *   isValid: boolean;
 * }
 *
 * // Result
 *
 * {
 *   firstName: {
 *     type: string;
 *     isValid: boolean;
 *   };
 *   lastName: {
 *     type: string;
 *     isValid: boolean;
 *   };
 *   nested: {
 *     nested1: {
 *       property0: {
 *         type: string;
 *         isValid: boolean;
 *       };
 *     };
 *   };
 * }
 * ```
 */
export type DeepOverride<T, U> = {
  [P in keyof T]: T[P] extends object ? DeepOverride<T[P], U> : U;
};
