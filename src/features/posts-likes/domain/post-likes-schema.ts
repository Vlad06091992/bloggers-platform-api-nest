import { Types } from 'mongoose';
import { Prop, Schema } from '@nestjs/mongoose';
export type LikeStatus = 'Like' | 'Dislike';

@Schema()
export class PostLikes {
  @Prop()
  id: string;

  @Prop()
  userId: string;

  @Prop()
  login: string;

  @Prop()
  likeStatus: LikeStatus;

  @Prop()
  postId: string;

  @Prop()
  addedAt: string;
}
