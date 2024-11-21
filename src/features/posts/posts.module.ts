import { Module } from '@nestjs/common';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { PostsController } from 'src/features/posts/api/posts.controller';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { PostsService } from 'src/features/posts/application/posts.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommentForPostHandler } from 'src/features/comments/application/use-cases/create-comment-for-post';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { GetLikeInfoHandler } from 'src/features/comments-reactions/application/use-cases/get-like-info';
import { CommentsReactionsQueryRepository } from 'src/features/comments-reactions/infrastructure/comments-reactions-query-repository';
import { GetNewestLikesHandler } from 'src/features/comments-reactions/application/use-cases/get-newest-likes';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { PostsReactionsRepository } from 'src/features/posts-reactions/infrastructure/posts-reactions-repository';
import { PostsReactionsQueryRepository } from 'src/features/posts-reactions/infrastructure/posts-reactions-query-repository';
import { UpdateOrCreateLikePostStatusHandler } from 'src/features/posts-reactions/application/use-cases/update-or-create-like-post-status';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/features/users/entities/users.entity';
import { UsersRegistrationDataEntity } from 'src/features/users/entities/users-registration-data.entity';
import { BlogsEntity } from 'src/features/blogs/entity/blogs.entity';
import { PostsEntity } from 'src/features/posts/entity/posts.entity';
import { PostsReactions } from 'src/features/posts-reactions/entity/post-reactions.entity';
import { CommentsEntity } from 'src/features/comments/entity/comments.entity';
import { CommentsReactions } from 'src/features/comments-reactions/entity/comment-reactions.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      UsersEntity,
      UsersRegistrationDataEntity,
      BlogsEntity,
      PostsEntity,
      PostsReactions,
      CommentsEntity,
      CommentsReactions,
    ]),
  ],
  controllers: [PostsController],
  providers: [
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsReactionsRepository,
    PostsReactionsQueryRepository,
    CommentsReactionsQueryRepository,
    CommentsRepository,
    PostsQueryRepository,
    UsersQueryRepository,
    CommentsQueryRepository,
    CreateCommentForPostHandler,
    UpdateOrCreateLikePostStatusHandler,
    GetLikeInfoHandler,
    GetNewestLikesHandler,
  ],
})
export class PostsModule {}
