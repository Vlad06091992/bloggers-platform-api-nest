import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { pagination } from 'src/utils';

@Schema({ _id: false })
export class Like {
  @Prop({ required: true })
  addedAt: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  login: string;
}

@Schema({ _id: false })
export class ExtendedLikesInfo {
  @Prop({ default: 0, required: true })
  likesCount: number;

  @Prop({ default: 0, required: true })
  dislikesCount: number;

  @Prop({ required: true })
  myStatus: string;

  @Prop({ required: true, default: [], type: [Like] })
  newestLikes: Like[];
}

@Schema()
export class Post {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  id: string;

  @Prop()
  title: string;

  @Prop()
  shortDescription: string;

  @Prop()
  content: string;

  @Prop()
  blogId: string;

  @Prop()
  blogName: string;

  @Prop()
  createdAt: string;
}

interface PostStatics {
  pagination: (params: any, filter: any, projection: any) => any;
}

export const PostsSchema = SchemaFactory.createForClass(Post);
//
//
PostsSchema.statics = {
  pagination: pagination,
};

PostsSchema.set('toObject', {
  transform: (doc, ret, options) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

//
export type PostModel = Model<Post> & PostStatics;
