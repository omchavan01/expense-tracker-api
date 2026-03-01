import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Users } from '../auth/users.entity';
import { CategoryTypeEnum } from 'src/utils/enums/category-type-enum';

@Entity()
@Unique(['title', 'userId'])
@Index(['userId'])
@Index(['userId', 'categoryType'])
export class Categories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  title: string;

  @Column({ type: 'varchar', nullable: false, length: 255 })
  value: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'enum', enum: CategoryTypeEnum, nullable: false })
  categoryType: CategoryTypeEnum;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => Users, (user) => user.categoriesInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: Users;
}
