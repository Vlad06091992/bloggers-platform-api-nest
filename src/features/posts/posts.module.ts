import { Module } from '@nestjs/common';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { PostsController } from 'src/features/posts/api/posts.controller';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { PostsService } from 'src/features/posts/application/posts.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommentForPostHandler } from 'src/features/comments/application/use-cases/create-comment-for-post';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { GetLikeInfoHandler } from 'src/features/comments-likes/application/use-cases/get-like-info';
import { CommentsLikesQueryRepository } from 'src/features/comments-likes/infrastructure/comments-likes-query-repository';
import { GetNewestLikesHandler } from 'src/features/comments-likes/application/use-cases/get-newest-likes';
import { BlogsQueryRepository } from 'src/features/blogs/infrastructure/blogs.query-repository';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { PostsLikesRepository } from 'src/features/posts-likes/infrastructure/posts-likes-repository';
import { PostsLikesQueryRepository } from 'src/features/posts-likes/infrastructure/posts-likes-query-repository';
import { UpdateOrCreateLikePostStatusHandler } from 'src/features/posts-likes/application/use-cases/update-or-create-like-post-status';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/features/users/entities/user';
import { UserRegistrationData } from 'src/features/users/entities/user-registration-data';
import { Blogs } from 'src/features/blogs/entity/blogs';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([User, UserRegistrationData, Blogs]),
  ],
  controllers: [PostsController],
  providers: [
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsLikesRepository,
    PostsLikesQueryRepository,
    CommentsLikesQueryRepository,
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
