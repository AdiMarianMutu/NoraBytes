import { Injector } from 'injection-js';
import { createContext } from 'react';

export const InjectorContext = createContext<Injector>(Injector.NULL);
