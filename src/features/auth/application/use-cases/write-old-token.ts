import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OldTokensIdsRepository } from 'src/features/auth/infrastructure/old-tokens-ids-repository';

export class WriteOldTokenCommand {
  constructor(public tokenId: string) {}
}

@CommandHandler(WriteOldTokenCommand)
export class WriteOldTokenHandler
  implements ICommandHandler<WriteOldTokenCommand>
{
  constructor(protected oldTokensIdsRepository: OldTokensIdsRepository) {}

  async execute({ tokenId }: WriteOldTokenCommand) {
    console.log(tokenId);

    await this.oldTokensIdsRepository.createRecord(tokenId);
    return true;
  }
}
