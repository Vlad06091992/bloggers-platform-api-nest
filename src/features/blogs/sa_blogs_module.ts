import { Module } from '@nestjs/common';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { BlogsRepository } from 'src/features/blogs/infrastructure/blogs-repository';
import { PostsService } from 'src/features/posts/application/posts.service';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { SaBlogsController } from 'src/features/blogs/api/saBlogsController';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateBlogHandler } from 'src/features/blogs/application/use-cases/create-blog';
import { DeleteBlogHandler } from 'src/features/blogs/application/use-cases/delete-blog';
import { FindBlogHandler } from 'src/features/blogs/application/use-cases/find-blog';
import { FindBlogsHandler } from 'src/features/blogs/application/use-cases/find-blogs';
import { UpdateBlogHandler } from 'src/features/blogs/application/use-cases/update-blog';
import { FindBlogsForSpecificBlogHandler } from 'src/features/blogs/application/use-cases/find-posts-for-specific-blog';
import { CreatePostForSpecificBlogHandler } from 'src/features/blogs/application/use-cases/create-post-for-specific-blog';
import { UniqueValidator } from 'src/shared/validators/is-exist-blog';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { PostsReactionsQueryRepository } from 'src/features/posts-reactions/infrastructure/posts-reactions-query-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/features/users/entities/users.entity';
import { UsersRegistrationDataEntity } from 'src/features/users/entities/users-registration-data.entity';
import { BlogsEntity } from 'src/features/blogs/entity/blogs.entity';
import { AuthDevices } from 'src/features/auth/entities/devices.entity';
import { PostsEntity } from 'src/features/posts/entity/posts.entity';
import { PostsReactions } from 'src/features/posts-reactions/entity/post-reactions.entity';
import { PostsReactionsRepository } from 'src/features/posts-reactions/infrastructure/posts-reactions-repository';
import { CommentsEntity } from 'src/features/comments/entity/comments.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      UsersEntity,
      UsersRegistrationDataEntity,
      BlogsEntity,
      PostsEntity,
      PostsReactions,
      AuthDevices,
      CommentsEntity,
    ]),
  ],
  controllers: [SaBlogsController],
  providers: [
    PostsReactionsQueryRepository,
    BlogsQueryRepository,
    UsersQueryRepository,
    BlogsRepository,
    PostsRepository,
    PostsQueryRepository,
    PostsReactionsRepository,
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
