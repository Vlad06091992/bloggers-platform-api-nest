import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from 'src/infrastructure/exception-filters/exception-factory';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { GlobalExceptionFilter } from 'src/infrastructure/exception-filters/http-exception-filter';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory,
      stopAtFirstError: true,
    }),
  );
  // const dataSource = app.get(DataSource);
  // app.useGlobalFilters(new GlobalExceptionFilter(dataSource));
  await app.listen(3000);
}

bootstrap();
