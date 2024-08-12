import { Model } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class OldTokensIds {
  @Prop()
  expiredTokenId: string;
}

export const OldTokensIdsSchema = SchemaFactory.createForClass(OldTokensIds);

OldTokensIdsSchema.set('toObject', {
  transform: (doc, ret) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

export type OldTokensIdsModel = Model<OldTokensIds>;
