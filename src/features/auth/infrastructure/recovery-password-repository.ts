import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  RecoveryPasswordsCode,
  RecoveryPasswordsCodeModel,
} from 'src/features/auth/domain/recovery-password-schema';

@Injectable()
export class RecoveryPasswordRepository {
  constructor(
    @InjectModel(RecoveryPasswordsCode.name)
    private recoveryPasswordsCodeModel: RecoveryPasswordsCodeModel,
  ) {}

  async createRecord(record: RecoveryPasswordsCode) {
    return (await this.recoveryPasswordsCodeModel.create(record)).toObject();
  }

  async clearData() {
    await this.recoveryPasswordsCodeModel.deleteMany({});
  }
}
