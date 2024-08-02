import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { LikesQueryRepository } from 'src/features/likes/infrastructure/likes-query-repository';

export class GetNewestLikesCommand {
  constructor(public entityId: string) {}
}

@CommandHandler(GetNewestLikesCommand)
export class GetNewestLikesHandler {
  constructor(
    @Inject()
    protected likesQueryRepository: LikesQueryRepository,
  ) {}

  async execute({ entityId }: GetNewestLikesCommand) {
    return await this.likesQueryRepository.getNewestLikes(entityId);
  }
}
