import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsString,
  Length,
} from 'class-validator';
import { IsNotOnlySpaces } from 'src/shared/validators/is-not-only-spaces';

export class CreateOrUpdateQuestionDto {
  @IsNotOnlySpaces({ message: 'The string should not consist only of spaces' })
  @Length(10, 500)
  @IsString()
  body: string;

  @IsArray({ message: 'answers should be array' })
  @ArrayMinSize(1)
  correctAnswers: string[];
}

export class UpdateQuestionPublishDto {
  @IsBoolean()
  published: boolean;
}
