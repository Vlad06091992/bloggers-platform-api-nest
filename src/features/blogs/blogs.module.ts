import { Module } from '@nestjs/common';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { PostsService } from 'src/features/posts/application/posts.service';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogHandler } from 'src/features/blogs/application/use-cases/create-blog';
import { DeleteBlogHandler } from 'src/features/blogs/application/use-cases/delete-blog';
import { FindBlogHandler } from 'src/features/blogs/application/use-cases/find-blog';
import { FindBlogsHandler } from 'src/features/blogs/application/use-cases/find-blogs';
import { UpdateBlogHandler } from 'src/features/blogs/application/use-cases/update-blog';
import { FindBlogsForSpecificBlogHandler } from 'src/features/blogs/application/use-cases/find-posts-for-specific-blog';
import { CreatePostForSpecificBlogHandler } from 'src/features/blogs/application/use-cases/create-post-for-specific-blog';
import { UniqueValidator } from 'src/shared/validators/is-exist-blog';
import { BlogsController } from 'src/features/blogs/api/blogs.controller';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { PostsReactionsQueryRepository } from 'src/features/posts-reactions/infrastructure/posts-reactions-query-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/features/users/entities/users';
import { UsersRegistrationData } from 'src/features/users/entities/users-registration-data';
import { Blogs } from 'src/features/blogs/entity/blogs';
import { AuthDevices } from 'src/features/auth/entities/devices';
import { Posts } from 'src/features/posts/entity/posts';
import { PostsReactions } from 'src/features/posts-reactions/entity/post-reactions';
import { PostsReactionsRepository } from 'src/features/posts-reactions/infrastructure/posts-reactions-repository';
import { Comments } from 'src/features/comments/entity/comments';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      Users,
      UsersRegistrationData,
      Blogs,
      AuthDevices,
      Posts,
      PostsReactions,
      Comments,
    ]),
  ],
  controllers: [BlogsController],
  providers: [
    UsersQueryRepository,
    PostsService,
    BlogsRepository,
    PostsRepository,
    PostsReactionsRepository,
    PostsQueryRepository,
    PostsReactionsQueryRepository,
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
