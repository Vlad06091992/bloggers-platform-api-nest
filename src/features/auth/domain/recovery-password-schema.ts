import { Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
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

export const RecoveryPasswordsCodesSchema = SchemaFactory.createForClass(
  RecoveryPasswordsCode,
);

RecoveryPasswordsCodesSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

export type RecoveryPasswordsCodeModel = Model<RecoveryPasswordsCode>;
