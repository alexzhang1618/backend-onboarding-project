import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { User } from './User';
import { Item } from './Item';

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column()
  name: string

  @Column()
  createdAt: string

  @ManyToOne(() => User, user => user.uuid)
  user_id: string

  @ManyToOne(() => Item, item => item.uuid)
  item_id: string
}