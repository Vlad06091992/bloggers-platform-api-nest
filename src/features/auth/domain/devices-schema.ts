import { Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class AuthDevices {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  id: string;

  @Prop()
  ip: string;

  @Prop()
  title: string;

  @Prop()
  userId: string;

  @Prop()
  deviceId: string;

  @Prop()
  lastActiveDate: string;

  @Prop()
  isActive: boolean;
}

export const AuthDevicesSchema = SchemaFactory.createForClass(AuthDevices);

AuthDevicesSchema.set('toObject', {
  transform: (doc, ret, options) => {
    delete ret.__v;
    delete ret._id;
    delete ret.id;
    delete ret.userId;
    delete ret.isActive;
    // delete ret.deviceId;
    return ret;
  },
});

export type AuthDevicesModel = Model<AuthDevices>;
