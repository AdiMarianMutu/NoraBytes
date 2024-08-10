import { InjectorContainer } from '../../types';
import { InjectorProvider, useInject } from '../../react';
import { Module, ServiceMock } from './services';

export function ComponentMock({
  testId,
  injectorContainer,
}: {
  testId: string;
  injectorContainer?: InjectorContainer;
}) {
  return (
    <InjectorProvider module={Module} provideInjectorContainer={injectorContainer}>
      <Renderer testId={testId} />
    </InjectorProvider>
  );
}

function Renderer({ testId }: { testId: string }) {
  const service = useInject(ServiceMock);

  return (
    <div data-testid={testId}>
      <h1>{service.nickname}</h1>
      <h2>{service.depService.counter}</h2>
    </div>
  );
}
