import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { RefreshTokenGuard } from 'src/features/auth/guards/refresh-token-guard';
import { GetUserDevicesByUserIdCommand } from 'src/features/security/application/use-cases/get-devices-by-user-id';
import { getRefreshTokenFromContextOrRequest } from 'src/utils';
import { DeleteOtherDevicesCommand } from 'src/features/security/application/use-cases/delete-other-devices';
import { DeleteDevice } from 'src/features/security/application/use-cases/delete-session';

@Controller('security')
export class SecurityController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(RefreshTokenGuard)
  @HttpCode(200)
  @Get('devices')
  async getDevices(@Res({ passthrough: true }) res: Response, @Request() req) {
    const refreshToken = getRefreshTokenFromContextOrRequest(null, req);

    return await this.commandBus.execute(
      new GetUserDevicesByUserIdCommand(refreshToken),
    );
  }

  @UseGuards(RefreshTokenGuard)
  @HttpCode(204)
  @Delete('devices')
  async deleteOtherDevices(
    @Res({ passthrough: true }) res: Response,
    @Request() req,
  ) {
    const refreshToken = getRefreshTokenFromContextOrRequest(null, req);

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
    @Request() req,
  ) {
    console.log(id);
    const refreshToken = getRefreshTokenFromContextOrRequest(null, req);

    return await this.commandBus.execute(new DeleteDevice(refreshToken, id));
  }
}
