import { Prop, Schema } from '@nestjs/mongoose';

@Schema() //TODO убрать монгусовский функционал
export class RegistrationData {
  @Prop()
  userId: string;

  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true })
  isConfirmed: boolean;
}

@Schema() //TODO убрать монгусовский функционал
export class User {
  @Prop()
  id: string;

  @Prop()
  email: string;

  @Prop()
  login: string;

  @Prop()
  createdAt: string;

  @Prop()
  password: string;
}
