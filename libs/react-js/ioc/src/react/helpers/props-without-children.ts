import type * as AdvancedTypes from 'type-fest';

/** Helper method which can be used to remove the `children` property from the provided {@link props}. */
export function propsWithoutChildren<T extends Record<string, any>>(props: T): PropsWithoutChildrenReturn<T> {
  const hasChildren = 'children' in props;

  if (!hasChildren) return props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ..._propsWithoutChildren } = props;

  return _propsWithoutChildren as PropsWithoutChildrenReturn<T>;
}

type PropsWithoutChildrenReturn<T extends Record<string, any>> = AdvancedTypes.Simplify<
  AdvancedTypes.Except<T, 'children'>
>;
