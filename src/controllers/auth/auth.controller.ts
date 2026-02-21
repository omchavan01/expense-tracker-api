import { Body, Controller, Post } from '@nestjs/common';

import { OtpService } from 'src/providers/auth/otp.service';
import { AuthService } from 'src/providers/auth/auth.service';
import { NewUserSendOtpDto } from 'src/dtos/auth/send-otp-email.dto';
import { VerifyOtpDto } from 'src/dtos/auth/verify-otp.dto';
import { SetPasswordDto } from 'src/dtos/auth/set-password.dto';
import { LoginDto } from 'src/dtos/auth/login.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private otpService: OtpService,
    private authService: AuthService,
  ) {}

  @Post('/send-otp')
  newUserSendOtp(@Body() dto: NewUserSendOtpDto) {
    return this.otpService.newUserSendOtp(dto.email);
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

  @Post('/login')
  login(@Body() dto: LoginDto) {
    return this.authService.login({ email: dto.email, password: dto.password });
  }
}
