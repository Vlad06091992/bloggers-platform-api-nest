import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export class RecoveryPasswordQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource) {}

  async findUserByRecoveryCode(recoveryCode: string) {
    const query = `SELECT id, "userId", email, "recoveryCode", "expirationDate"
   FROM public."RecoveryPasswordCodes"
   WHERE "recoveryCode" = $1`;
    const result = await this.dataSource.query(query, [recoveryCode]);
    return result.length ? result[0] : null;
  }
}
