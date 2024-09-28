import { Prop, Schema } from '@nestjs/mongoose';

export type LikeStatus = 'Like' | 'Dislike';

@Schema()
export class CommentLikes {
  @Prop()
  id: string;

  @Prop()
  userId: string;

  @Prop()
  login: string;

  @Prop()
  likeStatus: LikeStatus;

  @Prop()
  commentId: string;

  @Prop()
  addedAt: string;
}
