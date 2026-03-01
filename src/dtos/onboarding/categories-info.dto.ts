import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  ValidateNested,
  IsDefined,
  IsArray,
  IsEnum,
  Validate,
} from 'class-validator';

import { CategoryLimitsValidator } from '../custom-validators/category-limits.validator';
import { CategoryTypeEnum } from 'src/utils/enums/category-type-enum';

export class CategoryInfo {
  @IsString()
  @IsNotEmpty({ message: 'Title is required' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Value is required' })
  value: string;

  @IsBoolean()
  @IsDefined({ message: 'status is required' })
  active: boolean;

  @IsEnum(CategoryTypeEnum)
  @IsNotEmpty({ message: 'Category type is required' })
  categoryType: CategoryTypeEnum;
}

export class OnboardingCategoriesInfoDto {
  @IsArray()
  @Validate(CategoryLimitsValidator)
  @ValidateNested({ each: true })
  @Type(() => CategoryInfo)
  categoriesInfo: CategoryInfo[];
}
