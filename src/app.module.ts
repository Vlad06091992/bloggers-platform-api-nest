import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from 'src/features/comments/comments.module';
import { TestModule } from 'src/features/testing/testing.module';
import { PostsModule } from 'src/features/posts/posts.module';
import { BlogsModule } from 'src/features/blogs/blogs.module';
import { AuthModule } from './features/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from 'src/email/email.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: `${configService.get('MAILER_SERVICE')}`,
          auth: {
            user: `${configService.get('MAILER_USER')}`,
            pass: `${configService.get('MAILER_PASS')}`, // generated ethereal password
          },
        },
      }),
    }),
    EmailModule,
    ConfigModule.forRoot(),
    MongooseModule,
    BlogsModule,
    UsersModule,
    CommentsModule,
    TestModule,
    PostsModule,
    AuthModule,
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 5,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
