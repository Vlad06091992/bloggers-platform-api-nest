import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { CommentsReactionsQueryRepository } from 'src/features/comments-reactions/infrastructure/comments-reactions-query-repository';

export class GetNewestLikesCommand {
  constructor(public entityId: string) {}
}

@CommandHandler(GetNewestLikesCommand)
export class GetNewestLikesHandler {
  constructor(
    @Inject()
    protected likesQueryRepository: CommentsReactionsQueryRepository,
  ) {}

  async execute({ entityId }: GetNewestLikesCommand) {
    return await this.likesQueryRepository.getNewestLikes(entityId);
  }
}
