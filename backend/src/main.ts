import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const swaggerOptions = new DocumentBuilder()
    .setTitle('OnlineBookstore api documnet')
    .setDescription('网上图书商城的api文档')
    .setVersion('1.0')
    .addBasicAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup('swagger', app, document)
  await app.listen(3088, () => {
    Logger.log('sever running at http://localhost:3088')
  })
}
bootstrap()
