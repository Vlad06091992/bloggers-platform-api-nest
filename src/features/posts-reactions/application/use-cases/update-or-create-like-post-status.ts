import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LikeStatuses } from 'src/features/comments-reactions/api/models/like-status-dto';

import { PostsReactionsRepository } from 'src/features/posts-reactions/infrastructure/posts-reactions-repository';
import { PostsReactionsQueryRepository } from 'src/features/posts-reactions/infrastructure/posts-reactions-query-repository';
import { generateUuidV4 } from 'src/utils';
import { PostsReactions } from 'src/features/posts-reactions/entity/post-reactions';
import { Users } from 'src/features/users/entities/users';
import { Posts } from 'src/features/posts/entity/posts';

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
    protected postsLikesRepository: PostsReactionsRepository,
    protected postsLikesQueryRepository: PostsReactionsQueryRepository,
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
      await this.postsLikesRepository.updateLikeStatus(
        postId,
        userId,
        likeStatus,
      );
      return true;
    }
    if (!statusRecord && likeStatus !== 'None') {
      // if(likeStatus === 'Like'){
      //
      // }

      const newLikeRecord = new PostsReactions(
        generateUuidV4(),
        likeStatus,
        new Date(),
        { id: userId } as Users,
        { id: postId } as Posts,
      );
      await this.postsLikesRepository.createLikeStatus(newLikeRecord);
    }
  }
}
