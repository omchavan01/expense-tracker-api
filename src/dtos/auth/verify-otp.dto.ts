import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class VerifyOtpDto {
  @IsEmail(undefined, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'OTP is required' })
  @Length(4, 4, { message: 'OTP must be 4 digits' })
  otp: string;
}
