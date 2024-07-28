import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from 'src/mongo-module/mongo.module';
import { Post, PostsSchema } from 'src/features/posts/domain/posts-schema';
import { PostsQueryRepository } from 'src/features/posts/infrastructure/posts.query-repository';
import { PostsController } from 'src/features/posts/api/posts.controller';
import { PostsRepository } from 'src/features/posts/infrastructure/posts-repository';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import {
  Comment,
  CommentsSchema,
} from 'src/features/comments/domain/comments-schema';
import { PostsService } from 'src/features/posts/application/posts.service';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommentForPostHandler } from 'src/features/comments/application/use-cases/create-comment-for-post';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { GetLikeInfoHandler } from 'src/features/likes/application/use-cases/get-like-info';
import { Likes, LikesSchema } from 'src/features/likes/domain/likes-schema';
import { LikesQueryRepository } from 'src/features/likes/infrastructure/likes-query-repository';
import { LikesRepository } from 'src/features/likes/infrastructure/likes-repository';
import { GetNewestLikesHandler } from 'src/features/likes/application/use-cases/get-newest-likes';

@Module({
  imports: [
    CqrsModule,
    MongoModule,
    MongooseModule.forFeature([{ name: Post.name, schema: PostsSchema }]),
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
    MongooseModule.forFeature([{ name: Likes.name, schema: LikesSchema }]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    PostsRepository,
    LikesRepository,
    LikesQueryRepository,
    CommentsRepository,
    PostsQueryRepository,
    CommentsQueryRepository,
    CreateCommentForPostHandler,
    GetLikeInfoHandler,
    GetNewestLikesHandler,
  ],
})
export class PostsModule {}
