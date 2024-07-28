import { Module } from '@nestjs/common';
import { TestingController } from 'src/features/testing/testing.controller';
import { TestingService } from 'src/features/testing/testing.service';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { UsersRepository } from 'src/features/users/infrastructure/users-repository';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/features/users/domain/user-schema';
import {
  Comment,
  CommentsSchema,
} from 'src/features/comments/domain/comments-schema';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { Post, PostsSchema } from 'src/features/posts/domain/posts-schema';
import { Blog, BlogsSchema } from 'src/features/blogs/domain/blogs-schema';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { Likes, LikesSchema } from 'src/features/likes/domain/likes-schema';
import { LikesRepository } from 'src/features/likes/infrastructure/likes-repository';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogsSchema }]),
    MongooseModule.forFeature([{ name: Likes.name, schema: LikesSchema }]),
  ],
  controllers: [TestingController],
  providers: [
    TestingService,
    UsersRepository,
    CommentsRepository,
    PostsRepository,
    BlogsRepository,
    LikesRepository,
  ],
})
export class TestModule {}
