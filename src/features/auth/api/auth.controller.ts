import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from 'src/features/auth/application/auth.service';
import { LocalAuthGuard } from 'src/features/auth/guards/local-auth.guard';
import { RecoveryPasswordDto } from 'src/features/auth/api/models/recovery-password.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { LoginDTO } from 'src/features/auth/api/models/login-dto';
import { CreateUserDto } from 'src/features/users/api/models/create-user.dto';
import { IsExistUserValidationPipe } from 'src/infrastructure/pipes/isExistUser';
import { UsersService } from 'src/features/users/application/users.service';
import { NewPasswordDto } from 'src/features/auth/api/models/new-password.dto';
import { EmailResendingDto } from 'src/features/auth/api/models/email-resending-dto';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from 'src/features/auth/application/use-cases/login';
import { RecoveryPasswordCommand } from 'src/features/auth/application/use-cases/recovery-password';
import { GetMeCommand } from 'src/features/auth/application/use-cases/get-me';
import { UpdateUserPasswordCommand } from 'src/features/auth/application/use-cases/update-user-password';
import { ConfirmEmailCommand } from 'src/features/auth/application/use-cases/confirm-email';
import { ResendEmailCommand } from 'src/features/auth/application/use-cases/resend-email';
import { Response } from 'express';
import { add } from 'date-fns';
import { RefreshTokenGuard } from 'src/features/auth/guards/refresh-token-guard';
import { RefreshJWTCommand } from 'src/features/auth/application/use-cases/refresh-tokens';
import { CreateSessionCommand } from 'src/features/auth/application/use-cases/create-session';
import { v4 as uuidv4 } from 'uuid';
import { LogoutCommand } from 'src/features/auth/application/use-cases/logout';
import { JwtService } from '@nestjs/jwt';
import { GetRefreshToken } from 'src/infrastructure/decorators/getRefreshToken';
import { GetUserByAccessToken } from 'src/infrastructure/decorators/getUserByAccessToken';
import { NotTestingThrottleGuard } from 'src/features/auth/guards/custom-throttle-guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateUserDtoSwagger, OutputErrorUserDtoSwagger, UserOutput } from "src/features/users/swagger";
import {
  AuthMeOutputSwagger,
  LoginDtoOutputSwagger,
  LoginDtoSwagger, NewPasswordDtoSwagger, OutputRegistrationDtoSwagger,
  PasswordRecoveryDtoSwagger, RegistrationConfirmationDtoSwagger, RegistrationEmailResendingRecoveryDtoSwagger,
  RegistrtionDtoSwagger
} from "src/features/auth/swagger";
import { ApiCookieAuth } from "@nestjs/swagger/dist/decorators/api-cookie.decorator";

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @UseGuards(NotTestingThrottleGuard)
  @HttpCode(200)
  @Post('login')
  @ApiOperation({ summary: 'Залогиниться в системе' })
  @ApiBody({
    description: 'Пример объекта c данными',
    type: LoginDtoSwagger,
  })
  @ApiResponse({
    status: 200,
    description:
    'Возвращает JWT accessToken (срок действия истекает через 10 часов) в теле запроса и JWT refreshToken в cookie (http-only, secure) (срок действия истекает через 20 часов).',
    type: LoginDtoOutputSwagger
  })
  @ApiResponse({
    status: 401,
    description: 'Если пароль или логин неверны',
  })
  @ApiResponse({
    status: 429,
    description: 'Более 5 попыток с одного IP-адреса в течение 10 секунд.',
    example: {
      statusCode: 429,
      message: "ThrottlerException: Too Many Requests"
    },
  })
  async login(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) res: Response,
    @Request() req,
  ) {
    const deviceId = uuidv4();
    const ip = req.ip;
    const title = req.headers['user-agent'];
    const userId = req.user.id;

    await this.commandBus.execute(
      new CreateSessionCommand({ userId, ip, title, deviceId }),
    );

    const { refreshToken, accessToken } = await this.commandBus.execute(
      new LoginCommand(req.user, deviceId),
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      expires: add(new Date(), { months: 1 }),
    });

    return { accessToken };
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Получить новую пару токенов' })
  @ApiCookieAuth()
  @ApiResponse({
    status: 200,
    description:
      'Возвращает JWT accessToken (срок действия истекает через 10 часов) в теле запроса и JWT refreshToken в cookie (http-only, secure) (срок действия истекает через 20 часов).',
    type: LoginDtoOutputSwagger
  })
  @ApiResponse({
    status: 401,
    description: 'Если пароль или логин неверны',
  })
  @Post('refresh-token')
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Request() req,
  ) {
    const { refreshToken: oldToken } = req.cookies;

    const { refreshToken, accessToken } = await this.commandBus.execute(
      new RefreshJWTCommand(oldToken),
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      expires: add(new Date(), { months: 1 }),
    });

    return { accessToken };
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  @ApiCookieAuth()
  @Post('logout')
  @ApiOperation({ summary: 'Завершение текущей сессии пользователя в приложении.' })
  @ApiResponse({
    status: 204,
    description:
      'Успешно'
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  async logout(
    @Res({ passthrough: true }) res: Response,
    @Request() req,
    @GetRefreshToken() refreshToken: string,
  ) {
    await this.commandBus.execute(new LogoutCommand(refreshToken));
  }
  @ApiOperation({ summary: 'Восстановление пароля через подтверждение по email. Письмо должно быть отправлено с кодом восстановления внутри..' })
  @ApiBody({
    description: 'Пример объекта c данными',
    type: PasswordRecoveryDtoSwagger
  })
  @ApiResponse({
    status: 204,
    description:
      'Даже если текущий email не зарегистрирован (для предотвращения обнаружения email пользователя)'
  })
  @ApiResponse({
    status: 400,
    description:
      'Если email в inputModel недействителен (например, 222^gmail.com)'
  })
  @ApiResponse({
    status: 429,
    description:
      'Более 5 попыток с одного IP-адреса в течение 10 секунд'
  })
  @UseGuards(ThrottlerGuard)
  @HttpCode(204)
  @Post('password-recovery')
  async recoveryPassword(@Body() recoveryPasswordDTO: RecoveryPasswordDto) {
    return this.commandBus.execute(
      new RecoveryPasswordCommand(recoveryPasswordDTO.email),
    );
  }
  @ApiOperation({ summary: 'Регистрация в системе. Письмо с кодом подтверждения будет отправлено на указанный email.' })
  @ApiBody({
    description: 'Пример объекта c данными',
    type: RegistrtionDtoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Не валидные данные для регистрации пользователя',
    type: OutputRegistrationDtoSwagger,
    example: {
      errorsMessages: [
        {
          message: 'Не правильный емайл',
          field: 'email',
        },
      ],
    },
  })
  @ApiResponse({
    status: 204,
    description: 'Данные введены корректно. Письмо с кодом подтверждения будет отправлено на указанный адрес электронной почты. Код подтверждения должен быть в ссылке как параметр запроса, например: https://some-front.com/confirm-registration?code=youtcodehere',
  })
  @ApiResponse({
    status: 429,
    description: 'Более 5 попыток с одного IP-адреса в течение 10 секунд.',
    example: {
      statusCode: 429,
      message: "ThrottlerException: Too Many Requests"
    },
  })
  @UseGuards(ThrottlerGuard)
  @HttpCode(204)
  @Post('registration')
  registration(@Body(IsExistUserValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, true);
  }




  @ApiOperation({ summary: 'Повторно отправить письмо с подтверждением регистрации, если пользователь существует' })
  @ApiBody({
    description: 'Пример объекта c данными',
    type: RegistrationEmailResendingRecoveryDtoSwagger,
  })
  @ApiResponse({
    status: 204,
    description: 'Входные данные приняты. Электронное письмо с кодом подтверждения будет отправлено на указанный адрес. Код подтверждения должен быть в ссылке в виде параметра запроса, например: https://some-front.com/confirm-registration?code=yourcodehere',
  })
  @ApiBody({
    description: 'Пример объекта c данными',
    type: RegistrtionDtoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Не валидные данные для регистрации пользователя',
    type: OutputRegistrationDtoSwagger,
    example: {
      errorsMessages: [
        {
          message: 'Не правильный емайл',
          field: 'email',
        },
      ],
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Более 5 попыток с одного IP-адреса в течение 10 секунд.',
    example: {
      statusCode: 429,
      message: "ThrottlerException: Too Many Requests"
    },
  })
  @UseGuards(ThrottlerGuard)
  @Post('registration-email-resending')
  @HttpCode(204)
  registrationEmailResending(@Body() emailResendingDto: EmailResendingDto) {
    const { email } = emailResendingDto;
    return this.commandBus.execute(new ResendEmailCommand(email));
  }





  @ApiOperation({ summary: 'Подтвердить восстановление пароля.' })
  @ApiBody({
    description: 'Пример объекта c данными',
    type: NewPasswordDtoSwagger,
  })
  @ApiResponse({
    status: 204,
    description: 'Если код действителен и новый пароль принят',
  })
  @ApiResponse({
    status: 400,
    description: 'Если inputModel имеет неправильное значение (например, для некорректной длины пароля), или RecoveryCode неверен либо истёк'
  })
  @ApiResponse({
    status: 429,
    description: 'Более 5 попыток с одного IP-адреса в течение 10 секунд.',
    example: {
      statusCode: 429,
      message: "ThrottlerException: Too Many Requests"
    },
  })
  @UseGuards(ThrottlerGuard)
  @Post('new-password')
  @HttpCode(204)
  newPassword(@Body() { newPassword, recoveryCode }: NewPasswordDto) {
    return this.commandBus.execute(
      new UpdateUserPasswordCommand(recoveryCode, newPassword),
    );
  }




  @ApiOperation({ summary: 'Подтверждение регистрации.' })
  @ApiBody({
    description: 'Пример объекта c данными',
    type: RegistrationConfirmationDtoSwagger,
  })
  @ApiResponse({
    status: 204,
    description: 'Электронная почта была подтверждена. Аккаунт был активирован.',
  })
  @ApiResponse({
    status: 400,
    description: 'Если код подтверждения неверный, истёк или уже был использован',
    type: OutputRegistrationDtoSwagger,
    example: {
      errorsMessages: [
        {
          message: 'Не правильный емайл',
          field: 'email',
        },
      ],
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Более 5 попыток с одного IP-адреса в течение 10 секунд.',
    example: {
      statusCode: 429,
      message: "ThrottlerException: Too Many Requests"
    },
  })
  @UseGuards(ThrottlerGuard)
  @Post('registration-confirmation')
  @HttpCode(204)
  registrationConfirmation(@Body('code') code: string) {
    return this.commandBus.execute(new ConfirmEmailCommand(code));
  }




  @ApiOperation({ summary: 'Получить информацию о текущем пользователе.' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Успешно',
 type:AuthMeOutputSwagger
  })
  @ApiResponse({
    status: 401,
    description: 'Пользователь не авторизован',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(200)
  getUserInfo(
    @GetUserByAccessToken() { userId }: { userId: string; userLogin: string },
  ) {
    return this.commandBus.execute(new GetMeCommand(userId));
  }
}
