import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from 'src/features/comments/comments.module';
import { TestModule } from 'src/features/testing/testing.module';
import { PostsModule } from "src/features/posts/posts.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule,
    UsersModule,
    CommentsModule,
    TestModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
