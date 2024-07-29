import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { Post, PostsSchema } from 'src/features/posts/domain/posts-schema';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import {
  Comment,
  CommentsSchema,
} from 'src/features/comments/domain/comments-schema';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { Blog, BlogsSchema } from 'src/features/blogs/domain/blogs-schema';
import { PostsService } from 'src/features/posts/application/posts.service';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { BlogsController } from 'src/features/blogs/api/blogs.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogHandler } from 'src/features/blogs/application/use-cases/create-blog';
import { DeleteBlogHandler } from 'src/features/blogs/application/use-cases/delete-blog';
import { FindBlogHandler } from 'src/features/blogs/application/use-cases/find-blog';
import { FindBlogsHandler } from 'src/features/blogs/application/use-cases/find-blogs';
import { UpdateBlogHandler } from 'src/features/blogs/application/use-cases/update-blog';
import { FindBlogsForSpecificBlogHandler } from 'src/features/blogs/application/use-cases/find-posts-for-specific-blog';
import { CreatePostForSpecificBlogHandler } from 'src/features/blogs/application/use-cases/create-post-for-specific-blog';
import { UniqueValidator } from 'src/shared/validators/is-exist-blog';

@Module({
  imports: [
    CqrsModule,
    MongoModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogsSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
  ],
  controllers: [BlogsController],
  providers: [
    PostsService,
    BlogsRepository,
    PostsRepository,
    PostsQueryRepository,
    BlogsQueryRepository,
    CommentsQueryRepository,
    CreateBlogHandler,
    CreatePostForSpecificBlogHandler,
    UpdateBlogHandler,
    FindBlogsForSpecificBlogHandler,
    DeleteBlogHandler,
    UniqueValidator,
    FindBlogHandler,
    FindBlogsHandler,
  ],
})
export class BlogsModule {}
