import { ProviderModule } from '../../../injector';
import { ServiceMock } from './main.service.mock';
import { DepServiceMock } from './dep.service.mock';

export const Module = new ProviderModule({
  providers: [ServiceMock, DepServiceMock],
});
