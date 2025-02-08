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
import { GetIdFromParams } from 'src/infrastructure/decorators/getIdFromParams';
import { IsExistUserValidationPipe } from 'src/infrastructure/pipes/isExistUser';
import { BasicAuthGuard } from 'src/features/auth/guards/basic-auth.guard';
import { getValidQueryParamsForUsers } from 'src/infrastructure/decorators/getValidQueryParamsForUsers';
import { RequiredParamsValuesForUsers } from 'src/shared/common-types';
import {
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateUserDtoSwagger,
  OutputErrorUserDtoSwagger,
  PaginatedResponseUsersOutput,
  UserOutput,
} from 'src/features/users/swagger';

@ApiTags('Super admin users')
@Controller('/sa/users')
@ApiBasicAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(BasicAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Создаёт нового пользователя' })
  @ApiBody({
    description: 'Пример объекта для создания пользователя',
    type: CreateUserDtoSwagger,
  })
  @ApiResponse({
    status: 200,
    description: 'Пользователь успешно создан',
    type: UserOutput,
    example: {
      login: 'user5',
      password: 'qwerty',
      email: 'vlad4@mail.ru',
      id: '23b8b0bd-974c-4dd6-a0ae-42f9024344ed',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Не валидные данные для создания пользователя',
    type: OutputErrorUserDtoSwagger,
    example: {
      errorsMessages: [
        {
          message: 'Не правильный емайл',
          field: 'email',
        },
      ],
    },
  })
  @ApiResponse({ status: 401, description: 'Вы не авторизованы' })
  create(@Body(IsExistUserValidationPipe) createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @UseGuards(BasicAuthGuard)
  @Get()
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Сортировка по указанному полю',
    example: 'createdAt',
  })
  @ApiQuery({
    name: 'sortDirection',
    required: false,
    enum: ['asc', 'desc'],
    description: 'Направление сортировки(asc по возрастанию,desc по убыванию)',
    example: 'desc',
  })
  @ApiQuery({
    name: 'pageNumber',
    required: false,
    type: Number,
    description: 'Номер страницы, которую нужно вернуть',
    example: 1,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Размер страниц, которые нужно вернуть',
    example: 10,
  })
  @ApiQuery({
    name: 'searchLoginTerm',
    required: false,
    type: String,
    description: 'Поиск пользователя по подстроке в логине',
    example: '',
  })
  @ApiQuery({
    name: 'searchEmailTerm',
    required: false,
    type: String,
    description: 'Поиск пользователя по подстроке в адресе электронной почты',
    example: '',
  })
  @ApiOperation({ summary: 'Получить пользователей постранично' })
  @ApiResponse({
    status: 200,
    description: 'Успешный ответ',
    type: PaginatedResponseUsersOutput,
  })
  @ApiResponse({ status: 401, description: 'Вы не авторизованы' })
  findAll(@getValidQueryParamsForUsers() params: RequiredParamsValuesForUsers) {
    return this.usersService.findAll(params);
  }
  @UseGuards(BasicAuthGuard)
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'id юзера',
    example: 'b18ad9f7-d577-4a38-b1a7-8308164995c0',
  })
  @ApiOperation({ summary: 'Получить информацию о пользователе по id' })
  @ApiResponse({ status: 401, description: 'Вы не авторизованы' })
  @ApiResponse({ status: 200, description: 'Успешно' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findOne(@GetIdFromParams() id: string) {
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
  @ApiParam({
    name: 'id',
    required: true,
    type: String,
    description: 'id юзера',
    example: 'b18ad9f7-d577-4a38-b1a7-8308164995c0',
  })
  @ApiOperation({ summary: 'Удалить пользователя по id' })
  @ApiResponse({ status: 401, description: 'Вы не авторизованы' })
  @ApiResponse({ status: 204, description: 'Успешно' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async remove(@GetIdFromParams() id: string) {
    if (!id) {
      throw new NotFoundException();
    }

    const isDeleted = await this.usersService.remove(id);

    if (!isDeleted) {
      throw new NotFoundException();
    }
  }
}
