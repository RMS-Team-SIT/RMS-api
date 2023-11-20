import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './middleware/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { urlencoded, json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(logger);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Smart Resident API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.OPENAPI_PATH, app, document);

  // set payload request limit
  app.setGlobalPrefix('api/v1');
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.use(helmet());
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on port : ${port}`);
}
bootstrap();
