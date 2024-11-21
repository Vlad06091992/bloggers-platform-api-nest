import { Length } from 'class-validator';
import { PostsEntity } from 'src/features/posts/entity/posts.entity';

export class CommentDto {
  @Length(20, 300)
  content: string;
}

export class CreateCommentDto extends CommentDto {
  userId: string;
  userLogin: string;
  post: PostsEntity;
  content: string;
}
