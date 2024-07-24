import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Request,
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
import { RegistrationConfirmationDto } from 'src/features/auth/api/models/registration-confirmation-dto';
import { NewPasswordDto } from 'src/features/auth/api/models/new-password.dto';
import { EmailResendingDto } from 'src/features/auth/api/models/email-resending-dto';
import { JwtAuthGuard } from 'src/features/auth/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDTO: LoginDTO, @Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(ThrottlerGuard)
  @HttpCode(204)
  @Post('password-recovery')
  async recoveryPassword(@Body() recoveryPasswordDTO: RecoveryPasswordDto) {
    return this.authService.recoveryPassword(recoveryPasswordDTO.email);
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
    return this.authService.resendEmail(email);
  }

  @UseGuards(ThrottlerGuard)
  @Post('new-password')
  @HttpCode(204)
  newPassword(@Body() newPasswordDto: NewPasswordDto) {
    return this.authService.updateUserPassword(newPasswordDto);
  }

  @UseGuards(ThrottlerGuard)
  @Post('registration-confirmation')
  @HttpCode(204)
  registrationConfirmation(@Body('code') code: string) {
    return this.authService.confirmEmail(code);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(200)
  getUserInfo(@Request() req) {
    const { userId } = req.user;
    return this.authService.getMe(userId);
  }
}
