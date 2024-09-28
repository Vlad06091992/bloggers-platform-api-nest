import { Length } from 'class-validator';

export class CommentDto {
  @Length(20, 300)
  content: string;
}

export class CreateCommentDto extends CommentDto {
  userId: string;
  postId: string;
}
