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
import { UpdateOrCreateLikeCommentStatusHandler } from 'src/features/comments-likes/application/use-cases/update-or-create-comment-like-status';
import { CommentsLikesQueryRepository } from 'src/features/comments-likes/infrastructure/comments-likes-query-repository';
import { GetLikeInfoHandler } from 'src/features/comments-likes/application/use-cases/get-like-info';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { CommentsLikesRepository } from 'src/features/comments-likes/infrastructure/comments-likes-repository';

@Module({
  imports: [
    CqrsModule,
    MongoModule,
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentsSchema }]),
    // MongooseModule.forFeature([
    //   { name: CommentLikes.name, schema: LikesSchema },
    // ]),
  ],
  controllers: [CommentsController],
  providers: [
    FindCommentByIdHandler,
    UsersQueryRepository,
    CommentsRepository,
    CommentsLikesQueryRepository,
    CommentsLikesRepository,
    CommentsQueryRepository,
    DeleteCommentByIdHandler,
    UpdateCommentByIdHandler,
    UpdateOrCreateLikeCommentStatusHandler,
    GetLikeInfoHandler,
  ],
})
export class CommentsModule {}
