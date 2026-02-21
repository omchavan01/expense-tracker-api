import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { UserAuthInfo } from './user-auth-info';
import { UserBasicInfo } from '../onboarding/user-basic-info';
import { UserOccupationInfo } from '../onboarding/user-occupation-info';
import { UserTokenInfo } from './user-token-info';
import { Categories } from '../onboarding/categories.entity';

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

  @OneToMany(() => Categories, (category) => category.user)
  categories: Categories[];

  @Column(() => UserTokenInfo)
  tokenInfo: UserTokenInfo;

  @Column({ default: 0 })
  onboardingStep: number;

  @Column({ default: false })
  isOnboardingCompleted: boolean;
}
