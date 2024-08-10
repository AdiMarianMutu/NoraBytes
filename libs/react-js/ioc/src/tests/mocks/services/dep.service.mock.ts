import { Injectable } from '../../../decorators';

@Injectable()
export class DepServiceMock {
  counter = 0;

  incrementCounter(): void {
    this.counter += 1;
  }
}
