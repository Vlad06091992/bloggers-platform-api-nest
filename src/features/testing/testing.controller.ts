import { Controller, Delete, HttpCode } from '@nestjs/common';
import { TestingService } from 'src/features/testing/testing.service';

@Controller('testing')
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @Delete('all-data')
  @HttpCode(204)
  async ClearDatabase() {
    await this.testingService.clearDatabase();
  }
}
