import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoModule } from 'src/mongo-module/mongo.module';

import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { Comment, CommentsSchema } from './domain/comments-schema';
import { CqrsModule } from '@nestjs/cqrs';
import { FindCommentByIdHandler } from 'src/features/comments/application/use-cases/find-comment-by-id';
import { CommentsController } from 'src/features/comments/api/comments-controller';
import { DeleteCommentByIdHandler } from 'src/features/comments/application/use-cases/delete-comment-by-id';
import { UpdateCommentByIdHandler } from 'src/features/comments/application/use-cases/update-comment-by-id';
import { UpdateLikeStatusHandler } from 'src/features/likes/application/use-cases/update-like-status';
import { LikesRepository } from 'src/features/likes/infrastructure/likes-repository';
import { LikesQueryRepository } from 'src/features/likes/infrastructure/likes-query-repository';
import { Likes, LikesSchema } from 'src/features/likes/domain/likes-schema';
import { GetLikeInfoHandler } from 'src/features/likes/application/use-cases/get-like-info';

@Module({
  imports: [
    CqrsModule,
    MongoModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
    MongooseModule.forFeature([{ name: Likes.name, schema: LikesSchema }]),
  ],
  controllers: [CommentsController],
  providers: [
    FindCommentByIdHandler,
    CommentsRepository,
    LikesRepository,
    LikesQueryRepository,
    CommentsQueryRepository,
    DeleteCommentByIdHandler,
    UpdateCommentByIdHandler,
    UpdateLikeStatusHandler,
    GetLikeInfoHandler,
  ],
})
export class CommentsModule {}
