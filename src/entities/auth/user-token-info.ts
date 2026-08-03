import { Column } from 'typeorm';

export abstract class UserTokenInfo {
  @Column({ type: 'varchar', nullable: true })
  refreshToken: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  refreshTokenExpiresAt: Date | null;
}
