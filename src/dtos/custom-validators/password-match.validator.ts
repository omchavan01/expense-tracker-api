import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'PasswordsMatch', async: false })
export class PasswordsMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments): boolean {
    const { password } = args.object as { password?: string };
    return password === confirmPassword;
  }

  defaultMessage(): string {
    return 'Passwords do not match';
  }
}
