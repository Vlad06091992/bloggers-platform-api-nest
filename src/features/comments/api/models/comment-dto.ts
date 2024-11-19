import { Length } from 'class-validator';
import { Posts } from 'src/features/posts/entity/posts';

export class CommentDto {
  @Length(20, 300)
  content: string;
}

export class CreateCommentDto extends CommentDto {
  userId: string;
  userLogin: string;
  post: Posts;
  content: string;
}
