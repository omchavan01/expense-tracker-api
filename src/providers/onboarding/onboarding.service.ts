import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from 'src/entities/auth/users.entity';
import { UserBasicInfo } from 'src/entities/onboarding/user-basic-info';
import { UserOccupationInfo } from 'src/entities/onboarding/user-occupation-info';
import { Categories } from 'src/entities/onboarding/categories.entity';
import { CategoryInfo } from 'src/dtos/onboarding/categories-info.dto';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async completeBasicInfo(userId: number, basicInfo: UserBasicInfo) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User does not exist');
    if (user.onboardingStep !== 0)
      throw new BadRequestException('Basic Info already completed');

    const updatedUser = await this.usersRepository.save({
      ...user,
      basicInfo,
      onboardingStep: 1,
    });

    return {
      message: 'Basic Info completed successfully',
      result: {
        onboardingStep: updatedUser?.onboardingStep,
        isOnboardingCompleted: updatedUser?.isOnboardingCompleted,
      },
    };
  }

  async completeOccupationInfo(
    userId: number,
    occupationInfo: UserOccupationInfo,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User does not exist');
    if (user.onboardingStep !== 1)
      throw new BadRequestException('Occupation Info already completed');

    const updatedUser = await this.usersRepository.save({
      ...user,
      occupationInfo,
      onboardingStep: 2,
      isOnboardingCompleted: false,
    });

    return {
      message: 'Occupation Info completed successfully',
      result: {
        onboardingStep: updatedUser?.onboardingStep,
        isOnboardingCompleted: updatedUser?.isOnboardingCompleted,
      },
    };
  }

  async completeCategoriesInfo(userId: number, categoriesInfo: CategoryInfo[]) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User does not exist');
    if (user.onboardingStep !== 2)
      throw new BadRequestException('Categories Info already completed');

    if (categoriesInfo.length < 5)
      throw new BadRequestException('Minimum 5 categories are required');

    if (categoriesInfo.length > 15)
      throw new BadRequestException('Maximum 15 categories are allowed');

    const categoriesEntities = categoriesInfo.map((category) =>
      this.categoriesRepository.create({
        ...category,
        user,
      }),
    );

    await this.categoriesRepository.save(categoriesEntities);

    const updatedUser = await this.usersRepository.save({
      ...user,
      onboardingStep: 3,
      isOnboardingCompleted: true,
    });

    return {
      message: 'Categories Info completed successfully',
      result: {
        onboardingStep: updatedUser?.onboardingStep,
        isOnboardingCompleted: updatedUser?.isOnboardingCompleted,
      },
    };
  }
}
