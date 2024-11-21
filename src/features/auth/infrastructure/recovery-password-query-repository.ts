import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecoveryPasswordCodesEntity } from 'src/features/auth/entities/recovery-password-codes.entity';

export class RecoveryPasswordQueryRepository {
  constructor(
    @InjectRepository(RecoveryPasswordCodesEntity)
    private readonly repo: Repository<RecoveryPasswordCodesEntity>,
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
      .from(RecoveryPasswordCodesEntity, 'rpc')
      .where('rpc.recoveryCode = :recoveryCode', { recoveryCode: recoveryCode })
      .getOne();
    return res || null;
  }
}
