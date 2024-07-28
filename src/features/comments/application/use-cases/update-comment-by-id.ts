import { Inject } from '@nestjs/common';
import { CommentsQueryRepository } from 'src/features/comments/infrastructure/comments.query-repository';
import { CommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';

export class UpdateCommentByIdCommand {
  constructor(
    public commentId: string,
    public content: string,
  ) {}
}

@CommandHandler(UpdateCommentByIdCommand)
export class UpdateCommentByIdHandler {
  constructor(@Inject() protected commentsRepository: CommentsRepository) {}

  async execute({ commentId, content }: UpdateCommentByIdCommand) {
    return await this.commentsRepository.updateCommentById(commentId, content);
  }
}
