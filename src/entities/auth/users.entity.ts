import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { UserAuthInfo } from './user-auth-info';
import { UserBasicInfo } from './user-basic-info';
import { UserOccupationInfo } from './user-occupation-info';
import { UserTokenInfo } from './user-token-info';

@Entity()
@Unique(['authInfo.email'])
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => UserAuthInfo)
  authInfo: UserAuthInfo;

  @Column(() => UserBasicInfo)
  basicInfo: UserBasicInfo;

  @Column(() => UserOccupationInfo)
  occupationInfo: UserOccupationInfo;

  @Column(() => UserTokenInfo)
  tokenInfo: UserTokenInfo;

  @Column({ default: 0 })
  onboardingStep: number;

  @Column({ default: false })
  isOnboardingCompleted: boolean;
}
