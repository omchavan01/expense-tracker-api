import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  ValidateNested,
  IsDefined,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';

export class CategoryInfo {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Value is required' })
  value: string;

  @IsBoolean()
  @IsDefined({ message: 'Is active is required' })
  active: boolean;
}

export class OnboardingCategoriesInfoDto {
  @IsArray()
  @ArrayMinSize(5, { message: 'Minimum 5 categories are required' })
  @ArrayMaxSize(15, { message: 'Maximum 15 categories are allowed' })
  @ValidateNested({ each: true })
  @Type(() => CategoryInfo)
  categoriesInfo: CategoryInfo[];
}
