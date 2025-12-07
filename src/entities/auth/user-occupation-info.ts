import { Column } from 'typeorm';

import { IncomeCycleEnum } from 'src/utils/enums/income-cycle-enum';

export abstract class UserOccupationInfo {
  @Column({ nullable: true })
  jobTitle?: string;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: true })
  region?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ enum: IncomeCycleEnum, nullable: true })
  incomeCycle?: IncomeCycleEnum;

  @Column({ nullable: true })
  income?: number;
}
