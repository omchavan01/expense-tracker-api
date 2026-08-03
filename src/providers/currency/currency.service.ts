import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Currency } from 'src/entities/common/currency.entity';
import { CURRENCIES } from 'src/utils/data/currencies';

@Injectable()
export class CurrencyService implements OnModuleInit {
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async onModuleInit() {
    try {
      const currenciesCount = await this.currencyRepository.count();
      if (currenciesCount === 0) await this.seedCurrencies();
    } catch (error) {
      console.error('Error seeding currencies:', error);
    }
  }

  async seedCurrencies() {
    await this.currencyRepository.upsert(CURRENCIES, ['code']);
  }

  async getCurrencies() {
    const currencies = await this.currencyRepository.find({
      order: { code: 'ASC' },
    });

    const formatCurrencyName = (name: string) => {
      return name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const formattedCurrencies = currencies.map((currency) => ({
      code: currency.code,
      name: `${currency.code} - ${formatCurrencyName(currency.name)}`,
    }));
    return {
      message: 'Currencies fetched successfully',
      result: formattedCurrencies ?? [],
    };
  }
}
