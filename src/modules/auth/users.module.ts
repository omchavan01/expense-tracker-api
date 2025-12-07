import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from 'src/modules/mail/mail.module';
import { Users } from 'src/entities/auth/users.entity';
import { Otps } from 'src/entities/auth/otps.entity';
import { UsersController } from 'src/controllers/auth/users.controller';
import { UsersService } from 'src/providers/auth/users.service';
import { OtpRateLimitService } from 'src/providers/auth/otp-rate-limit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Otps]), MailModule],
  controllers: [UsersController],
  providers: [UsersService, OtpRateLimitService],
})
export class UsersModule {}
