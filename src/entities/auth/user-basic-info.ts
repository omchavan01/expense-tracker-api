import { Column } from 'typeorm';

import { GenderEnum } from 'src/utils/enums/gender-enum';

export abstract class UserBasicInfo {
  @Column({ type: 'varchar', nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date | null;

  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  gender: GenderEnum | null;
}
