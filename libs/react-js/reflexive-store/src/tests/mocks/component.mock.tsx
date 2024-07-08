import React, { useEffect } from 'react';
import { debounceTime } from 'rxjs';
import { Store, STORE_DEFAULT_VALUES } from './store';

export function ComponentMock({
  testId,
  store,
  onStoreInit,
}: {
  testId: string;
  store: Store;
  onStoreInit?: () => void;
}) {
  store.useInitStore(STORE_DEFAULT_VALUES);

  const [counter, names] = store.useReduceStore('counter', 'more.names');
  const inputText = store.store.more.inputText.useValue(true, debounceTime(50));

  useEffect(() => {
    onStoreInit?.();
  }, [store.storeIsReady]);

  return (
    <div data-testid={testId}>
      <span id="counter">{counter}</span>

      <ul id="names">
        {names.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>

      <input id="text" value={inputText} onChange={() => {}} />
    </div>
  );
}

export function ShouldBeRendered({ render, children }: { render: boolean; children: React.ReactElement }) {
  if (!render) return <></>;

  return <>{children}</>;
}
