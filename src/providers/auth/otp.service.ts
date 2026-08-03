import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { randomInt } from 'crypto';

import { Users } from 'src/entities/auth/users.entity';
import { Otps } from 'src/entities/auth/otps.entity';
import { OtpRateLimitService } from './otp-rate-limit.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Otps) private readonly otpsRepository: Repository<Otps>,
    private readonly otpRateLimitService: OtpRateLimitService,
    private readonly mailService: MailService,
  ) {}

  async newUserSendOtp(email: string) {
    const user = await this.usersRepository.findOne({
      where: { authInfo: { email } },
    });
    // Check if user already exists
    if (user) throw new ConflictException('User already exists');

    // Generate OTP
    const otp = randomInt(1000, 10000).toString();

    if (!(await this.otpRateLimitService.rateLimit(email))) {
      throw new BadRequestException('Too many OTP requests. Try again later.');
    }

    // Update or Insert OTP to database
    await this.otpsRepository.upsert(
      {
        email,
        otp,
        isVerified: false,
        expiresAt: new Date(Date.now() + 3 * 60 * 1000),
      },
      ['email'],
    );

    // Send OTP to email and catch error
    try {
      await this.mailService.sendOtp(email, otp);
    } catch (error) {
      if (error) throw new InternalServerErrorException('Failed to send OTP');
    }

    return {
      message: 'OTP sent successfully',
      result: [],
    };
  }

  async resetPasswordSendOtp(email: string) {
    const user = await this.usersRepository.findOne({
      where: { authInfo: { email } },
    });

    // Check if user exists
    if (!user) throw new NotFoundException('User not found');

    // Generate OTP
    const otp = randomInt(1000, 10000).toString();

    if (!(await this.otpRateLimitService.rateLimit(email))) {
      throw new BadRequestException('Too many OTP requests. Try again later.');
    }

    // Update or Insert OTP to database
    await this.otpsRepository.upsert(
      {
        email,
        otp,
        isVerified: false,
        expiresAt: new Date(Date.now() + 3 * 60 * 1000),
      },
      ['email'],
    );

    // Send OTP to email and catch error
    try {
      await this.mailService.sendOtp(email, otp);
    } catch (error) {
      if (error) throw new InternalServerErrorException('Failed to send OTP');
    }

    return {
      message: 'OTP sent successfully',
      result: [],
    };
  }

  async verifyOtp(email: string, otp: string) {
    const otpData = await this.otpsRepository.findOne({
      where: {
        otp: otp,
        email: email,
        isVerified: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    // Check if OTP does not exist
    if (!otpData)
      throw new NotFoundException('You have entered an invalid OTP');

    // Verify OTP
    await this.otpsRepository.update(otpData.id, { isVerified: true });
    return {
      message: 'OTP verified successfully',
      result: [],
    };
  }

  async resendOtp(email: string) {
    const otpData = await this.otpsRepository.findOne({
      where: {
        email: email,
        isVerified: false,
        expiresAt: MoreThan(new Date()),
      },
    });

    // Check if OTP exists
    if (otpData)
      throw new ConflictException('An OTP already exists for this email');

    // Generate OTP
    const otp = randomInt(1000, 10000).toString();

    if (!(await this.otpRateLimitService.rateLimit(email))) {
      throw new BadRequestException('Too many OTP requests. Try again later.');
    }

    // Update or Insert OTP to database
    await this.otpsRepository.upsert(
      {
        email,
        otp,
        isVerified: false,
        expiresAt: new Date(Date.now() + 3 * 60 * 1000),
      },
      ['email'],
    );

    // Send OTP to email and catch error
    try {
      await this.mailService.sendOtp(email, otp);
    } catch (error) {
      if (error) throw new InternalServerErrorException('Failed to send OTP');
    }

    return {
      message: 'OTP resent successfully',
      result: [],
    };
  }
}
