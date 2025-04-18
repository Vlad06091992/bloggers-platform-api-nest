import { IsEmail, Matches } from 'class-validator';

export class RecoveryPasswordDto {
  @IsEmail(undefined, {
    message: 'incorrect email',
  })
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
