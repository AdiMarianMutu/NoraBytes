/**
 * If you are storing a property which its value is of type {@link Record} _(or a `function`, `class` and so on)_
 * and you don't want/need to have each property transformed to a {@link StoreContext},
 * you have to use this signature in order to properly inherit the `object` type signature and to correctly get the values at `run-time`.
 *
 * @example
 * ```ts
 * interface StaticObject {
 *  prop0: string;
 *  prop1: boolean;
 * }
 *
 * interface ReactiveObject extends StaticObject {}
 *
 * interface StoreModel {
 *  staticObject: ReflexiveDetachedValue<StaticObject>;
 *  reactiveObject: ReactiveObject;
 * }
 *
 * ...
 *
 * const $ = initStore({
 *  staticObject: new ReflexiveDetachedValue({
 *    prop0: 'Hello',
 *    prop1: 'NoraBytes',
 *  }),
 *  reactiveObject: {
 *    prop0: 'Hello',
 *    prop1: 'NoraBytes',
 *  }
 * });
 *
 * console.log($.store.staticObject.getValue());
 * // Output: { prop0: 'Hello', prop1: 'NoraBytes' }
 * //
 * // The `store.staticObject` does not have its children transformed into a `StoreContext`.
 *
 * console.log($.store.reactiveObject.prop0.getValue());
 * console.log($.store.reactiveObject.prop1.getValue());
 * // Output: 'Hello'
 * //         'NoraBytes'
 * //
 * // The `store.reactiveObject` has all its children transformed into a `StoreContext`.
 * ```
 */
export class DetachedValue<T> {
  constructor(public readonly value: T) {}
}
