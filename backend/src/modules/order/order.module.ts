import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Order } from 'src/entities/order.entity'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'
import { UserModule } from 'src/modules/user/user.module'
import { OrderDetailModule } from 'src/modules/order-detail/order-detail.module'

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UserModule, OrderDetailModule],
  controllers: [OrderController],
  providers: [OrderService]
})
export class OrderModule {}
