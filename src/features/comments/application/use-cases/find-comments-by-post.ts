import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QueryParams } from 'src/shared/common-types';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';

export class FindCommentsByPostCommand {
  constructor(
    public params: QueryParams,
    public postId: string,
    public userId: string,
  ) {}
}

@CommandHandler(FindCommentsByPostCommand)
export class FindCommentsByPostHandler
  implements ICommandHandler<FindCommentsByPostCommand>
{
  constructor(
    @Inject() protected commentsQueryRepository: CommentsQueryRepository,
  ) {}

  async execute({ params, postId }: FindCommentsByPostCommand) {
    return await this.commentsQueryRepository.getCommentsForPost(
      postId,
      params,
    );
  }
}
