import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export class GenerateJWTCommand {
  constructor(
    public payload: any,
    public expiresIn: string,
  ) {}
}

@CommandHandler(GenerateJWTCommand)
export class GenerateJWTHandler implements ICommandHandler<GenerateJWTCommand> {
  constructor(
    @Inject() protected jwtService: JwtService,
    @Inject() protected configService: ConfigService,
  ) {}

  async execute({ payload, expiresIn }: GenerateJWTCommand) {
    return this.jwtService.sign(payload, {
      expiresIn,
      secret: this.configService.get('SECRET_KEY'),
    });
  }
}
