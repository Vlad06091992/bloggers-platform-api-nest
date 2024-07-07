import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @IsEmail(undefined, {
    message: 'incorrect email',
  })
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;

  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @Length(6, 20)
  @IsString()
  password: string;
}
