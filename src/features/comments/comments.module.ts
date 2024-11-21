import { Module } from '@nestjs/common';

import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { CqrsModule } from '@nestjs/cqrs';
import { FindCommentByIdHandler } from 'src/features/comments/application/use-cases/find-comment-by-id';
import { CommentsController } from 'src/features/comments/api/comments-controller';
import { DeleteCommentByIdHandler } from 'src/features/comments/application/use-cases/delete-comment-by-id';
import { UpdateCommentByIdHandler } from 'src/features/comments/application/use-cases/update-comment-by-id';
import { UpdateOrCreateLikeCommentStatusHandler } from 'src/features/comments-reactions/application/use-cases/update-or-create-comment-like-status';
import { CommentsReactionsQueryRepository } from 'src/features/comments-reactions/infrastructure/comments-reactions-query-repository';
import { GetLikeInfoHandler } from 'src/features/comments-reactions/application/use-cases/get-like-info';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { CommentsLikesRepository } from 'src/features/comments-reactions/infrastructure/comments-likes-repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/features/users/entities/users.entity';
import { UsersRegistrationDataEntity } from 'src/features/users/entities/users-registration-data.entity';
import { CommentsEntity } from 'src/features/comments/entity/comments.entity';
import { CommentsReactions } from 'src/features/comments-reactions/entity/comment-reactions.entity';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([
      UsersEntity,
      UsersRegistrationDataEntity,
      CommentsEntity,
      CommentsReactions,
    ]),
  ],
  controllers: [CommentsController],
  providers: [
    FindCommentByIdHandler,
    UsersQueryRepository,
    CommentsRepository,
    CommentsReactionsQueryRepository,
    CommentsLikesRepository,
    CommentsQueryRepository,
    DeleteCommentByIdHandler,
    UpdateCommentByIdHandler,
    UpdateOrCreateLikeCommentStatusHandler,
    GetLikeInfoHandler,
  ],
})
export class CommentsModule {}
