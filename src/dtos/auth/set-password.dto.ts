import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from 'class-validator';
import { PasswordsMatchConstraint } from '../custom-validators/password-match.validator';

export class SetPasswordDto {
  @IsEmail(undefined, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(16, { message: 'Password must be less than 16 characters' })
  @Matches(/[A-Z]/, { message: 'Password must contain an uppercase letter' })
  @Matches(/[a-z]/, { message: 'Password must contain a lowercase letter' })
  @Matches(/\d/, { message: 'Password must contain a number' })
  @Matches(/[@$!%*?&]/, {
    message: 'Password must include a special character',
  })
  password: string;

  @IsNotEmpty({ message: 'Confirm password is required' })
  @Validate(PasswordsMatchConstraint)
  confirmPassword: string;
}
