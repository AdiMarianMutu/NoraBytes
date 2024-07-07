import { UnknownArray, UnknownRecord } from 'type-fest';

export type IsFunction<T> = T extends (...args: any[]) => any ? true : false;
export type IsClass<T> = new (...args: any[]) => T extends new (...args: any[]) => any ? true : false;
export type IsArray<T> = T extends UnknownArray ? true : false;
export type IsRecord<T> = T extends UnknownRecord ? true : false;
