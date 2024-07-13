import { IsString, Length } from 'class-validator';

export class NewPasswordDto {
  @IsString()
  recoveryCode: string;

  @Length(6, 20)
  @IsString()
  newPassword: string;
}
