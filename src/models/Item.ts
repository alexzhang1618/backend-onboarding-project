import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { Order } from "./Order";
@Entity()
export class Item extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string

  @Column()
  name: string

  @Column()
  description: string

  @Column({ type: 'float' })
  price: number

  @Column()
  createdAt: string

  @OneToMany(() => Order, order => order.item)
  orders: Order[]
}