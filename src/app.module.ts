import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from 'src/features/comments/comments.module';
import { TestModule } from 'src/features/testing/testing.module';
import { PostsModule } from 'src/features/posts/posts.module';
import { BlogsModule } from 'src/features/blogs/blogs.module';
import { AuthModule } from './features/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from 'src/email/email.module';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { PostsService } from 'src/features/posts/application/posts.service';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { Blog, BlogsSchema } from 'src/features/blogs/domain/blogs-schema';
import { Post, PostsSchema } from 'src/features/posts/domain/posts-schema';
import {
  Comment,
  CommentsSchema,
} from 'src/features/comments/domain/comments-schema';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { Likes, LikesSchema } from 'src/features/likes/domain/likes-schema';

const useCases = [];
const repositories = [
  PostsRepository,
  BlogsRepository,
  BlogsQueryRepository,
  PostsQueryRepository,
  CommentsQueryRepository,
];

const services = [PostsService];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogsSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
    MongooseModule.forFeature([{ name: Likes.name, schema: LikesSchema }]),
    // CqrsModule,
    MailerModule.forRoot({
      transport: {
        service: 'Mail.ru',
        auth: {
          user: 'Smirnov.ru92@mail.ru', // generated ethereal user
          pass: 'xqfWd2w5KfGyjPeuFfLD', // generated ethereal password
        },
      },
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
  providers: [
    AppService,
    ...useCases,
    ...repositories,
    ...services,
    CommandBus,
  ],
})
export class AppModule {}
