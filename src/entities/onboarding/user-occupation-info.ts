import { Column } from 'typeorm';

import { IncomeCycleEnum } from 'src/utils/enums/income-cycle-enum';

export abstract class UserOccupationInfo {
  @Column({ type: 'varchar', nullable: true })
  jobTitle: string | null;

  @Column({ type: 'varchar', nullable: true })
  companyName: string | null;

  @Column({ type: 'varchar', nullable: true })
  country: string | null;

  @Column({ type: 'enum', enum: IncomeCycleEnum, nullable: true })
  incomeCycle: IncomeCycleEnum | null;

  @Column({ type: 'int', nullable: true })
  income: number | null;
}
