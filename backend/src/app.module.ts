import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { Category } from './entities/category.entity'
import { UserModule } from './user/user.module'
import { CategoryModule } from './category/category.module'

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
      entities: [User, Category],
      synchronize: true
    }),
    UserModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
