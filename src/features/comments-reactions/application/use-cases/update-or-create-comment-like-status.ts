import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatuses } from 'src/features/comments-reactions/api/models/like-status-dto';
import { CommentsReactionsQueryRepository } from 'src/features/comments-reactions/infrastructure/comments-reactions-query-repository';

import { CommentsLikesRepository } from 'src/features/comments-reactions/infrastructure/comments-likes-repository';
import { generateUuidV4 } from 'src/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Comments } from 'src/features/comments/entity/comments';
import { Repository } from 'typeorm';
import { CommentsReactions } from 'src/features/comments-reactions/entity/comment-reactions';
import { Users } from 'src/features/users/entities/users';

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
    protected commentsLikesQueryRepository: CommentsReactionsQueryRepository,
    @InjectRepository(CommentsReactions)
    protected repo: Repository<CommentsReactions>,
  ) {}

  async execute({
    userId,
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
      debugger;
      await this.commentsLikesRepository.updateLikeStatus(
        statusRecord.id,
        likeStatus,
      );
      return true;
    }
    if (!statusRecord && likeStatus !== 'None') {
      debugger;
      const newReactionRecord = new CommentsReactions(
        generateUuidV4(),
        likeStatus,
        new Date(),
        { id: userId } as Users,
        { id: commentId } as Comments,
      );

      await this.commentsLikesRepository.createLikeStatus(newReactionRecord);
    }
  }
}
