import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Currency } from 'src/entities/common/currency.entity';
import { RestCountryCurrencyResponse } from 'src/utils/types';

@Injectable()
export class CurrencyService implements OnModuleInit {
  async onModuleInit() {
    try {
      const currenciesCount = await this.currencyRepository.count();
      if (currenciesCount === 0) await this.fetchAndSaveCurrencies();
    } catch (error) {
      console.error('Error fetching and saving currencies:', error);
    }
  }
  constructor(
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async fetchAndSaveCurrencies() {
    try {
      const response = await fetch(
        'https://restcountries.com/v3.1/all?fields=currencies',
      );
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = (await response.json()) as RestCountryCurrencyResponse[];

      const currencyMap = new Map<
        string,
        { code: string; name: string; symbol: string }
      >();

      data.forEach((item: RestCountryCurrencyResponse) => {
        if (!item.currencies) return;

        Object.entries(item.currencies).forEach(([code, details]) => {
          if (!currencyMap.has(code)) {
            currencyMap.set(code, {
              code: code.toUpperCase(),
              name: details.name ?? '',
              symbol: details.symbol ?? '',
            });
          }
        });
      });

      await this.currencyRepository.upsert(Array.from(currencyMap.values()), [
        'code',
      ]);
    } catch (error) {
      console.error('Error fetching and saving currencies:', error);
    }
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
