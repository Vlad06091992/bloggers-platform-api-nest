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
import { Users } from 'src/features/users/entities/users';
import { UsersRegistrationData } from 'src/features/users/entities/users-registration-data';
import { Blogs } from 'src/features/blogs/entity/blogs';
import { Posts } from 'src/features/posts/entity/posts';
import { PostsReactions } from 'src/features/posts-reactions/entity/post-reactions';
import { Comments } from 'src/features/comments/entity/comments';
import { CommentsReactions } from 'src/features/comments-reactions/entity/comment-reactions';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      Users,
      UsersRegistrationData,
      Blogs,
      Posts,
      PostsReactions,
      Comments,
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
