import { Column } from 'typeorm';

import { GenderEnum } from 'src/utils/enums/gender-enum';

export abstract class UserBasicInfo {
  @Column({ type: 'varchar', nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null;

  @Column({ type: 'int', nullable: true })
  age: number | null;

  @Column({ type: 'enum', enum: GenderEnum, nullable: true })
  gender: GenderEnum | null;
}
