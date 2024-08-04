import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersService } from 'src/features/users/application/users.service';
import { OldTokensIdsQueryRepository } from 'src/features/auth/infrastructure/old-tokens-ids-query-repository';

export class IsOldTokenCommand {
  constructor(public tokenId: string) {}
}

@CommandHandler(IsOldTokenCommand)
export class IsOldTokenHandler implements ICommandHandler<IsOldTokenCommand> {
  constructor(
    protected oldTokensIdsQueryRepository: OldTokensIdsQueryRepository,
  ) {}

  async execute({ tokenId }: IsOldTokenCommand) {
    return this.oldTokensIdsQueryRepository.getOldTokenById(tokenId);
  }
}
