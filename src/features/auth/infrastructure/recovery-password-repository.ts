import { Injectable } from '@nestjs/common';
import { RecoveryPasswordsCode } from 'src/features/auth/domain/recovery-password-schema';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class RecoveryPasswordRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async createRecord(record: RecoveryPasswordsCode) {
    const { userId, recoveryCode, id, expirationDate, email } = record;
    const query = `INSERT INTO public."RecoveryPasswordCodes"(
          "id", "userId", "email", "expirationDate", "recoveryCode")
          VALUES ($1, $2, $3, $4, $5);`;

    await this.dataSource.query(query, [
      id,
      userId,
      email,
      expirationDate,
      recoveryCode,
    ]);
  }

  async clearData() {
    const query = `TRUNCATE TABLE public."RecoveryPasswordCodes"`;
    return this.dataSource.query(query, []);
  }
}
