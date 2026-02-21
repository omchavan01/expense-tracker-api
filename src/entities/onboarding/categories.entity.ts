import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Users } from '../auth/users.entity';

@Entity()
@Unique(['title', 'user'])
export class Categories {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  value: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @ManyToOne(() => Users, (user) => user.categories, {
    onDelete: 'CASCADE',
  })
  user: Users;
}
