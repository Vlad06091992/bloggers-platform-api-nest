import { IsString, Length } from 'class-validator';

export class CreatePostDtoWithoutBlogId {
  @Length(1, 30)
  @IsString()
  title: string;

  @Length(1, 100)
  @IsString()
  shortDescription: string;

  @Length(1, 1000)
  @IsString()
  content: string;
}

export class CreatePostDto extends CreatePostDtoWithoutBlogId {
  @Length(1, 1000)
  @IsString()
  blogId: string;
}
