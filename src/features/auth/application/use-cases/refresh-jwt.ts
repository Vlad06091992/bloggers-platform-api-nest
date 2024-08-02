// import { Inject } from '@nestjs/common';
// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { ConfigService } from '@nestjs/config';
// import { JwtService } from '@nestjs/jwt';
//
// export class RefreshJWTCommand {
//   constructor(
//     public oldToken: string,
//   ) {}
// }
//
// @CommandHandler(RefreshJWTCommand)
// export class RefreshJWTHandler implements ICommandHandler<RefreshJWTCommand> {
//   constructor(
//     @Inject() protected jwtService: JwtService,
//     @Inject() protected configService: ConfigService,
//   ) {}
//
//   async execute({ oldToken, expiresIn }: RefreshJWTCommand) {
//     const data = this.jwtService.decode(oldToken) || null;
//     console.log(data);
//
//     const payload = {};
//
//     return this.jwtService.sign(payload, {
//       expiresIn,
//       secret: this.configService.get('SECRET_KEY'),
//     });
//   }
// }
