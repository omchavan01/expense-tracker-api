import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getApiInfo(): string {
    return 'Welcome to the Expense Tracker API';
  }
}