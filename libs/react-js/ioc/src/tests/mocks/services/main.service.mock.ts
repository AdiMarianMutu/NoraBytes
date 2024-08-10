import { Injectable } from '../../../decorators';
import { DepServiceMock } from './dep.service.mock';

@Injectable()
export class ServiceMock {
  nickname = '';

  constructor(public readonly depService: DepServiceMock) {}

  changeNickname(nickname: string): void {
    this.nickname = nickname;
  }
}
