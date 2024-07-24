import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { UsersService } from 'src/features/users/application/users.service';
import { CreateUserDto } from 'src/features/users/api/models/create-user.dto';

@Injectable()
export class IsExistUserValidationPipe
  implements PipeTransform<CreateUserDto, any>
{
  constructor(protected userService: UsersService) {}

  async transform(value: CreateUserDto) {
    const isExistUserEmail = await this.userService.findUserByEmailOrLogin(
      value.email,
    );
    const isExistUserLogin = await this.userService.findUserByEmailOrLogin(
      value.login,
    );

    if (isExistUserEmail || isExistUserLogin) {
      throw new BadRequestException({
        errorsMessages: [{ message: 'user is already exist', field: isExistUserEmail ? "email" : "login" }],
      });
    }
    return value;
  }
}
