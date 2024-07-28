import { Inject } from '@nestjs/common';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { LikesQueryRepository } from 'src/features/likes/infrastructure/likes-query-repository';
import { GetLikeInfoCommand } from 'src/features/likes/application/use-cases/get-like-info';

export class FindCommentByIdCommand {
  constructor(
    public commentId: string,
    public userId: string | null,
  ) {}
}

@CommandHandler(FindCommentByIdCommand)
export class FindCommentByIdHandler {
  constructor(
    @Inject()
    protected commentsQueryRepository: CommentsQueryRepository,
    protected likesQueryRepository: LikesQueryRepository,
    public commandBus: CommandBus,
  ) {}

  async execute({ commentId, userId }: FindCommentByIdCommand) {
    const result = await this.commentsQueryRepository.getCommentById(
      commentId,
      true,
    );

    const likesInfo = await this.commandBus.execute(
      new GetLikeInfoCommand(commentId, userId),
    );

    return { ...result, likesInfo };
  }
}
