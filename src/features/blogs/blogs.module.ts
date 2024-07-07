import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { Post, PostsSchema } from 'src/features/posts/domain/posts-schema';
import { PostsController } from 'src/features/posts/api/posts.controller';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import {
  Comment,
  CommentsSchema,
} from 'src/features/comments/domain/comments-schema';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { BlogsService } from 'src/features/blogs/application/blogs.service';
import { BlogsSchema, Blog } from 'src/features/blogs/domain/blogs-schema';
import { PostsService } from 'src/features/posts/application/posts.service';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { BlogsController } from 'src/features/blogs/api/blogs.controller';

@Module({
  imports: [
    MongoModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogsSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
  ],
  controllers: [BlogsController],
  providers: [
    BlogsService,
    PostsService,
    BlogsRepository,
    PostsRepository,
    PostsQueryRepository,
    BlogsQueryRepository,
    CommentsQueryRepository,
  ],
})
export class BlogsModule {}
