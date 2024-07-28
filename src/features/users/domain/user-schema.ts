import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { pagination } from 'src/utils';

@Schema()
export class RegistrationData {
  @Prop({ required: true })
  confirmationCode: string;

  @Prop({ required: true })
  expirationDate: Date;

  @Prop({ required: true })
  isConfirmed: boolean;
}

export const RegistrationDataSchema =
  SchemaFactory.createForClass(RegistrationData);

@Schema()
export class User {
  @Prop()
  _id: Types.ObjectId;

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

  @Prop({ default: {}, required: true, type: RegistrationData })
  registrationData: RegistrationData;

  // static pagination = pagination;
}

interface UserStatics {
  pagination: (params: any, filter: any, projection: any) => any;
}

export const UserSchema = SchemaFactory.createForClass(User);
//
//
UserSchema.statics = {
  pagination: pagination,
};
//
export type UserModel = Model<User> & UserStatics;
