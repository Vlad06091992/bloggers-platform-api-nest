import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { ObjectId } from 'mongodb';
import { Comment } from '../../domain/comments-schema';
import { CreateCommentDto } from 'src/features/comments/api/models/comment-dto';

export class CreateCommentForPostCommand {
  constructor(public createCommentDTO: CreateCommentDto) {}
}

@CommandHandler(CreateCommentForPostCommand)
export class CreateCommentForPostHandler
  implements ICommandHandler<CreateCommentForPostCommand>
{
  constructor(protected commentsRepository: CommentsRepository) {}

  async execute({
    createCommentDTO,
  }: CreateCommentForPostCommand): Promise<any> {
    const _id = new ObjectId();

    const comment: Comment = {
      _id,
      id: _id.toString(),
      createdAt: new Date().toISOString(),
      ...createCommentDTO,
    };

    const likesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
    };

    return {
      ...(await this.commentsRepository.createComment(comment)),
      likesInfo,
    };
  }
}
