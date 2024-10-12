import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import process from 'process';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    switch (process.env.MODE) {
      case 'PRODUCTION':
        return {
          type: 'postgres',
          url: this.configService.get<string>('DB_URL_PROD'),
          autoLoadEntities: true,
          synchronize: false,
          logging: false,
        };
      case 'DEVELOPMENT':
        return {
          type: 'postgres',
          host: this.configService.get<string>('DB_HOST'),
          port: this.configService.get<number>('DB_PORT'),
          username: this.configService.get<string>('DB_USERNAME'),
          password: this.configService.get<string>('DB_PASSWORD'),
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: false,
          logging: false,
        };
      case 'TESTING':
        return {
          type: 'postgres',
          host: this.configService.get<string>('DB_HOST'),
          port: this.configService.get<number>('DB_PORT'),
          username: this.configService.get<string>('DB_USERNAME'),
          password: this.configService.get<string>('DB_PASSWORD'),
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: false,
          logging: false,
        };
      default:
        return {
          type: 'postgres',
          host: this.configService.get<string>('DB_HOST'),
          port: this.configService.get<number>('DB_PORT'),
          username: this.configService.get<string>('DB_USERNAME'),
          password: this.configService.get<string>('DB_PASSWORD'),
          database: this.configService.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: false,
          logging: false,
        };
    }
  }
}
