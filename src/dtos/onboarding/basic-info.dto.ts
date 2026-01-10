import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsDate,
  ValidateNested,
  Validate,
} from 'class-validator';

import { GenderEnum } from 'src/utils/enums/gender-enum';
import { DateOfBirthConstraint } from '../custom-validators/date-of-birth.validator';

class BasicInfo {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  lastName: string;

  @Type(() => Date)
  @IsDate({ message: 'Date of birth must be a valid date' })
  @IsNotEmpty({ message: 'Date of birth is required' })
  @Validate(DateOfBirthConstraint)
  dateOfBirth: Date;

  @IsEnum(GenderEnum)
  @IsNotEmpty({ message: 'Gender is required' })
  gender: GenderEnum;
}

export class OnboardingBasicInfoDto {
  @IsNotEmpty({ message: 'Basic info is required' })
  @ValidateNested()
  @Type(() => BasicInfo)
  basicInfo: BasicInfo;
}
