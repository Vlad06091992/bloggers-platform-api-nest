import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { CommentsLikesQueryRepository } from 'src/features/comments-likes/infrastructure/comments-likes-query-repository';

export class GetLikeInfoCommand {
  constructor(
    public entityId: string,
    public userId: string | null,
  ) {}
}

@CommandHandler(GetLikeInfoCommand)
export class GetLikeInfoHandler {
  constructor(
    @Inject()
    protected likesQueryRepository: CommentsLikesQueryRepository,
  ) {}

  async execute({ entityId, userId }: GetLikeInfoCommand) {
    const likeRecord = await this.likesQueryRepository.getLikeRecord(
      userId,
      entityId,
    );

    const likesInfo = {
      likesCount: await this.likesQueryRepository.getLikesCount(entityId),
      dislikesCount: await this.likesQueryRepository.getDislikesCount(entityId),
      myStatus: likeRecord ? likeRecord.likeStatus : 'None',
    };

    return likesInfo;
  }
}
