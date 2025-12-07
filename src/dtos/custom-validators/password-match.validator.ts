import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'PasswordsMatch', async: false })
export class PasswordsMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments): boolean {
    const obj = args.object as unknown;
    if (!obj || typeof obj !== 'object' || !('password' in obj)) {
      return false;
    }
    return obj.password === confirmPassword;
  }

  defaultMessage(): string {
    return 'Passwords do not match';
  }
}
