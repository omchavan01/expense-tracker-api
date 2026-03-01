import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthTokenService } from './auth-token.service';
import { Users } from 'src/entities/auth/users.entity';
import { UserAuthInfo } from 'src/entities/auth/user-auth-info';
import { comparePassword, hashPassword } from 'src/utils/hash-password';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    private readonly authTokenService: AuthTokenService,
  ) {}

  async setPassword(payload: UserAuthInfo) {
    const existingUser = await this.usersRepository.findOne({
      where: { authInfo: { email: payload.email } },
    });

    // Check if user already exists
    if (existingUser) throw new ConflictException('User already exists');

    //Hash password
    const hashedPassword = await hashPassword(payload.password);
    // Create new user
    const newUser = await this.usersRepository.save({
      authInfo: {
        email: payload.email.toLowerCase(),
        password: hashedPassword,
      },
      onboardingStep: 0,
      isOnboardingCompleted: false,
    });

    // Generate tokens
    const tokens = await this.authTokenService.generateTokens(newUser);

    return {
      message: 'User created successfully',
      result: {
        ...tokens,
        userId: newUser.id,
        onboardingStep: newUser.onboardingStep,
      },
    };
  }

  async resetPassword(payload: UserAuthInfo) {
    const existingUser = await this.usersRepository.findOne({
      where: { authInfo: { email: payload.email } },
    });

    // Check if user already exists
    if (!existingUser) throw new NotFoundException('User not found');

    //Hash password
    const hashedPassword = await hashPassword(payload.password);

    // Update password
    await this.usersRepository.update(existingUser.id, {
      authInfo: {
        password: hashedPassword,
      },
    });

    return {
      message: 'Password reset successfully',
      result: [],
    };
  }

  async login(payload: UserAuthInfo) {
    const user = await this.usersRepository.findOne({
      where: { authInfo: { email: payload.email } },
    });

    const comparedPassword = await comparePassword(
      payload.password,
      user?.authInfo?.password ?? '',
    );

    // Check if user exists and password is correct
    if (!user || !comparedPassword)
      throw new UnauthorizedException('Invalid credentials');

    // Generate tokens
    const tokens = await this.authTokenService.generateTokens(user);

    return {
      message: 'User logged in successfully',
      result: {
        ...tokens,
        userId: user.id,
        onboardingStep: user.onboardingStep,
        isOnboardingCompleted: user.isOnboardingCompleted,
      },
    };
  }
}
