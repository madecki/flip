import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/hc')
  healthCheck(): boolean {
    return true;
  }
}
