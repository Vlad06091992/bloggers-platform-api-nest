import {
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { RefreshTokenGuard } from 'src/features/auth/guards/refresh-token-guard';
import { GetUserDevicesByUserIdCommand } from 'src/features/security/application/use-cases/get-devices-by-user-id';
import { DeleteOtherDevicesCommand } from 'src/features/security/application/use-cases/delete-other-devices';
import { DeleteDevice } from 'src/features/security/application/use-cases/delete-session';
import { JwtService } from '@nestjs/jwt';
import { GetRefreshToken } from 'src/infrastructure/decorators/getRefreshToken';

@Controller('security')
export class SecurityController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
  ) {}

  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  @Get('devices')
  async getDevices(
    @Res({ passthrough: true }) res: Response,
    @GetRefreshToken() refreshToken: string,
  ) {
    return await this.commandBus.execute(
      new GetUserDevicesByUserIdCommand(refreshToken),
    );
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  @Delete('devices')
  async deleteOtherDevices(
    @Res({ passthrough: true }) res: Response,
    @GetRefreshToken() refreshToken: string,
  ) {
    return await this.commandBus.execute(
      new DeleteOtherDevicesCommand(refreshToken),
    );
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  @Delete('devices/:id')
  async deleteDevice(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
    @GetRefreshToken() refreshToken: string, //декоратор
  ) {
    const { sub } = this.jwtService.decode(refreshToken);
    await this.commandBus.execute(new DeleteDevice(id, sub));
  }
}
