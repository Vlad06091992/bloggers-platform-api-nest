import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatuses } from 'src/features/comments-likes/api/models/like-status-dto';
import { CommentsLikesQueryRepository } from 'src/features/comments-likes/infrastructure/comments-likes-query-repository';

import { CommentsLikesRepository } from 'src/features/comments-likes/infrastructure/comments-likes-repository';
import { generateUuidV4 } from 'src/utils';
import { CommentLikes } from 'src/features/comments-likes/domain/comment-likes-schema';

export class UpdateOrCreateLikeCommentStatusCommand {
  constructor(
    public likeStatus: LikeStatuses,
    public commentId: string,
    public userId: string,
    public userLogin: string,
    public likedEntity: 'post' | 'comment',
  ) {}
}

@CommandHandler(UpdateOrCreateLikeCommentStatusCommand)
export class UpdateOrCreateLikeCommentStatusHandler
  implements ICommandHandler<UpdateOrCreateLikeCommentStatusCommand>
{
  constructor(
    protected commentsLikesRepository: CommentsLikesRepository,
    protected commentsLikesQueryRepository: CommentsLikesQueryRepository,
  ) {}

  async execute({
    userId,
    userLogin,
    likeStatus,
    commentId,
  }: UpdateOrCreateLikeCommentStatusCommand) {
    const statusRecord = await this.commentsLikesQueryRepository.getLikeRecord(
      userId,
      commentId,
    );

    if (likeStatus === 'None' && !statusRecord) return true;
    if (likeStatus === 'None' && statusRecord) {
      await this.commentsLikesRepository.deleteRecord(statusRecord.id);
      return true;
    }
    if (likeStatus === statusRecord?.likeStatus) return true;
    if (
      statusRecord &&
      statusRecord.likeStatus !== likeStatus &&
      likeStatus !== 'None'
    ) {
      await this.commentsLikesRepository.updateLikeStatus(
        commentId,
        likeStatus,
      );
      return true;
    }
    if (!statusRecord && likeStatus !== 'None') {
      const newLikeRecord: CommentLikes = {
        id: generateUuidV4(),
        addedAt: new Date().toISOString(),
        login: userLogin,
        userId,
        likeStatus,
        commentId,
      };
      await this.commentsLikesRepository.createLikeStatus(newLikeRecord);
    }
  }
}
