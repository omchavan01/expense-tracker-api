import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { GenderEnum } from 'src/utils/enums/gender-enum';

class BasicInfo {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  lastName: string;

  @IsInt()
  @IsNotEmpty({ message: 'Age is required' })
  @Min(13, { message: 'You must be at least 13 years old' })
  @Max(120, { message: 'Please enter a valid age' })
  age: number;

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
