import { Inject } from '@nestjs/common';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { CommandBus, CommandHandler } from '@nestjs/cqrs';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';

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
    protected usersQueryRepository: UsersQueryRepository,
    public commandBus: CommandBus,
  ) {}

  async execute({ commentId, userId }: FindCommentByIdCommand) {
    const findedCommentData = await this.commentsQueryRepository.getCommentById(
      commentId,
      userId,
    );

    if (!findedCommentData) return null;
    return findedCommentData;
  }
}
