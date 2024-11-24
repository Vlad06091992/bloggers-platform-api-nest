import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsUUID } from "class-validator";

export class LoginDtoSwagger {
  @ApiProperty({
    type: 'string',
    example: 'example@example.com',
  })
  loginOrEmail: string;
  @ApiProperty({
    type: 'string',
    example: 'qwerty',
  })
  password: string;
}

export class RegistrtionDtoSwagger {
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

export class PasswordRecoveryDtoSwagger {
  @ApiProperty({
    type: 'string',
    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    example: 'useremail@company.com',
  })
  email: string
}

export class RegistrationEmailResendingRecoveryDtoSwagger {
  @ApiProperty({
    type: 'string',
    pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
    description:'Email уже зарегистрированного, но не подтвержденного пользователя',
    example: 'useremail@company.com',
  })
  email: string
}

export class RegistrationConfirmationDtoSwagger {
  @ApiProperty({
    type: 'string',
    description:'Код, который будет отправлен по электронной почте внутри ссылки.',
  })
  code: string
}

export class NewPasswordDtoSwagger {
  @ApiProperty({
    type: 'string',
    maxLength: 20,
    minLength: 6
  })
  newPassword: string
  @ApiProperty({
    type: 'string'
  })
  recoveryCode: string
}


export class LoginDtoOutputSwagger {
  @ApiProperty({
    type: 'string',
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTG9naW4iOiJWbGFkIiwic3ViIjoiYzEzZTA4OTktZDcyMC00YTFmLWIwYWMtNDhhMGY0YjM4MDZjIiwiZGV2aWNlSWQiOiIwNTUwMzM4MS1kMTc3LTQ0ZjMtOTlmMy1iNzgzMDFjNjgwMWEiLCJ0b2tlbklkIjoiNjhmZGM1MTktMWNlNy00NTNmLThlMmMtNmM0MDNkNDBiY2Y1IiwiaWF0IjoxNzMyNDQzNjM5LCJleHAiOjE3MzI0Nzk2Mzl9.eb8ZhSy5PXmRlC0coqkPIJxpU9z8hWYWR7dVVdGEWKo",
  })
  accessToken: string
}

export class AuthMeOutputSwagger {
  @IsUUID()
  @ApiProperty({ description: 'Уникальный идентификатор пользователя' })
  userId: string;

  @IsEmail()
  @ApiProperty({ description: 'Электронная почта пользователя' })
  email: string;

  @IsString()
  @ApiProperty({ description: 'Логин пользователя' })
  login: string;
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

export class OutputRegistrationDtoSwagger {
  @ApiProperty({
    type: [Err],
    description: 'Массив сообщений об ошибках',
  })
  errorMessages: Err[];
}
