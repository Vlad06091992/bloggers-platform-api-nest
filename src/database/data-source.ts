import * as dotenv from 'dotenv';

import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import process from 'process';

dotenv.config({ path: `.env.${process.env.MODE!.toLowerCase()}` });
const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  logging: true,
  synchronize: false,
  migrations: [configService.get<string>('MIGRATIONS_DIR')!],
  entities: [configService.get<string>('ENTITIES_PATH')!],
});
