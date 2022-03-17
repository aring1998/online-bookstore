import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Receiving } from 'src/entities/receiving.entity'
import { ReceivingController } from './receiving.controller'
import { ReceivingService } from './receiving.service'
import { UserModule } from 'src/modules/user/user.module'

@Module({
  imports: [TypeOrmModule.forFeature([Receiving]), UserModule],
  controllers: [ReceivingController],
  providers: [ReceivingService]
})
export class ReceivingModule {}
