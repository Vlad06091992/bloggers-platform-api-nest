import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { CommentsLikesQueryRepository } from 'src/features/comments-likes/infrastructure/comments-likes-query-repository';

export class GetNewestLikesCommand {
  constructor(public entityId: string) {}
}

@CommandHandler(GetNewestLikesCommand)
export class GetNewestLikesHandler {
  constructor(
    @Inject()
    protected likesQueryRepository: CommentsLikesQueryRepository,
  ) {}

  async execute({ entityId }: GetNewestLikesCommand) {
    return await this.likesQueryRepository.getNewestLikes(entityId);
  }
}
