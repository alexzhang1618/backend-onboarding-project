import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { User } from './User';
import { Item } from './Item';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column()
  createdAt: string

  @ManyToOne(() => User, user => user.orders, { cascade: true })
  user: User

  @ManyToOne(() => Item, item => item.orders, { cascade: true })
  item: Item
}