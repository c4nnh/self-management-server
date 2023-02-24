import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Health check')
export class AppController {
  @Get('health-check')
  healthCheck() {
    return true;
  }
}
