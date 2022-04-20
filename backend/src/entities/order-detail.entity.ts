import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class OrderDetail extends BaseEntity {
  @PrimaryGeneratedColumn() // 自动生成id
  id: number

  @Column()
  orderId: number

  @Column()
  categoryId: number

  @Column()
  commodityId: number

  @Column()
  commodityNum: number

  @Column({ type: 'double' })
  commodityPrice: number

  @Column({ default: 0 })
  delFlag: number
}
