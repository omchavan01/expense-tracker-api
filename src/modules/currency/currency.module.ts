import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Currency } from 'src/entities/common/currency.entity';
import { CurrencyService } from 'src/providers/currency/currency.service';
import { CurrencyController } from 'src/controllers/currency/currency.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  providers: [CurrencyService],
  controllers: [CurrencyController],
})
export class CurrencyModule {}
