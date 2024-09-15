import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import {
  Comment,
  CommentsSchema,
} from 'src/features/comments/domain/comments-schema';
import { BlogsRepository } from 'src/features/sa_blogs/infrastructure/blogs-repository';
import { PostsService } from 'src/features/posts/application/posts.service';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { SaBlogsController } from 'src/features/sa_blogs/api/saBlogsController';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogHandler } from 'src/features/sa_blogs/application/use-cases/create-blog';
import { DeleteBlogHandler } from 'src/features/sa_blogs/application/use-cases/delete-blog';
import { FindBlogHandler } from 'src/features/sa_blogs/application/use-cases/find-blog';
import { FindBlogsHandler } from 'src/features/sa_blogs/application/use-cases/find-blogs';
import { UpdateBlogHandler } from 'src/features/sa_blogs/application/use-cases/update-blog';
import { FindBlogsForSpecificBlogHandler } from 'src/features/sa_blogs/application/use-cases/find-posts-for-specific-blog';
import { CreatePostForSpecificBlogHandler } from 'src/features/sa_blogs/application/use-cases/create-post-for-specific-blog';
import { UniqueValidator } from 'src/shared/validators/is-exist-blog';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { PostsLikesQueryRepository } from 'src/features/posts-likes/infrastructure/posts-likes-query-repository';

@Module({
  imports: [
    CqrsModule,
    MongoModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
  ],
  controllers: [SaBlogsController],
  providers: [
    BlogsQueryRepository,
    UsersQueryRepository,
    BlogsRepository,
    PostsRepository,
    PostsQueryRepository,
    PostsLikesQueryRepository,
    CommentsQueryRepository,
    PostsService,
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
export class SaBlogsModule {}
