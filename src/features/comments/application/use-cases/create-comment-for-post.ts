import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { Comment } from '../../domain/comments-schema';
import { CreateCommentDto } from 'src/features/comments/api/models/comment-dto';
import { generateUuidV4 } from 'src/utils';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';

export class CreateCommentForPostCommand {
  constructor(public createCommentDTO: CreateCommentDto) {}
}

@CommandHandler(CreateCommentForPostCommand)
export class CreateCommentForPostHandler
  implements ICommandHandler<CreateCommentForPostCommand>
{
  constructor(
    protected commentsRepository: CommentsRepository,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  async execute({ createCommentDTO }: CreateCommentForPostCommand) {
    const comment: Comment = {
      id: generateUuidV4(),
      createdAt: new Date().toISOString(),
      ...createCommentDTO,
    };

    const newCommentData = await this.commentsRepository.createComment(comment);

    return {
      id: newCommentData.id,
      content: newCommentData.content,
      commentatorInfo: {
        userId: newCommentData.userId,
        userLogin: (
          await this.usersQueryRepository.getUserById(newCommentData.userId)
        )?.login,
      },
      createdAt: newCommentData.createdAt,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
  }
}
