import { IsEmail, IsNotEmpty } from 'class-validator';

export class NewUserSendOtpDto {
  @IsEmail(undefined, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
