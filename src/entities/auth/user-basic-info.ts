import { Column } from 'typeorm';

import { GenderEnum } from 'src/utils/enums/gender-enum';

export abstract class UserBasicInfo {
  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  age?: number;

  @Column({ enum: GenderEnum, nullable: true })
  gender?: GenderEnum;
}
