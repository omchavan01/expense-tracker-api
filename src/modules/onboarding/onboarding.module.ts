import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Users } from 'src/entities/auth/users.entity';
import { Categories } from 'src/entities/onboarding/categories.entity';
import { OnboardingController } from 'src/controllers/onboarding/onboarding.controller';
import { OnboardingService } from 'src/providers/onboarding/onboarding.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Categories])],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}
