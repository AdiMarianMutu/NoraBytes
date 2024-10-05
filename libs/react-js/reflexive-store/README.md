## **[NoraBytes](https://norabytes.com 'NoraBytes') © 2024**

### _ReactJS ReflexiveStore_

### Installation

`npm install @norabytes/reactjs-reflexive-store`

or

`yarn add @norabytes/reactjs-reflexive-store`

### Breaking Changes

- `v1.3.3`:
  - The base `ReflexiveStore` lib has been updated to the `v2.2.0` which inclused breaking changes, check them on the [npm page](https://www.npmjs.com/package/@norabytes/reflexive-store 'ReflexiveStore').
  - The `useBindToProps` hook has been removed.
    - Use the `useEffect` hook, eg: `useEffect(() => { store.dep1.setValue(dep1); store.dep2.setValue(dep2); }, [dep1, dep2])`
  - The `onComponentMount` method has been removed.
    - Use the `componentIsMounted$` observable instead.

### Usage

TO-DO: Write the `Usage` section.

#### How it works

Please check the [ReflexiveStore](https://www.npmjs.com/package/@norabytes/reflexive-store 'ReflexiveStore') main `npm` page.

#### Live Examples

You can see and test in real-time some examples by accessing [this CodeSandbox](https://codesandbox.io/p/sandbox/reflexive-store-y6zk7y 'CodeSandbox') link.
