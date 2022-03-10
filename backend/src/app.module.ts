import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Category } from './entities/category.entity'
import { Commodity } from './entities/commodity.entity'
import { Order } from './entities/order.entity'
import { UserModule } from './user/user.module'
import { CategoryModule } from './category/category.module'
import { CommodityModule } from './commodity/commodity.module'
import { OrderModule } from './order/order.module'

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
      entities: [User, Category, Commodity, Order],
      synchronize: true
    }),
    UserModule,
    CategoryModule,
    CommodityModule,
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
