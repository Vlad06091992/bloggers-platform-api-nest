import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { pagination } from 'src/utils';

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

@Schema()
export class Comment {
  @Prop()
  id: string;

  @Prop()
  postId: string;

  @Prop()
  userId: string;

  @Prop()
  content: string;

  @Prop()
  createdAt: string;
}

export const CommentsSchema = SchemaFactory.createForClass(Comment);

interface CommentsStatics {
  pagination: (
    params: any,
    filter: any,
    projection: any,
    map_callback: any,
  ) => any;
}

CommentsSchema.statics = {
  pagination: pagination,
};

// CommentsSchema.virtual('commentatorInfo').get(function () {
//   return {
//     userId: this.userId,
//     userLogin: this.userLogin,
//   };
// });

CommentsSchema.set('toObject', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, dataInMongoDb) {
    delete dataInMongoDb._id;
    delete dataInMongoDb.postId;
    delete dataInMongoDb.userId;
    delete dataInMongoDb.userLogin;
  },
});

export type CommentsModel = Model<Comment> & CommentsStatics;
