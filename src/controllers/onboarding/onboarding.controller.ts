import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { OnboardingService } from 'src/providers/onboarding/onboarding.service';
import { OnboardingBasicInfoDto } from 'src/dtos/onboarding/basic-info.dto';
import { OnboardingCategoriesInfoDto } from 'src/dtos/onboarding/categories-info.dto';
import { AuthJwtGuard } from 'src/guards/auth-jwt.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import type { AuthenticatedUser } from 'src/utils/types';

@Controller('/onboarding')
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @UseGuards(AuthJwtGuard)
  @Post('/basic-info')
  completeBasicInfo(
    @Body() dto: OnboardingBasicInfoDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.onboardingService.completeBasicInfo(user.id, dto.basicInfo);
  }

  @UseGuards(AuthJwtGuard)
  @Post('/categories-info')
  completeCategoriesInfo(
    @Body() dto: OnboardingCategoriesInfoDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.onboardingService.completeCategoriesInfo(
      user.id,
      dto.categoriesInfo,
    );
  }
}
