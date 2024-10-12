import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from 'src/infrastructure/exception-filters/exception-factory';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';

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
  // const dataSource = app.get(DataSource); //Костыль который включает/выключает логгер
  // app.useGlobalFilters(new GlobalExceptionFilter(dataSource)); //TODO когда-нибудь доделаю)))
  await app.listen(3000);
}

bootstrap();
