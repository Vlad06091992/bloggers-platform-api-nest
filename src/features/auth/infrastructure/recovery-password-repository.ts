import { Injectable } from '@nestjs/common';

import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RecoveryPasswordCodesEntity } from 'src/features/auth/entities/recovery-password-codes.entity';

@Injectable()
export class RecoveryPasswordRepository {
  constructor(
    @InjectDataSource()
    protected dataSource: DataSource,
  ) {}

  async createRecord(record: RecoveryPasswordCodesEntity) {
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
