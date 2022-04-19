import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Commodity extends BaseEntity {
  @PrimaryGeneratedColumn() // 自动生成id
  id: number

  @Column()
  name: string

  @Column()
  categoryId: number

  @Column({ type: 'double' })
  price: number

  @Column()
  author: string

  @Column({ default: null })
  press: string

  @Column({ type: 'datetime', default: null })
  publicationTime: string

  @Column({ default: null })
  words: number

  @Column({ default: null })
  introduce: string

  @Column({ default: null })
  imgUrl: string

  @Column({ default: 0 })
  delFlag: number
}
