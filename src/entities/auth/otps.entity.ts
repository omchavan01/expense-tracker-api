import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email'])
export class Otps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  otp: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column()
  expiresAt: Date;
}
