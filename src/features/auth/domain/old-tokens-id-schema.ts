import { Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class OldTokensIds {
  @Prop()
  expiredTokenId: string;
}

export const OldTokensIdsSchema = SchemaFactory.createForClass(OldTokensIds);

OldTokensIdsSchema.set('toObject', {
  transform: (doc, ret, options) => {
    delete ret.__v;
    delete ret._id;
    // delete ret.id;
    // delete ret.userId;
    // delete ret.isActive;
    // delete ret.deviceId;
    return ret;
  },
});

export type OldTokensIdsModel = Model<OldTokensIds>;
