import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from 'src/entities/auth/users.entity';
import { UserBasicInfo } from 'src/entities/auth/user-basic-info';
import { UserOccupationInfo } from 'src/entities/auth/user-occupation-info';

@Injectable()
export class OnboardingService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
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
      isOnboardingCompleted: true,
    });

    return {
      message: 'Occupation Info completed successfully',
      result: {
        onboardingStep: updatedUser?.onboardingStep,
        isOnboardingCompleted: updatedUser?.isOnboardingCompleted,
      },
    };
  }
}
