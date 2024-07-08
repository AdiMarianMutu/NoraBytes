import React, { createContext } from 'react';
import type { ProviderProps } from './provider.props';

export const Context = createContext<Omit<ProviderProps, 'children'>>({} as any);

export function Provider({ children, ...value }: ProviderProps) {
  return React.createElement(Context.Provider, { value }, children);
}
