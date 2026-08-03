import { Controller, Get, UseGuards } from '@nestjs/common';

import { AuthJwtGuard } from 'src/guards/auth-jwt.guard';
import { UsersService } from 'src/providers/users/users.service';
import { GetUser } from 'src/decorators/get-user.decorator';
import type { AuthenticatedUser } from 'src/utils/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthJwtGuard)
  @Get('/info')
  getUserInfo(@GetUser() user: AuthenticatedUser) {
    return this.usersService.getUserInfo(user.id);
  }
}
