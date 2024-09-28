import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatuses } from 'src/features/comments-likes/api/models/like-status-dto';

import { PostsLikesRepository } from 'src/features/posts-likes/infrastructure/posts-likes-repository';
import { PostsLikesQueryRepository } from 'src/features/posts-likes/infrastructure/posts-likes-query-repository';
import { generateUuidV4 } from 'src/utils';
import { PostLikes } from 'src/features/posts-likes/domain/post-likes-schema';

export class UpdateOrCreateLikePostStatusCommand {
  constructor(
    public likeStatus: LikeStatuses,
    public postId: string,
    public userId: string,
    public userLogin: string,
  ) {}
}

@CommandHandler(UpdateOrCreateLikePostStatusCommand)
export class UpdateOrCreateLikePostStatusHandler
  implements ICommandHandler<UpdateOrCreateLikePostStatusCommand>
{
  constructor(
    protected postsLikesRepository: PostsLikesRepository,
    protected postsLikesQueryRepository: PostsLikesQueryRepository,
  ) {}

  async execute({
    userId,
    likeStatus,
    postId,
    userLogin,
  }: UpdateOrCreateLikePostStatusCommand) {
    const statusRecord = await this.postsLikesQueryRepository.getLikeRecord(
      userId,
      postId,
    );

    if (likeStatus === 'None' && !statusRecord) return true;
    if (likeStatus === 'None' && statusRecord) {
      await this.postsLikesRepository.deleteRecord(statusRecord.id);
      return true;
    }
    if (likeStatus === statusRecord?.likeStatus) return true;
    if (
      statusRecord &&
      statusRecord.likeStatus !== likeStatus &&
      likeStatus !== 'None'
    ) {
      await this.postsLikesRepository.updateLikeStatus(postId, likeStatus);
      return true;
    }
    if (!statusRecord && likeStatus !== 'None') {
      const newLikeRecord: PostLikes = {
        id: generateUuidV4(),
        addedAt: new Date().toISOString(),
        userId,
        login: userLogin,
        likeStatus,
        postId,
      };
      await this.postsLikesRepository.createLikeStatus(newLikeRecord);
    }
  }
}
