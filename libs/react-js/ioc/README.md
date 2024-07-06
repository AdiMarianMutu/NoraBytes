## **[NoraBytes](https://norabytes.com 'NoraBytes') © 2024**

### [ReactJS](https://react.dev/ 'ReactJS') Inversion of Control _(Compatible with **NextJS**!)_

### Installation

`npm install @norabytes/reactjs-ioc`

or

`yarn add @norabytes/reactjs-ioc`

### Usage

Steps to correctly enable the [Reflect API](https://262.ecma-international.org/6.0/#sec-reflection 'Reflect API').

1. Install the [@abraham/reflection](https://www.npmjs.com/package/@abraham/reflection '@abraham/reflection') library or the [reflect-metadata](https://www.npmjs.com/package/reflect-metadata 'reflect-metadata') library.
2. If you are using `TypeScript`, set to `true` the below properties in your `tsconfig.json` file:
   1. `experimentalDecorators`
   2. `emitDecoratorMetadata`
3. Provide the installed [Reflect API](https://262.ecma-international.org/6.0/#sec-reflection 'Reflect API') `polyfill` by either doing:
   1. In your `.env` file add: `NODE_OPTIONS=--require @abraham/reflection` or `NODE_OPTIONS=--require reflect-metadata`
   2. Manually import it with `import '@abraham/reflection'` or `import 'reflect-metadata'` into your app `entrypoint` file.
   3. Use the `polyfills` provider of your `transpiler` of choice.

### Example

**Global Module**

- Create an `ApiService` which will be provided globally _(Singleton)_ from the `AppModule`.

```ts
// ./services/api/api.service.ts

import { Injectable } from '@norabytes/reactjs-ioc';

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

export const ApiServiceModule = new ProviderModule({
  providers: [ApiService],
});
```

- Create an `UserService` which will have access to the `ApiService` by `constructor` injection.

```ts
// ./services/user/user.service.ts

import { Injectable } from '@norabytes/reactjs-ioc';

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

export const UserServiceModule = new ProviderModule({
  providers: [UserService],
});
```

- Create an `app.module.ts` file:

```ts
// ./app.module.ts

import type { ProviderModule } from '@norabytes/reactjs-ioc';

// Modules
import { ApiServiceModule } from './api';
import { UserServiceModule } from './user';

export const AppModule = new ProviderModule({
  // By importing these modules, their `providers` will be automatically resolved by the `injector` container.
  imports: [ApiServiceModule, UserServiceModule],
});
```

You can now inject both the `ApiService` and the `UserService` in your `ReactJS` functional components by doing so:

> The below is an example of an `HoComponent` which wraps your entire ReactJS app, this should be used to provide `singletons` globally down to your entire app.

```tsx
// ./app.tsx

import { Injector, InjectorProvider } from '@norabytes/reactjs-ioc';
import React from 'react';
import { AppModule } from './app.module';
import { RootLayout } from './root.layout';

export function App({ children }: { React.ReactElement }) {
  return (
    <InjectorProvider injectInto="root" module={AppModule}>
      <RootLayout>{children}</RootLayout>
    </InjectorProvider>
  );
}
```

```tsx
// ./pages/home.tsx

// The `Homepage` components is rendered by the `RootLayout` somewhere down the tree.

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

### NextJS

#### Client Components

> If you are using the new `app` folder introduced with `NextJS v13`, then you should be careful to add the `'use client'` directive at the top of the components
> which are going to use the `useInject` hook and the `InjectorProvider` HoComponent.

#### Server Components

_FAQs:_

- **How to have a `root` container for my entire app without using the `'use client'` directive?**
  - _Instead of using the HoC `InjectorProvider`, you can use the `Injector` API to create a `scoped` container, then use that container to inject directly
    into your components._
    > eg:
    >
    > ```tsx
    > // ./app.tsx
    >
    > // Be aware that you'll get this error `'React.createContext' is not a function` when trying to import the `Injector` inside a `ServerComponent`
    > // by using this import statement: `import { Injector } from '@norabytes/reactjs-ioc'`
    > //
    > // This happens because the `import { Injector } from '@norabytes/reactjs-ioc'` uses barrel files to export from the library.
    > //
    > // You can avoid this by using the follwoing import statement.
    > import { Injector } from '@norabytes/reactjs-ioc/dist/src/injector';
    > import React from 'react';
    > import { AppModule } from './app.module';
    > import { RootLayout } from './root.layout';
    >
    > export const MY_APP_CONTAINER_KEY = 'APP_CONTAINER_KEY';
    >
    > Injector.createScopedInjector({
    >    key: MY_APP_CONTAINER_KEY,
    >    module: AppModule,
    >    // If you have already injected some modules into the `root` container and you want to be able to also resolve
    >    // those dependencies when using this `scoped` container, you must also add the below line.
    >    fromRootInjector: true
    > });
    >
    > export function App({ children }: { React.ReactElement }) {
    >   return <RootLayout>{children}</RootLayout>;
    > }
    > ```
    >
    > ```tsx
    >
    > import { Injector } from '@norabytes/reactjs-ioc';
    > import React from 'react';
    > import { MY_APP_CONTAINER_KEY } from '...';
    > import { MyService } from '...';
    >
    > export async function MyServerComponent({ children }: { React.ReactElement }) {
    >   // Now you have access to your service/dependency.
    >   //
    >   // N.B: While this would work, it is not the best approach, you should strive to use the `useInject`
    >   //      hook as it is optimized especially to be used with ReactJS functional components.
    >   //      Therefore the correct way would be to use the `'use client'` directive at the top of any component
    >   //      which must have some dependencies injected into it.
    >   const myService = Injector.getScoped(MY_APP_CONTAINER_KEY, MyService);
    >
    >   return <h1>Hello NoraBytes!</h1>;
    > }
    > ```

### Unit Tests

Below some examples of how to mock your `dependencies` in your `Unit Tests`

```ts
// ./my-component/tests/mocks/my-component.service.mock.ts

import { Injectable } from '@norabytes/reactjs-ioc';
import { MyComponentService, AnotherService } from '...';

@Injectable()
export class MyComponentServiceMock extends MyComponentService {
  constructor(private override readonly anotherService: AnotherService) {}

  override realMethod(): void {
    console.log('The `realMethod` has been mocked!');
  }
}
```

```ts
// ./my-component/tests/mocks/my-component.module.mock.ts

import { ProviderModule } from '@norabytes/reactjs-ioc';
import { MyComponentService, MyComponentServiceMock, AnotherService } from '...';

export const MyComponentModuleMock = new ProviderModule({
  providers: [
    { provide: MyComponentService, useClass: MyComponentServiceMock },
    AnotherService
  ];
});
```

```ts
// ./my-component/tests/mocks/my-component.mock.ts

import { InjectorProvider } from '@norabytes/reactjs-ioc';
import { MyComponent, MyComponentModuleMock } from '...';

export function MyComponentMock(props: PropsType) {
  return (
    <InjectorProvider module={MyComponentModuleMock}>
      <MyComponent />
    </InjectorProvider>
  );
}
```

Now you can use the `MyComponentMock` in your `Unit Tests`.

### `Injector` API

> Check also the API of the [injection-js](https://www.npmjs.com/package/injection-js#api 'injection-js') library.

As this library is natively built with `TypeScript`, we encourage you to just check the `IInjectorFactory` interface which can be found
at `node_modules/@norabytes/reactjs-ioc/dist/src/types/injector/injector-factory.d.ts`
