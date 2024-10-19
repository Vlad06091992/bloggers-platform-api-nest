import { Injectable } from '@nestjs/common';
import * as process from 'process';

@Injectable()
export class AppService {
  getHello() {
    return 'Hello World!';
  }
}
