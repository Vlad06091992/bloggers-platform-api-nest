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
import { EmailService } from 'src/email/email.service';
import { NewPasswordDto } from 'src/features/auth/api/models/new-password.dto';
import { EmailResendingDto } from 'src/features/auth/api/models/email-resending-dto';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from 'src/features/auth/application/use-cases/login';
import { RecoveryPasswordCommand } from 'src/features/auth/application/use-cases/recovery-password';
import { GetMeHandler } from 'src/features/auth/application/use-cases/get-me';
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

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly commandBus: CommandBus,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) res: Response,
    @Request() req,
  ) {
    const deviceId = uuidv4();
    const ip = req.ip;
    const title = req.headers['user-agent'];
    const userId = req.user.id;

    const result = await this.commandBus.execute(
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

    return true;
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response, @Request() req) {
    const { refreshToken } = req.cookies;
    await this.commandBus.execute(new LogoutCommand(refreshToken));
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(204)
  @Post('password-recovery')
  async recoveryPassword(@Body() recoveryPasswordDTO: RecoveryPasswordDto) {
    // return this.authService.recoveryPassword(recoveryPasswordDTO.email);
    return this.commandBus.execute(
      new RecoveryPasswordCommand(recoveryPasswordDTO.email),
    );
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(204)
  @Post('registration')
  registration(@Body(IsExistUserValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto, true);
  }

  @UseGuards(ThrottlerGuard)
  @Post('registration-email-resending')
  @HttpCode(204)
  registrationEmailResending(
    @Body() @Body() emailResendingDto: EmailResendingDto,
  ) {
    const { email } = emailResendingDto;
    return this.commandBus.execute(new ResendEmailCommand(email));
  }

  @UseGuards(ThrottlerGuard)
  @Post('new-password')
  @HttpCode(204)
  newPassword(@Body() { newPassword, recoveryCode }: NewPasswordDto) {
    // return this.authService.updateUserPassword(newPasswordDto);
    return this.commandBus.execute(
      new UpdateUserPasswordCommand(recoveryCode, newPassword),
    );
  }

  @UseGuards(ThrottlerGuard)
  @Post('registration-confirmation')
  @HttpCode(204)
  registrationConfirmation(@Body('code') code: string) {
    return this.commandBus.execute(new ConfirmEmailCommand(code));
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(200)
  getUserInfo(@Request() req) {
    const { userId } = req.user;
    return this.commandBus.execute(new GetMeHandler(userId));
  }
}
