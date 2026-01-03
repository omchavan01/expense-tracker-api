import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from 'src/entities/auth/users.entity';
import { OnboardingController } from 'src/controllers/onboarding/onboarding.controller';
import { OnboardingService } from 'src/providers/onboarding/onboarding.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
