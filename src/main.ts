import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './middleware/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(logger);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // open-api setting
  const config = new DocumentBuilder()
    .setTitle('Smart Resident API')
    .setDescription('The Smart Resident API API Documentation')
    .setVersion('1.0')
    .addTag('smart-resident')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('open-api', app, document);

  app.use(helmet());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on port : ${port}`);
}
bootstrap();
