import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { LikesQueryRepository } from 'src/features/likes/infrastructure/likes-query-repository';

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
    protected likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute({ entityId, userId }: GetLikeInfoCommand) {
    const likeRecord = await this.likesQueryRepository.getLikeRecord(
      userId,
      entityId,
    );

    debugger;

    const likesInfo = {
      likesCount: await this.likesQueryRepository.getLikesCount(entityId),
      dislikesCount: await this.likesQueryRepository.getDislikesCount(entityId),
      myStatus: likeRecord ? likeRecord.likeStatus : 'None',
    };

    return likesInfo;
  }
}
