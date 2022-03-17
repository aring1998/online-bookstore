import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Category } from 'src/entities/category.entity'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { UserModule } from 'src/modules/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Category]), UserModule],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
