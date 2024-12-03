import 'reflect-metadata';

import React from 'react';
import { act, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Injector } from '../injector';
import { ComponentMock, Module, ServiceMock } from './mocks';
import type { InjectorContainer } from '../types';
import { InjectorProvider } from '../react';

export const TEST_ID = 'reactjs-ioc';

describe('ReactJS ReflexiveStore', () => {
  let injectorContainer: InjectorContainer;

  beforeEach(() => {
    injectorContainer = Injector.createTransientInjector({ module: Module });
  });

  afterEach(() => {
    jest.clearAllMocks();
    injectorContainer = undefined as any;
  });

  it('should successfully render the component', async () => {
    await act(async () => render(<ComponentMock testId={TEST_ID} />));

    const container = await screen.findByTestId(TEST_ID);

    expect(container).not.toBeEmptyDOMElement();
  });

  it('should successfully render the `nickname` from the injected service', async () => {
    const service = injectorContainer.get(ServiceMock);
    service.changeNickname('NoraBytes');

    await act(async () => render(<ComponentMock testId={TEST_ID} injectorContainer={injectorContainer} />));

    const container = await screen.findByTestId(TEST_ID);

    expect(container.querySelector('h1')?.innerHTML).toBe('NoraBytes');
  });

  it('should successfully have access to the dependency service', async () => {
    const service = injectorContainer.get(ServiceMock);
    service.depService.incrementCounter();

    await act(async () => render(<ComponentMock testId={TEST_ID} injectorContainer={injectorContainer} />));

    const container = await screen.findByTestId(TEST_ID);

    expect(container.querySelector('h2')?.innerHTML).toBe('1');
  });

  it('should NOT fail when children.props does not exist', async () => {
    await act(async () =>
      render(
        <InjectorProvider module={Module} provideInjectorContainer={injectorContainer}>
          <hr />
        </InjectorProvider>
      )
    );

    expect(true).toBe(true);
  });
});
