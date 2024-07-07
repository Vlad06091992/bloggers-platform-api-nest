import { IsString, Length, Matches } from 'class-validator';
export class CreateBlogDto {
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
