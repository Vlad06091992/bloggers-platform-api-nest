import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UsersService } from 'src/features/users/application/users.service';
import { CreateUserDto } from 'src/features/users/api/models/create-user.dto';
import { isValidIdParam } from 'src/infrastructure/decorators/isValidIdParam';
import { Response } from 'express';
import { IsExistUserValidationPipe } from 'src/infrastructure/pipes/isExistUser';

// import { UpdateUserDto } from 'src/features/users/api/models/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(IsExistUserValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query('sortBy') sortBy: string,
    @Query('sortDirection') sortDirection: string,
    @Query('pageNumber') pageNumber: string,
    @Query('pageSize') pageSize: string,
    @Query('searchLoginTerm') searchLoginTerm: string,
    @Query('searchEmailTerm') searchEmailTerm: string,
  ) {
    const QueryParams = {
      sortDirection,
      searchEmailTerm,
      searchLoginTerm,
      pageNumber,
      pageSize,
      sortBy,
    };

    return this.usersService.findAll(QueryParams);
  }

  @Get(':id')
  async findOne(@isValidIdParam() id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@isValidIdParam() id: string, @Res() res: Response) {
    if (!id) {
      res.sendStatus(404);
      return;
    }

    const isDeleted = this.usersService.remove(id);

    if (!isDeleted) {
      throw new BadRequestException();
    }

    return res.status(HttpStatus.NOT_FOUND).send();
  }
}
