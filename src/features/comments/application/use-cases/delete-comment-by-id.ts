import { Inject } from '@nestjs/common';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';

export class DeleteCommentByIdCommand {
  constructor(public commentId: string) {}
}

@CommandHandler(DeleteCommentByIdCommand)
export class DeleteCommentByIdHandler
  implements ICommandHandler<DeleteCommentByIdCommand>
{
  constructor(@Inject() protected commentsRepository: CommentsRepository) {}

  async execute({ commentId }: DeleteCommentByIdCommand) {
    return await this.commentsRepository.removeCommentById(commentId);
  }
}
