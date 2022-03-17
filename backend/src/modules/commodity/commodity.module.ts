import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Commodity } from 'src/entities/commodity.entity'
import { CommodityController } from './commodity.controller'
import { CommodityService } from './commodity.service'
import { UserModule } from 'src/modules/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Commodity]), UserModule],
  controllers: [CommodityController],
  providers: [CommodityService]
})
export class CommodityModule {}
