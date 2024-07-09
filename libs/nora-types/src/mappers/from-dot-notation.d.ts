import { Get } from 'type-fest';

/**
 * Can be used to extract the value type from an `object` by providing the
 * `path` as a `dot-notation` string.
 *
 * _This is a `wrapper` of the {@link Get | TypeFest.Get} type._
 */
export type FromDotNotation<T, P extends string | readonly string[]> = Get<T, P>;
