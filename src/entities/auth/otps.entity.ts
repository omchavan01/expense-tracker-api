import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Otps {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, unique: true, length: 255 })
  email: string;

  @Column({ type: 'varchar', nullable: false, length: 4 })
  otp: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', nullable: false })
  expiresAt: Date;
}
