import { Get } from 'type-fest';

export type FromDotNotation<T, P extends string | readonly string[]> = Get<T, P>;
