import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from 'src/infrastructure/exception-filters/exception-factory';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';
import { decode } from 'jsonwebtoken';

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
  await app.listen(3000);
}

bootstrap();
