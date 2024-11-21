import { IsEmail, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserOutput {
  @IsUUID()
  @ApiProperty({ description: 'Уникальный идентификатор пользователя' })
  id: string;

  @IsEmail()
  @ApiProperty({ description: 'Электронная почта пользователя' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Логин пользователя' })
  login: string;

  @ApiProperty({
    description: 'Дата и время создания пользователя',
    type: String,
  })
  createdAt: string;
}

export class PaginatedResponseUsersOutput {
  @ApiProperty({ description: 'Общее количество страниц' })
  pagesCount: number;

  @ApiProperty({ description: 'Номер текущей страницы' })
  page: number;

  @ApiProperty({ description: 'Размер страницы' })
  pageSize: number;

  @ApiProperty({ description: 'Общее количество пользователей' })
  totalCount: number;

  @ApiProperty({ type: [UserOutput], description: 'Массив пользователей' })
  items: UserOutput[];
}

export class CreateUserDtoSwagger {
  @ApiProperty({
    type: 'string',
    maxLength: 10,
    minLength: 3,
    pattern: '^[a-zA-Z0-9_-]*$',
    description: 'must be unique',
  })
  login: string;
  @ApiProperty({
    type: 'string',
    maxLength: 20,
    minLength: 6,
  })
  password: string;

  @ApiProperty({
    type: 'string',
    pattern: '^[w-.]+@([w-]+.)+[w-]{2,4}$',
    example: 'example@example.com',
    description: 'must be unique',
  })
  email: string;
}

export class Err {
  @ApiProperty({
    type: 'string',
    description: 'Сообщение об ошибке',
  })
  message: string;

  @ApiProperty({
    type: 'string',
    description: 'Поле, в котором произошла ошибка',
  })
  field: string;
}

export class OutputErrorUserDtoSwagger {
  @ApiProperty({
    type: [Err],
    description: 'Массив сообщений об ошибках',
  })
  errorMessages: Err[];
}
