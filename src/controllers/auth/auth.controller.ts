import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { OtpService } from 'src/providers/auth/otp.service';
import { AuthService } from 'src/providers/auth/auth.service';
import { NewUserSendOtpDto } from 'src/dtos/auth/send-otp-email.dto';
import { VerifyOtpDto } from 'src/dtos/auth/verify-otp.dto';
import { SetPasswordDto } from 'src/dtos/auth/set-password.dto';
import { LoginDto } from 'src/dtos/auth/login.dto';
import { AuthJwtGuard } from 'src/guards/auth-jwt.guard';
import { GetUser } from 'src/decorators/get-user.decorator';
import type { AuthenticatedUser } from 'src/utils/types';

@Controller('/auth')
export class AuthController {
  constructor(
    private otpService: OtpService,
    private authService: AuthService,
  ) {}

  @Post('/new-user/send-otp')
  newUserSendOtp(@Body() dto: NewUserSendOtpDto) {
    return this.otpService.newUserSendOtp(dto.email);
  }

  // Using same dto as new user send otp to avoid code duplication
  @Post('/reset-password/send-otp')
  resetPasswordSendOtp(@Body() dto: NewUserSendOtpDto) {
    return this.otpService.resetPasswordSendOtp(dto.email);
  }

  @Post('/verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.otpService.verifyOtp(dto.email, dto.otp);
  }

  @Post('/resend-otp')
  resendOtp(@Body() dto: NewUserSendOtpDto) {
    return this.otpService.resendOtp(dto.email);
  }

  @Post('/set-password')
  setPassword(@Body() dto: SetPasswordDto) {
    return this.authService.setPassword({
      email: dto.email,
      password: dto.password,
    });
  }

  // Using same dto as set password to avoid code duplication
  @Post('/reset-password')
  resetPassword(@Body() dto: SetPasswordDto) {
    return this.authService.resetPassword({
      email: dto.email,
      password: dto.password,
    });
  }

  @Post('/login')
  login(@Body() dto: LoginDto) {
    return this.authService.login({ email: dto.email, password: dto.password });
  }

  @UseGuards(AuthJwtGuard)
  @Post('/logout')
  logout(@GetUser() user: AuthenticatedUser) {
    return this.authService.logout(user.id);
  }

  @Post('/refresh-token')
  refreshToken(@Body() dto: { refreshToken: string }) {
    return this.authService.refreshToken(dto.refreshToken);
  }
}
