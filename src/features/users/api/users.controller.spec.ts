import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from 'src/features/users/api/users.controller';
import { UsersService } from 'src/features/users/application/users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
