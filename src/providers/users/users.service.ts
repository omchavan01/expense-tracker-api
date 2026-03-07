import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Users } from 'src/entities/auth/users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async getUserInfo(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: {
        currency: true,
        categoriesInfo: true,
      },
    });

    if (!user) throw new NotFoundException('User does not exist');

    const payload = {
      email: user.authInfo.email,
      firstName: user.basicInfo.firstName,
      lastName: user.basicInfo.lastName,
      currency: {
        code: user.currency?.code,
        name: user.currency?.name,
        symbol: user.currency?.symbol,
      },
      currentBalance: user.basicInfo.currentBalance,
      categories: user.categoriesInfo
        .filter((category) => category.active)
        .map((category) => ({
          id: category.id,
          title: category.title,
          value: category.value,
          categoryType: category.categoryType,
        })),
    };

    return {
      message: 'User fetched successfully',
      result: {
        user: payload,
      },
    };
  }
}
