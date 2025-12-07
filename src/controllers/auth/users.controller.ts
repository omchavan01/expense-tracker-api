import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from 'src/providers/auth/users.service';
import { NewUserSendOtpDto } from 'src/dtos/auth/send-otp-email.dto';
import { VerifyOtpDto } from 'src/dtos/auth/verify-otp.dto';
import { CreateUserDto } from 'src/dtos/auth/create-user.dto';

@Controller('/auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/send-otp')
  newUserSendOtp(@Body() dto: NewUserSendOtpDto) {
    return this.usersService.newUserSendOtp(dto.email);
  }

  @Post('/verify-otp')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.usersService.verifyOtp(dto.email, dto.otp);
  }

  @Post('/resend-otp')
  resendOtp(@Body() dto: NewUserSendOtpDto) {
    return this.usersService.resendOtp(dto.email);
  }

  @Post('/create-user')
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto.email, dto.password);
  }
}
