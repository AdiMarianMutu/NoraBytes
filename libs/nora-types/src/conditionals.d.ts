import { Primitive, UnknownArray, UnknownRecord } from 'type-fest';

export type IsPrimitive<T> = T extends Primitive ? true : false;
export type IsFunction<T> = T extends (...args: any[]) => any ? true : false;
export type IsArray<T> = T extends UnknownArray ? true : false;
export type IsRecord<T> = T extends UnknownRecord ? true : false;
