import { IsString, Length, Matches } from 'class-validator';
import { IsNotOnlySpaces } from 'src/shared/validators/is-not-only-spaces';

export class CreateBlogDto {
  @IsNotOnlySpaces({ message: 'The string should not consist only of spaces' })
  @Length(1, 15)
  @IsString()
  name: string;

  @Length(1, 500)
  @IsString()
  description: string;

  @Length(1, 100)
  @IsString()
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}
