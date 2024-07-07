import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

export type CatDocument = HydratedDocument<Comment>;

// {
//   "id": "string",
//   "content": "string",
//   "commentatorInfo": {
//   "userId": "string",
//     "userLogin": "string"
// },
//   "createdAt": "2024-07-05T08:56:17.899Z",
//   "likesInfo": {
//   "likesCount": 0,
//     "dislikesCount": 0,
//     "myStatus": "None"
// }
// }

@Schema()
export class LikesInfo {
  @Prop({ required: true })
  likesCount: number;

  @Prop({ required: true })
  dislikesCount: number;

  @Prop({ required: true })
  myStatus: string;
}

@Schema()
export class CommentatorInfo {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  userLogin: string;
}

export const LikesInfoSchema = SchemaFactory.createForClass(LikesInfo);
export const CommentatorInfoSchema =
  SchemaFactory.createForClass(CommentatorInfo);

@Schema()
export class Comment {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  id: string;

  @Prop()
  postId: string;

  @Prop()
  content: string;

  @Prop()
  login: string;

  @Prop()
  createdAt: string;

  @Prop()
  password: string;

  @Prop({ default: {}, required: true, type: LikesInfo })
  likesInfo: LikesInfo;
  @Prop({ default: {}, required: true, type: LikesInfo })
  commentatorInfo: CommentatorInfo;
}

// interface CommentsStatics {
//   pagination: (params: any, projection: any) => any;
// }

export const CommentsSchema = SchemaFactory.createForClass(Comment);
//
//
// CommentsSchema.statics = {
//   pagination: pagination,
// };
//
export type CommentModel = Model<Comment>;
// & CommentsStatics;
