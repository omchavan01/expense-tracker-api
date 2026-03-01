import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { CategoryInfo } from 'src/dtos/onboarding/categories-info.dto';
import { CategoryTypeEnum } from 'src/utils/enums/category-type-enum';

const CATEGORY_LIMITS_CONFIG = {
  [CategoryTypeEnum.EXPENSE]: {
    minSelected: 5,
    maxSelected: 15,
    maxTotal: 30,
  },
  [CategoryTypeEnum.INCOME]: {
    minSelected: 1,
    maxSelected: 5,
    maxTotal: 10,
  },
};

@ValidatorConstraint({ name: 'CategoryLimits', async: false })
export class CategoryLimitsValidator implements ValidatorConstraintInterface {
  private errorMessage: string = 'Invalid category configuration';

  validate(categories: CategoryInfo[]): boolean {
    if (!categories || categories.length === 0) {
      this.errorMessage =
        'Categories are required and must contain expense and income categories.';
      return false;
    }
    const groupedCategories = categories.reduce(
      (group, category) => {
        if (!group[category.categoryType]) group[category.categoryType] = [];
        group[category.categoryType].push(category);
        return group;
      },
      {} as Record<CategoryTypeEnum, CategoryInfo[]>,
    );

    for (const type of Object.values(CategoryTypeEnum)) {
      const config = CATEGORY_LIMITS_CONFIG[type as CategoryTypeEnum];
      if (!config) {
        this.errorMessage = `Invalid category type: ${type}`;
        return false;
      }

      const typeName = type.charAt(0).toUpperCase() + type.slice(1);
      const typeCategories = groupedCategories[type as CategoryTypeEnum] ?? [];
      const uniqueValues = new Set(
        typeCategories.map((category) => category.value),
      );

      const totalCount = typeCategories.length;
      const selectedCount = typeCategories.filter(
        (category) => category.active,
      ).length;
      if (uniqueValues.size !== typeCategories.length) {
        this.errorMessage = `${typeName} categories must have unique values.`;
        return false;
      }
      if (selectedCount < config.minSelected) {
        this.errorMessage = `${typeName} requires at least ${config.minSelected} selected categories.`;
        return false;
      }
      if (selectedCount > config.maxSelected) {
        this.errorMessage = `${typeName} allows a maximum of ${config.maxSelected} selected categories.`;
        return false;
      }

      if (totalCount > config.maxTotal) {
        this.errorMessage = `${typeName} allows a maximum of ${config.maxTotal} total categories.`;
        return false;
      }
    }

    return true;
  }
  defaultMessage(): string {
    return this.errorMessage;
  }
}
