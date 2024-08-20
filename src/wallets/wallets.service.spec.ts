import { Test, TestingModule } from '@nestjs/testing';
import { WalletsRepository } from 'src/wallets/wallets-repository.service';

describe('WalletsService', () => {
  let service: WalletsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletsRepository],
    }).compile();

    service = module.get<WalletsRepository>(WalletsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
