import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from 'src/entities/auth/users.entity';
import { Categories } from 'src/entities/onboarding/categories.entity';
import { BasicInfo } from 'src/dtos/onboarding/basic-info.dto';
import { CategoryInfo } from 'src/dtos/onboarding/categories-info.dto';
import { CategoryTypeEnum } from 'src/utils/enums/category-type-enum';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Categories)
    private readonly categoriesRepository: Repository<Categories>,
  ) {}

  async completeBasicInfo(userId: number, basicInfo: BasicInfo) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('User does not exist');
    if (user.onboardingStep !== 0)
      throw new BadRequestException('Basic Info already completed');

    const updatedUser = await this.usersRepository.save({
      ...user,
      basicInfo: {
        firstName: basicInfo.firstName,
        lastName: basicInfo.lastName,
        currentBalance: basicInfo.currentBalance,
      },
      currencyCode: basicInfo.currencyCode,
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

  async completeCategoriesInfo(userId: number, categoriesInfo: CategoryInfo[]) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User does not exist');
    if (user.onboardingStep !== 1)
      throw new BadRequestException('Categories Info already completed');

    const expenseCategories = categoriesInfo.filter(
      (category) => category.categoryType === CategoryTypeEnum.EXPENSE,
    );
    const incomeCategories = categoriesInfo.filter(
      (category) => category.categoryType === CategoryTypeEnum.INCOME,
    );

    if (expenseCategories.length < 5)
      throw new BadRequestException(
        'Minimum 5 expense categories are required',
      );
    if (incomeCategories.length < 1)
      throw new BadRequestException('Minimum 1 income category is required');

    if (expenseCategories.length > 15)
      throw new BadRequestException(
        'Maximum 15 expense categories are allowed',
      );
    if (incomeCategories.length > 5)
      throw new BadRequestException('Maximum 5 income categories are allowed');

    const categoriesEntities = categoriesInfo.map((category) =>
      this.categoriesRepository.create({
        ...category,
        user,
      }),
    );

    await this.categoriesRepository.save(categoriesEntities);

    const updatedUser = await this.usersRepository.save({
      ...user,
      onboardingStep: 2,
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
