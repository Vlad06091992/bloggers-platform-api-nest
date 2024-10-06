import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecoveryPasswordCodes } from 'src/features/auth/entities/recovery-password-codes';

export class RecoveryPasswordQueryRepository {
  constructor(
    @InjectRepository(RecoveryPasswordCodes)
    private readonly repo: Repository<RecoveryPasswordCodes>,
  ) {}

  async findUserByRecoveryCode(recoveryCode: string) {
    debugger;
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
    console.log(res);
    debugger;
    return res || null;

    //  const query = `SELECT id, "userId", email, "recoveryCode", "expirationDate"
    // FROM public."RecoveryPasswordCodes"
    // WHERE "recoveryCode" = $1`;
    //  const result = await this.dataSource.query(query, [recoveryCode]);
    //  return result.length ? result[0] : null;
  }
}
