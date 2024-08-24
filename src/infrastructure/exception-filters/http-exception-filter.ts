import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      // Если это HttpException, то используем статус код из исключения
      const status = exception.getStatus();
      const message = exception.getResponse();
      const timestamp = new Date().toISOString();
      const query = `
        INSERT INTO public."ErrorsLogs"("statusCode", "timestamp", path, query, params, message,method,body)
        VALUES ($1, $2, $3, $4, $5,$6,$7,$8);
      `;
      const values = [
        status,
        timestamp,
        request.url,
        JSON.stringify(request.query),
        JSON.stringify(request.params),
        message,
        JSON.stringify(request.method),
        JSON.stringify(request.body),
      ];

      await this.dataSource.query(query, values);
      if (!response.headersSent) {
        response.status(status).send({
          statusCode: status,
          message,
        });
      }
      return;
    } else {
      // Получаем текущую дату и время
      const timestamp = new Date().toISOString();
      const statusCode = 500;
      //@ts-ignore
      const message = exception.toString();
      const query = `
        INSERT INTO public."ErrorsLogs"("statusCode", "timestamp", path, query, params,message,method,body)
        VALUES ($1, $2, $3, $4, $5, $6,$7,$8);
      `;
      const values = [
        statusCode,
        timestamp,
        request.url,
        JSON.stringify(request.query),
        JSON.stringify(request.params),
        message,
        JSON.stringify(request.method),
        JSON.stringify(request.body),
      ];

      await this.dataSource.query(query, values);

      // Возврат ответа клиенту
      if (!response.headersSent) {
        response.status(statusCode).send({
          statusCode,
          message: 'Internal server error',
          timestamp,
          path: request.url,
          query: request.query,
          params: request.params,
          body: request.body,
        });
        return;
      }
    }
  }
}
