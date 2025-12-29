import { Column } from 'typeorm';

export abstract class UserTokenInfo {
  @Column({ nullable: true })
  accessToken: string;

  @Column({ nullable: true })
  accessTokenExpiresAt: Date;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ nullable: true })
  refreshTokenExpiresAt: Date;
}
