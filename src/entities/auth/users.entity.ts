import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { UserAuthInfo } from './user-auth-info';
import { UserBasicInfo } from './user-basic-info';
import { UserOccupationInfo } from './user-occupation-info';

@Entity()
@Unique(['authInfo.email'])
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => UserAuthInfo)
  authInfo: UserAuthInfo;

  @Column(() => UserBasicInfo)
  basicInfo?: UserBasicInfo;

  @Column(() => UserOccupationInfo)
  occupationInfo?: UserOccupationInfo;

  @Column({ default: 0, nullable: true })
  onboardingStep?: number;

  @Column({ default: false, nullable: true })
  isOnboardingCompleted?: boolean;
}
