import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { User } from './User';
import { Item } from './Item';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column()
  createdAt: string

  @ManyToOne(() => User, user => user.orders, { onDelete: 'CASCADE' })
  user: User

  @ManyToOne(() => Item, item => item.orders, { onDelete: 'CASCADE' })
  item: Item
}