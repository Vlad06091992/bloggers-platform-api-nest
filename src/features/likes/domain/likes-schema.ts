import { Model, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

type LikedEntity = 'post' | 'comment';
type LikeStatus = 'Like' | 'Dislike';

@Schema()
export class Likes {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  id: string;

  @Prop()
  userId: string;

  @Prop()
  login: string;

  @Prop()
  likedEntity: LikedEntity;

  @Prop()
  likeStatus: LikeStatus;

  @Prop()
  entityId: string;

  @Prop()
  addedAt: string;
}

export const LikesSchema = SchemaFactory.createForClass(Likes);

LikesSchema.set('toObject', {
  transform: (doc, ret, options) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

export type LikesModel = Model<Likes>;
