import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class BasicInfo {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsNotEmpty({ message: 'Currency code is required' })
  currencyCode: string;

  @IsString({ message: 'Current balance must be a valid number' })
  @IsNotEmpty({ message: 'Current balance is required' })
  currentBalance: string;
}

export class OnboardingBasicInfoDto {
  @IsNotEmpty({ message: 'Basic info is required' })
  @ValidateNested()
  @Type(() => BasicInfo)
  basicInfo: BasicInfo;
}
