import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserAuthInfo } from './user-auth-info';
import { UserBasicInfo } from '../onboarding/user-basic-info';
import { UserTokenInfo } from './user-token-info';
import { Categories } from '../onboarding/categories.entity';
import { Currency } from '../common/currency.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(() => UserAuthInfo)
  authInfo: UserAuthInfo;

  @Column(() => UserBasicInfo)
  basicInfo: UserBasicInfo;

  @Column({ type: 'varchar', nullable: true, length: 3 })
  currencyCode: string | null;

  @OneToMany(() => Categories, (category) => category.user)
  categoriesInfo: Categories[];

  @Column(() => UserTokenInfo)
  tokenInfo: UserTokenInfo;

  @Index()
  @ManyToOne(() => Currency, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'currencyCode', referencedColumnName: 'code' })
  currency: Currency | null;

  @Column({ default: 0 })
  onboardingStep: number;

  @Column({ default: false })
  isOnboardingCompleted: boolean;
}
