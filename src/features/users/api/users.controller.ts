import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/features/users/application/users.service';
import { CreateUserDto } from 'src/features/users/api/models/create-user.dto';
import { getIdFromParams } from 'src/infrastructure/decorators/getIdFromParams';
import { IsExistUserValidationPipe } from 'src/infrastructure/pipes/isExistUser';
import { BasicAuthGuard } from 'src/features/auth/guards/basic-auth.guard';
import { getValidQueryParamsForUsers } from 'src/infrastructure/decorators/getValidQueryParamsForUsers';
import { RequiredParamsValuesForUsers } from 'src/shared/common-types';

@Controller('/sa/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(BasicAuthGuard)
  @Post()
  create(@Body(IsExistUserValidationPipe) createUserDto: CreateUserDto) {
    //pipe внутри декоратора
    return this.usersService.create(createUserDto);
  }
  @UseGuards(BasicAuthGuard)
  @Get()
  findAll(@getValidQueryParamsForUsers() params: RequiredParamsValuesForUsers) {
    return this.usersService.findAll(params);
  }

  @Get(':id')
  async findOne(@getIdFromParams() id: string) {
    const user = await this.usersService.findOne(id);

    if (!id) {
      throw new NotFoundException();
    }

    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async remove(@getIdFromParams() id: string) {
    if (!id) {
      throw new NotFoundException();
    }

    const isDeleted = await this.usersService.remove(id);

    if (!isDeleted) {
      throw new NotFoundException();
    }
  }
}
