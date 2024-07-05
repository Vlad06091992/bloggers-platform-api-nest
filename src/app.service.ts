import { Injectable } from '@nestjs/common';
import * as process from 'process';

@Injectable()
export class AppService {
  getHello() {
    return {
      hello: 'hello',
      mongo: process.env.MONGO_URI,
    };
  }
}
