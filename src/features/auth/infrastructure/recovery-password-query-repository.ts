import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecoveryPasswordCodes } from 'src/features/auth/entities/recovery-password-codes';

export class RecoveryPasswordQueryRepository {
  constructor(
    @InjectRepository(RecoveryPasswordCodes)
    private readonly repo: Repository<RecoveryPasswordCodes>,
  ) {}

  async findUserByRecoveryCode(recoveryCode: string) {
    const res = await this.repo
      .createQueryBuilder()
      .select([
        'rpc.id',
        'rpc.userId',
        'rpc.email',
        'rpc.recoveryCode',
        'rpc.expirationDate',
      ])
      .from(RecoveryPasswordCodes, 'rpc')
      .where('rpc.recoveryCode = :recoveryCode', { recoveryCode: recoveryCode })
      .getOne();
    return res || null;
  }
}
