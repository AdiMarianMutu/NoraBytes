import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { debounceTime } from 'rxjs';
import { ComponentMock, Store } from './mocks';

export const TEST_ID = 'reflexive-store';

const store = new Store();

describe('ReactJS ReflexiveStore', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully render the component', async () => {
    await act(async () => render(<ComponentMock testId={TEST_ID} store={store} />));

    const container = await screen.findByTestId(TEST_ID);

    expect(container).not.toBeEmptyDOMElement();
  });

  it(`should have span[id="counter"] with inner html set to '0'`, async () => {
    await act(async () => render(<ComponentMock testId={TEST_ID} store={store} />));

    const container = await screen.findByTestId(TEST_ID);
    const element = container.querySelector('#counter');

    expect(element).toHaveTextContent('0');
  });

  it(`ul[id="names"] should be empty`, async () => {
    await act(async () => render(<ComponentMock testId={TEST_ID} store={store} />));

    const container = await screen.findByTestId(TEST_ID);
    const element = container.querySelector('#names');

    expect(element).toBeEmptyDOMElement();
  });

  it(`input[id="text"] value should be empty`, async () => {
    await act(async () => render(<ComponentMock testId={TEST_ID} store={store} />));

    const container = await screen.findByTestId(TEST_ID);
    const element = container.querySelector('#text')!;

    expect(element.getAttribute('value')).toBe('');
  });

  it('should successfully increment the counter', async () => {
    await act(async () => render(<ComponentMock testId={TEST_ID} store={store} />));

    const container = await screen.findByTestId(TEST_ID);
    const element = container.querySelector('#counter');

    await act(async () => store.store.counter.setValue((x) => x + 1));

    expect(element).toHaveTextContent('1');
  });

  it('should successfully show the list with the updated names', async () => {
    const names = ['Adi', 'Nicoleta', 'Maria'];

    await act(async () => render(<ComponentMock testId={TEST_ID} store={store} />));

    const container = await screen.findByTestId(TEST_ID);
    const element = container.querySelector('#names')!;

    await act(async () => store.store.more.names.setValue(names));

    element.querySelectorAll('li').forEach((li, index) => {
      expect(li).toHaveTextContent(names[index]);
    });
  });

  it('should successfully debounce the input element', async () => {
    let strokesCount = 0;

    await act(async () =>
      render(
        <ComponentMock
          testId={TEST_ID}
          store={store}
          onStoreInit={() => {
            store.storeIsReady$.subscribe((isReady) => {
              if (!isReady) return;

              store.store.more.inputText.onChange([debounceTime(50)], () => {
                strokesCount += 1;
              });
            });
          }}
        />
      )
    );

    await act(async () => store.store.more.inputText.setValue((x) => x + 'x'));
    await act(async () => store.store.more.inputText.setValue((x) => x + 'x'));
    await act(async () => store.store.more.inputText.setValue((x) => x + 'x'));
    await act(async () => store.store.more.inputText.setValue((x) => x + 'x'));
    await act(async () => {
      await new Promise((res) =>
        setTimeout(() => {
          store.store.more.inputText.setValue('NoraBytes');
          res(true);
        }, 100)
      );
    });

    expect(strokesCount).toBe(1);
    expect(store.store.more.inputText.getValue()).toBe('NoraBytes');
  });
});
