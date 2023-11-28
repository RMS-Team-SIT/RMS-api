import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './middleware/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { urlencoded, json } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // enable cors
    app.enableCors();

    // middleware
    app.use(logger);

    // Global pipe validation (whitelist = , transform = )
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );

    // set global prefix
    app.setGlobalPrefix('api/v1');

    // swagger
    configureSwagger(app);

    // set payload request limit
    app.use(json({ limit: '50mb' }));
    app.use(urlencoded({ extended: true, limit: '50mb' }));

    app.use(helmet());
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Environment : ${process.env.NODE_ENV}`);
    console.log(`Environment : ${process.env.TEST_ENV}`);
    console.log(`Application is running on port : ${port}`);
    console.log(`Swagger is running on : /${process.env.OPENAPI_PATH}`);
  } catch (error) {
    console.error('Error during application startup:', error);
    process.exit(1);
  }
}

function configureSwagger(app: NestExpressApplication) {
  const config = new DocumentBuilder()
    .setTitle('RMS API')
    .setVersion('1.0')
    .addTag('api')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(process.env.OPENAPI_PATH, app, document);
}

bootstrap();
