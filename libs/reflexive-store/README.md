## **[NoraBytes](https://norabytes.com 'NoraBytes') © 2024**

### _ReflexiveStore_

### Installation

`npm install @norabytes/reflexive-store`

or

`yarn add @norabytes/reflexive-store`

### Usage

#### How it works

The `ReflexiveStore` is built on top of the [RxJS](https://rxjs.dev/ 'RxJS') library, this means that you can create very complexe responsive flows by leveraging the `RxJS` `pipe` and its `operators`.

> Before diving into how to use the `ReflexiveStore`, it is important to understand its _core_ features.

#### **`StoreContext`**

The core of the `ReflexiveStore` is the `StoreContext`. It is the `object` which you'll use the most because each `property` declared in the `StoreModel` it'll be wrapped into a `StoreContext` which exposes the `methods` and `properties`
you can use to interact with the property.

There are _3 methods_ and _2 properties_.

- **[PROPERTY] `subject`** - Is the low-level `RxJS` [BehaviorSubject](https://www.learnrxjs.io/learn-rxjs/subjects/behaviorsubject 'BehaviorSubject'), this means that all the values from your
  store are actually `BehaviorSubject`.
- **[PROPERTY] `value$`** - Is the low-level `RxJS` [Observable](https://www.learnrxjs.io/learn-rxjs/operators/creation/of 'Observable'), this means that you can `subscribe` to any value from your store and be `notified` when the value has changed.
- **[METHOD] `setValue` _(3 overloads)_** - Can be used to `update` in real-time the `value` of any property from the store.
- **[METHOD] `onChange` _(2 overloads)_** - Can be used to `register` a `callback` method which will be invoked whenever the `value` changes.
- **[METHOD] `getValue`** - Can be used to `imperatively` retrieve the value of any property from the store. _(This is not the best approach in the reactive world of RxJS)_

> Now that we know that all of our store properties are just a bunch of `StoreContext` objects, we can move forward with some examples.

#### **`StoreModel`**

The `ReflexiveStore` heavily relies on `TypeScript` and its dynamic (generic) types, therefore, in order to correctly display the `StoreContext` methods/properties in the intellisense,
the store model will be wrapped into a generic mapper type named `StoreMap`.

_You'll not have to use it directly, but it is helpful to know about its existance in order to better understand the big picture._

Start by creating a `StoreModel` interface:

> Avoid marking the properties of your `StoreModel` as `Optional` with `?` as this could interfere with the generation of the `StoreMap` generic type. Instead use `<type> | undefined`.

```ts
// ./contact-us-form/store.model.ts

import type { ReflexiveDetachedValue } from '@norabytes/reflexive-store';

export interface ContactUsFormStoreModel {
  firstName: string;
  middleName: string | undefined;
  lastName: string;
  dob: ReflexiveDetachedValue<{
    day: number;
    month: number;
    year: number;
  }>;
  info: {
    primary: string;
    secondary: string;
    additional: ReflexiveDetachedValue<Record<string, string>>;
    extra: {
      marriage: {
        isMarried: boolean;
        spouseFullName: string;
      };
      children: {
        count: number;
        list: Child[];
      };
    };
  };
  storedFunction: ReflexiveDetachedValue<() => void>;
}
```

#### **`DetachedValue`**

The `DetachedValue` is just a simple wrapper which we use to inform the `StoreMap` generic mapper type to **not** recursively wrap a property children with the `StoreContext` type.

To better understand the purpose, let's throw in some `TS` code.

```ts
// Let's say that we want to get the value of the `firstName` property, should be easy enough by doing:

const firstName = store.firstName.getValue();
```

We easily retrieved the _current_ `value` of the `firstName` property by just using the _imperative_ `getValue` method from the `StoreContext`.

```ts
// Now, we want to change the `lastName` property:

let previousLastName: string;

store.lastName.setValue((currentLastName) => {
  previousLastName = currentLastName;

  return 'Auditore';
});

console.log(previousLastName);
// => Whatever value it had before we changed it

console.log(store.lastName.getValue());
// => 'Auditore'
```

So far nothing special, now let's decide that we want to update the `dob` property, we know that we can just do `store.dob.day.setValue()`, `store.dob.month.setValue()` and `store.dob.month.setValue()`...

It starts to not feel right, can't we just update the entire `dob` object with a single invokation of the `StoreContext.setValue` method?

Yes we can! And that's exactly why we used the `DetachValue` type.

```ts
// Visual representation of the `ContactUsFormStoreModel` type.

{
  firstName: StoreContext<string>;
  middleName: StoreContext<string | undefined>;
  lastName: StoreContext<string>;
  dob: StoreContext<{ day: number; month: number; year: number }>; // Pay attention here, to the `info`, `extra`, `marriage`, `children` & `storedFunction` property type.
  info: StoreMap<{
    primary: StoreContext<string>;
    secondary: StoreContext<string>;
    additional: StoreContext<Record<string, string>>;
    extra: StoreMap<{
      marriage: StoreMap<{
        isMarried: StoreContext<boolean>;
        spouseFullName: StoreContext<string>;
      }>;
      children: StoreMap<{
        count: StoreContext<number>;
        list: StoreContext<Child[]>;
      }>;
    }>;
  }>;
  storedFunction: StoreContext<() => void>;
}
```

As you can see, the `dob` property is **not** wrapped within a `StoreMap` and its properties, `day`, `month` and `year` are **not** wrapped within a `StoreContext`.

```ts
// This means that if we try to do this:

store.dob.day.setValue(22);

// We'll get an error like "The `day` property does not exist on the `dob` property."

// So, to correctly update the `dob` property, we must do:

store.dob.setValue({
  day: 29,
  month: 09,
  year: 1969,
});

console.log(store.dob.getValue());
// => `{ day: 29, month: 09, year: 1969, }`
```

Basically, you should use the `DetachedValue` type in your `StoreModel` in the following scenarios:

- When you want to store a `function` or a `class` into a property.
- When you don't want to have all the `children` of a `property` to be mutated to a `StoreContext` object.
- When you have a very complex object which would become too brittle to manage it by having all its properties mutated to a `StoreContext` object. _(Imagine saving an `HTTP Request` object into the store without using the `DetachValue`, it'll be pure chaos)_

> The list above isn't exhaustive and of course it highly depends on the application/logic we are working on.

#### Simple Implementation

```ts
// store.model.ts

import type { ReflexiveDetachedValue } from '@norabytes/reflexive-store';

export interface StoreModel {
  counter: number;
  userData: ReflexiveDetachedValue<{
    firstName: string;
    lastName: string;
  }>;
}

// store.ts

import { ReflexiveStore } from '@norabytes/reflexive-store';

export class Store extends ReflexiveStore<StoreModel> {
  // However you can skip overriding the internal `onStoreInit` method.
  protected override onStoreInit(): void {
    console.log(`The 'AppStore' has been successfully initialized.`);
  }

  // However you can skip overriding the internal `onDispose` method.
  protected override onDispose(): void {
    console.log(`The 'AppStore' is being disposed.`);
  }
}

// app.ts

import { ReflexiveStore, ReflexiveDetachedValue } from '@norabytes/reflexive-store';
import { debounceTime } from 'rxjs';
import { Store } from './store';

class App {
  appStore: Store;

  constructor() {
    this.store = new Store();
  }

  onInit(): void {
    this.store.initStore({
      count: 0,
      userData: new ReflexiveDetachedValue({
          firstName: '',
          lastName: '',
        })
    });

    this.subscribeToCounterChanges();
    this.subscribeToUserDataChanges();
  }

  onAppDispose(): void {
    this.appStore.dispose();
  }

  incrementCounter(): void {
    this.appStore.store.count.setValue((p) => p + 1);
  }

  updateUserData(firstName: string, lastName: string): void {
    this.appStore.store.userData.setValue({
      firstName,
      lastName,
    });
  }

  private subscribeToCounterChanges(): void {
    this.appStore.store.counter.onChange((counterValue) => {
      console.log('Counter is now at', counterValue);
    });
  }

  private subscribeToUserDataChanges(): void {
    this.appStore.store.userData.onChange({
      with: [debounceTime(250)],
      do: (newUserData) => {
        this.fictionalApiService.updateUserData(newUserData);
      }
    });
  }
}

// ./button

onClick={app.incrementCounter()}
```

#### Live Examples

You can see and test in real-time some examples by accessing [this CodeSandbox](https://codesandbox.io/p/sandbox/reflexive-store-y6zk7y 'CodeSandbox') link.

#### ReactJS Plugin

The `ReflexiveStore` has a native plugin which can be used with `ReactJS`, check it out at https://www.npmjs.com/package/@norabytes/reactjs-reflexive-store.
