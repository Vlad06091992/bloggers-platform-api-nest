import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { pagination } from 'src/utils';

@Schema()
export class Blog {
  @Prop()
  _id: Types.ObjectId;

  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  websiteUrl: string;

  @Prop()
  createdAt: string;

  @Prop()
  isMembership: boolean;
}

interface BlogStatics {
  pagination: (params: any, filter: any, projection: any) => any;
}

export const BlogsSchema = SchemaFactory.createForClass(Blog);

BlogsSchema.statics = {
  pagination: pagination,
};

BlogsSchema.set('toObject', {
  transform: (doc, ret, options) => {
    delete ret.__v;
    delete ret._id;
    return ret;
  },
});

//
export type BlogModel = Model<Blog> & BlogStatics;
