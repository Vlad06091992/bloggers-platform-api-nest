import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CommentsRepository } from 'src/features/comments/infrastructure/comments-repository';
import { Comments } from 'src/features/comments/entity/comments';
import { CreateCommentDto } from 'src/features/comments/api/models/comment-dto';
import { generateUuidV4 } from 'src/utils';
import { UsersQueryRepository } from 'src/features/users/infrastructure/users.query-repository';
import { Users } from 'src/features/users/entities/users';

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
    const comment = new Comments(
      generateUuidV4(),
      createCommentDTO.content,
      createCommentDTO.post,
      { id: createCommentDTO.userId } as Users,
      new Date(),
    );

    const newCommentData = await this.commentsRepository.createComment(comment);

    return {
      id: newCommentData.id,
      content: newCommentData.content,
      commentatorInfo: {
        userId: createCommentDTO.userId,
        userLogin: createCommentDTO.userLogin,
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
