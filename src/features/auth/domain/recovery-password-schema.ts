import { Prop, Schema } from '@nestjs/mongoose';

@Schema() //TODO убрать монгусовский функционал
export class RecoveryPasswordsCode {
  @Prop()
  id: string;

  @Prop()
  userId: string;

  @Prop()
  email: string;

  @Prop()
  recoveryCode: string;

  @Prop({ required: true })
  expirationDate: Date;
}
