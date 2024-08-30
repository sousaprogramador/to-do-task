import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthController {
  @Get()
  checkHealth(): string {
    return 'OK';
  }
}
