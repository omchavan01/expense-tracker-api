import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
const BASE_URL = configService.get<string>('BASE_URL');

@Controller(BASE_URL!)
export class AppController {
  @Get()
  getHelloWorld(): string {
    return 'Welcome to the Expense Tracker API';
  }
}
