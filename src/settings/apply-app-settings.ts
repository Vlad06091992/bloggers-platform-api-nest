import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { createSwaggerConfig } from 'src/swagger.settings';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from 'src/infrastructure/exception-filters/exception-factory';

export const applyAppSettings = (app: INestApplication) => {
  createSwaggerConfig(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory,
      stopAtFirstError: true,
    }),
  );
  // const dataSource = app.get(DataSource); //Костыль который включает/выключает логгер
  // app.useGlobalFilters(new GlobalExceptionFilter(dataSource)); //TODO когда-нибудь доделаю)))
};
