import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from 'src/features/auth/api/auth.controller';
import { AuthService } from 'src/features/auth/application/auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
