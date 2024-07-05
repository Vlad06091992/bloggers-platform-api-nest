import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [UsersModule, ConfigModule.forRoot(), MongooseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
