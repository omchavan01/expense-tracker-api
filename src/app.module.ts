import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production.local'
          : '.env.local',
    }),
    DatabaseModule,
    AuthModule,
    OnboardingModule,
    CurrencyModule,
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
