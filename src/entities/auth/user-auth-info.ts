import { Column } from 'typeorm';

export abstract class UserAuthInfo {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
