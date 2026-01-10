import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'DateOfBirth', async: false })
export class DateOfBirthConstraint implements ValidatorConstraintInterface {
  validate(dateOfBirth: Date, args: ValidationArguments): boolean {
    if (!(dateOfBirth instanceof Date) || isNaN(dateOfBirth.getTime())) {
      return false;
    }
    const dateOfBirthUTC = new Date(
      Date.UTC(
        dateOfBirth.getUTCFullYear(),
        dateOfBirth.getUTCMonth(),
        dateOfBirth.getUTCDate(),
      ),
    );
    const todayUTC = new Date(
      Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
      ),
    );

    const minDateOfBirthUTC = new Date(
      Date.UTC(
        todayUTC.getUTCFullYear() - 120,
        todayUTC.getUTCMonth(),
        todayUTC.getUTCDate() + 1,
      ),
    );
    const maxDateOfBirthUTC = new Date(
      Date.UTC(
        todayUTC.getUTCFullYear() - 13,
        todayUTC.getUTCMonth(),
        todayUTC.getUTCDate() - 1,
      ),
    );
    if (dateOfBirthUTC < minDateOfBirthUTC) {
      args.constraints[0] = 'TOO_OLD';
      return false;
    }

    if (dateOfBirthUTC > maxDateOfBirthUTC) {
      args.constraints[0] = 'TOO_YOUNG';
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    const reason = args.constraints[0] as 'TOO_YOUNG' | 'TOO_OLD';

    switch (reason) {
      case 'TOO_YOUNG':
        return 'You must be at least 13 years old to continue';
      case 'TOO_OLD':
        return 'Please enter a valid date of birth';
      default:
        return 'Please enter a valid date of birth';
    }
  }
}
