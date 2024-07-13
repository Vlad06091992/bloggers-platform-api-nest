import { InjectModel } from '@nestjs/mongoose';
import {
  RecoveryPasswordsCode,
  RecoveryPasswordsCodeModel,
} from 'src/features/auth/domain/recovery-password-schema';

export class RecoveryPasswordQueryRepository {
  constructor(
    @InjectModel(RecoveryPasswordsCode.name)
    private recoveryPasswordsCodeModel: RecoveryPasswordsCodeModel,
  ) {}

  async findUserByRecoveryCode(recoveryCode: string) {
    return this.recoveryPasswordsCodeModel.findOne({ recoveryCode }).exec();
  }
}
