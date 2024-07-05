// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { ConfigModule } from '@nestjs/config';
//
// @Module({
//   imports: [
//     ConfigModule.forRoot(),
//     MongooseModule.forRoot('mongodb://localhost:27017/nest_development'),
//   ],
//   providers: [],
//   controllers: [],
// })
// export class MongoModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: `${configService.get('MONGO_URI')}/${configService.get('DB_NAME')}`,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
  controllers: [],
})
export class MongoModule {}
