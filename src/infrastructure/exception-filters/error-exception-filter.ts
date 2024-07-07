import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import * as process from 'process';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<Response>();

    if (process.env.envoriment !== 'production') {
      response
        .status(500)
        .json({ error: exception.toString(), stack: exception.stack });
      return;
    } else {
      response.status(500).send('some error occured');
      return;
    }
  }
}
