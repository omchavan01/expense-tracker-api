import { Column } from 'typeorm';

export abstract class UserAuthInfo {
  @Column({ type: 'varchar', nullable: false, unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  password: string;
}
