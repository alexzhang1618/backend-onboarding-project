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

  @ManyToOne(() => User, user => user.orders)
  user: User

  @ManyToOne(() => Item, item => item.orders)
  item: Item
}