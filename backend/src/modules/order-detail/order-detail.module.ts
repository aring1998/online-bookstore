import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderDetail } from 'src/entities/order-detail.entity'
import { OrderDetailController } from './order-detail.controller'
import { OrderDetailService } from './order-detail.service'

@Module({
  imports: [TypeOrmModule.forFeature([OrderDetail])],
  controllers: [OrderDetailController],
  providers: [OrderDetailService],
  exports: [OrderDetailService]
})
export class OrderDetailModule {}
