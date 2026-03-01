import { Column } from 'typeorm';

export abstract class UserBasicInfo {
  @Column({ type: 'varchar', nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  currentBalance: string | null;
}
