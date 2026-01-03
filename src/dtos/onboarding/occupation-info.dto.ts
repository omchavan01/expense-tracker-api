import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { IncomeCycleEnum } from 'src/utils/enums/income-cycle-enum';

class OccupationInfo {
  @IsString()
  @IsNotEmpty({ message: 'Job title is required' })
  jobTitle: string;

  @IsString()
  @IsNotEmpty({ message: 'Company name is required' })
  companyName: string;

  @IsString()
  @IsNotEmpty({ message: 'Country is required' })
  country: string;

  @IsEnum(IncomeCycleEnum)
  @IsNotEmpty({ message: 'Income cycle is required' })
  incomeCycle: IncomeCycleEnum;

  @IsInt()
  @IsNotEmpty({ message: 'Income is required' })
  @Min(1, { message: 'Income must be at least 1' })
  income: number;
}

export class OnboardingOccupationInfoDto {
  @IsNotEmpty({ message: 'Occupation info is required' })
  @ValidateNested()
  @Type(() => OccupationInfo)
  occupationInfo: OccupationInfo;
}
