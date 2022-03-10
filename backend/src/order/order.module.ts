import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from 'src/entities/order.entity'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { UserModule } from 'src/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UserModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
