import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn() // 自动生成id
  id: number

  @Column()
  userId: number

  @Column()
  categoryId: number

  @Column()
  commodityId: number

  @Column()
  receivingId: number

  @Column()
  orderTime: string

  @Column({ default: 0 })
  orderType: number

  @Column({ default: 0 })
  delFlag: number
}