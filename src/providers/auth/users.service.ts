import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import otpGenerator from 'otp-generator';

import { Users } from 'src/entities/auth/users.entity';
import { Otps } from 'src/entities/auth/otps.entity';
import { MailService } from 'src/providers/mail/mail.service';
import { OtpRateLimitService } from './otp-rate-limit.service';
import { hashPassword } from 'src/utils/hash-password';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    @InjectRepository(Otps) private otpsRepository: Repository<Otps>,
    private readonly mailService: MailService,
    private readonly otpRateLimitService: OtpRateLimitService,
  ) {}

  async newUserSendOtp(email: string) {
    const user = await this.usersRepository.findOne({
      where: { authInfo: { email } },
    });
    // Check if user already exists
    if (user) throw new ConflictException('User already exists');

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    // Delete existing OTP
    await this.otpsRepository.delete({ email });

    if (!(await this.otpRateLimitService.rateLimit(email))) {
      throw new BadRequestException('Too many OTP requests. Try again later.');
    }

    // Send OTP to email
    const isSent = await this.mailService.sendOtp(email, otp);
    if (!isSent) throw new InternalServerErrorException('Failed to send OTP');

    // Save OTP to database
    await this.otpsRepository.save({
      email,
      otp,
      isVerified: false,
      expiresAt: new Date(Date.now() + 3 * 60 * 1000),
    });

    return {
      message: 'OTP sent successfully',
      result: [],
    };
  }

  async verifyOtp(email: string, otp: string) {
    const otpData = await this.otpsRepository.findOne({
      where: { otp: otp, email: email },
    });

    // Check if OTP exists
    if (!otpData) throw new NotFoundException('Invalid OTP');
    // Check if OTP is already verified
    if (otpData.isVerified) throw new ConflictException('OTP already verified');
    // Check if OTP is expired
    if (otpData.expiresAt < new Date())
      throw new UnauthorizedException('OTP expired');

    // Verify OTP
    await this.otpsRepository.update(otpData.id, { isVerified: true });
    return {
      message: 'OTP verified successfully',
      result: [],
    };
  }

  async resendOtp(email: string) {
    const otpData = await this.otpsRepository.findOne({
      where: { email: email },
    });

    // Check if OTP exists
    if (otpData && otpData.expiresAt > new Date())
      throw new ConflictException('OTP already exists and is not expired');

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    // Delete existing OTP
    await this.otpsRepository.delete({ email });

    if (!(await this.otpRateLimitService.rateLimit(email))) {
      throw new BadRequestException('Too many OTP requests. Try again later.');
    }

    // Send OTP to email
    const isSent = await this.mailService.sendOtp(email, otp);
    if (!isSent) throw new InternalServerErrorException('Failed to send OTP');

    // Save OTP to database
    await this.otpsRepository.save({
      email,
      otp,
      isVerified: false,
      expiresAt: new Date(Date.now() + 3 * 60 * 1000),
    });

    return {
      message: 'OTP resend successfully',
      result: [],
    };
  }

  async createUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: { authInfo: { email } },
    });

    // Check if user already exists
    if (user) throw new ConflictException('User already exists');

    //Hash password
    const hashedPassword = await hashPassword(password);
    await this.usersRepository.save({
      authInfo: { email, password: hashedPassword },
    });

    return {
      message: 'User created successfully',
      result: [],
    };
  }
}
