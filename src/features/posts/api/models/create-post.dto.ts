import { IsString, Length, Validate } from 'class-validator';
import { UniqueValidator } from 'src/shared/validators/is-exist-blog';
import { IsNotOnlySpaces } from 'src/shared/validators/is-not-only-spaces';

export class CreatePostDtoWithoutBlogId {
  @Length(1, 30)
  @IsNotOnlySpaces()
  @IsString()
  title: string;

  @Length(1, 100)
  @IsNotOnlySpaces()
  @IsString()
  shortDescription: string;

  @Length(1, 1000)
  @IsNotOnlySpaces()
  @IsString()
  content: string;
}

export class CreatePostDto extends CreatePostDtoWithoutBlogId {
  @Length(1, 1000)
  @Validate(UniqueValidator, ['IsExistBlog'], {
    message: 'blog is not exist',
  })
  @IsNotOnlySpaces()
  @IsString()
  blogId: string;
}
