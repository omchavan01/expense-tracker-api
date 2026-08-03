import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailModule } from 'src/modules/mail/mail.module';
import { JWTTokenModule } from '../jwt/jwt-token.module';
import { Users } from 'src/entities/auth/users.entity';
import { Otps } from 'src/entities/auth/otps.entity';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { OtpService } from 'src/providers/auth/otp.service';
import { AuthService } from 'src/providers/auth/auth.service';
import { OtpRateLimitService } from 'src/providers/auth/otp-rate-limit.service';
import { AuthTokenService } from 'src/providers/auth/auth-token.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Otps]),
    MailModule,
    JWTTokenModule,
  ],
  controllers: [AuthController],
  providers: [
    OtpService,
    OtpRateLimitService,
    AuthService,
    AuthTokenService,
    JwtStrategy,
  ],
})
export class AuthModule {}
