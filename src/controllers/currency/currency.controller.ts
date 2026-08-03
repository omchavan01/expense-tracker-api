import { Controller, Get } from '@nestjs/common';

import { CurrencyService } from 'src/providers/currency/currency.service';

@Controller('/metadata')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Get('/currencies')
  getCurrencies() {
    return this.currencyService.getCurrencies();
  }
}
