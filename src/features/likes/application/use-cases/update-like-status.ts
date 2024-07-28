import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikesRepository } from 'src/features/likes/infrastructure/likes-repository';
import { LikeStatuses } from 'src/features/likes/api/models/like-status-dto';
import { LikesQueryRepository } from 'src/features/likes/infrastructure/likes-query-repository';
import { ObjectId } from 'mongodb';
import { Likes } from 'src/features/likes/domain/likes-schema';

export class UpdateLikeStatusCommand {
  constructor(
    public likeStatus: LikeStatuses,
    public entityId: string,
    public userId: string,
    public userLogin: string,
    public likedEntity: 'post' | 'comment',
  ) {}
}

@CommandHandler(UpdateLikeStatusCommand)
export class UpdateLikeStatusHandler
  implements ICommandHandler<UpdateLikeStatusCommand>
{
  constructor(
    protected likesRepository: LikesRepository,
    protected likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute({
    userId,
    userLogin,
    likeStatus,
    entityId,
    likedEntity,
  }: UpdateLikeStatusCommand) {
    // console.log();
    debugger;
    const statusRecord = await this.likesQueryRepository.getLikeRecord(
      userId,
      entityId,
    );
    debugger;

    if (likeStatus === 'None' && !statusRecord) return true;
    if (likeStatus === 'None' && statusRecord) {
      await this.likesRepository.deleteRecord(statusRecord.id);
      return true;
    }
    if (likeStatus === statusRecord?.likeStatus) return true;
    if (
      statusRecord &&
      statusRecord.likeStatus !== likeStatus &&
      likeStatus !== 'None'
    ) {
      statusRecord.likeStatus = likeStatus;
      await statusRecord.save();
      return true;
    }
    if (!statusRecord && likeStatus !== 'None') {
      const _id = new ObjectId();
      const newLikeRecord: Likes = {
        _id,
        id: _id.toString(),
        addedAt: new Date().toISOString(),
        login: userLogin,
        userId,
        likeStatus,
        entityId,
        likedEntity,
      };
      await this.likesRepository.createLikeStatus(newLikeRecord);
    }
  }
}
