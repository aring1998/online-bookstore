import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Category } from './entities/category.entity'
import { Commodity } from './entities/commodity.entity'
import { Order } from './entities/order.entity'
import { Receiving } from './entities/receiving.entity'
import { OrderDetail } from './entities/order-detail.entity'
import { CategoryModule } from './modules/category/category.module'
import { UserModule } from './modules/user/user.module'
import { CommodityModule } from './modules/commodity/commodity.module'
import { OrderModule } from './modules/order/order.module'
import { ReceivingModule } from './modules/receiving/receiving.module'
import { OrderDetailModule } from './modules/order-detail/order-detail.module'

const dotenv = require('dotenv')
dotenv.config('./env')
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Category, Commodity, Order, OrderDetail, Receiving],
      synchronize: true
    }),
    UserModule,
    CategoryModule,
    CommodityModule,
    OrderModule,
    OrderDetailModule,
    ReceivingModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
