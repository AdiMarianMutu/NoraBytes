## **[NoraBytes](https://norabytes.com 'NoraBytes') © 2024**

### [ReactJS](https://react.dev/ 'ReactJS') _Inversion of Control_

### Usage

Steps to correctly enable the [Reflect API](https://262.ecma-international.org/6.0/#sec-reflection 'Reflect API').

1. Install the [@abraham/reflection](https://www.npmjs.com/package/@abraham/reflection '@abraham/reflection') library.
2. If you are using `TypeScript`, set to `true` the below properties in your `tsconfig.json` file:
   1. `experimentalDecorators`
   2. `emitDecoratorMetadata`
3. Globally require the [@abraham/reflection](https://www.npmjs.com/package/@abraham/reflection '@abraham/reflection') `polyfill`.
   1. In your `.env` file add: `NODE_OPTIONS=--require @abraham/reflection`

### Example

**Global Module**

- Create an `ApiService` which will be provided globally _(Singleton)_ from the `AppModule`.

```ts
// ./services/api/api.service.ts

import { Injectable } from 'injection-js';

@Injectable()
export class ApiService {
  async fetchData(endpoint: string, data: any): Promise<Response> {
    // Fetch data logic
  }
}
```

```ts
// ./services/api/api.module.ts

import type { ProviderModule } from '@norabytes/reactjs-ioc';
import { ApiService } from './api.service';

export const ApiServiceModule: ProviderModule = {
  providers: [ApiService],
};
```

- Create an `UserService` which will have access to the `ApiService` by `constructor` injection.

```ts
// ./services/user/user.service.ts

import { Injectable } from 'injection-js';

@Injectable()
export class UserService {
  constructor(private readonly apiService: ApiService) {}

  async createNewUser(userData: UserData): Promise<bool> {
    // You can access the `ApiService` everywhere inside your `UserService` instance.
    const response = await this.apiService.fetchData('/api/v1/create-user', userData);
  }
}
```

```ts
// ./services/user/user.module.ts

import type { ProviderModule } from '@norabytes/reactjs-ioc';
import { UserService } from './user.service';

export const UserServiceModule: ProviderModule = {
  providers: [UserService],
};
```

- Create an `app.module.ts` file:

```ts
// ./app.module.ts

import type { ProviderModule } from '@norabytes/reactjs-ioc';

// Dependencies
import { ApiService, UserService } from './services';

export const AppModule: ProviderModule = {
  // Doing this will automatically resolve and provide the `providers` deps array from both services.
  modules: [ApiService.ApiServiceModule, UserService.UserServiceModule],
};
```

You can now inject both the `ApiService` and the `UserService` in your `ReactJS` functional components by doing so:

> The below is an example of an `HoComponent` which wraps your entire ReactJS app, this should be used to provide `singletons` globally down to your entire app.

```tsx
// ./app.tsx

// N.B: If you use `NextJS` with the new `app` folder, you must add `'use client';`
// at the root of the component which uses the `InjectorProvider` HoC!

import { Injector, InjectorProvider } from '@norabytes/reactjs-ioc';
import React from 'react';
import { AppModule } from './app.module';
import { Homepage } from './pages/home';

// This injects all the `ProviderModules` into the main container.
Injector.injectIntoRoot(AppModule);

export function App({ children }: { React.ReactElement }) {
  return (
    <InjectorProvider module={AppModule}>
      <Homepage>
    </InjectorProvider>
  );
}
```

```tsx
// ./pages/home.tsx

import { useInject } from '@norabytes/reactjs-ioc';
import { useEffect } from 'react';
import { ApiService } from '../services/api';

export function Homepage() {
  const apiService = useInject(ApiService);

  useEffect(() => {
    apiService.fetchData('url', data);
  }, []);
}
```

### API

> Check also the API of the [injection-js](https://www.npmjs.com/package/injection-js 'injection-js') library.

TO-DO: Write docs for the API.
