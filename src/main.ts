import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './middleware/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { urlencoded, json } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SpelunkerModule } from 'nestjs-spelunker';
import { apiReference } from '@scalar/nestjs-api-reference';

function configureSwagger(app: NestExpressApplication) {
  const options = new DocumentBuilder()
    .setTitle('RMS API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  app.use(
    '/reference',
    apiReference({
      spec: {
        content: document,
      },
      layout: 'classic'
    }),
  )
  SwaggerModule.setup(process.env.OPENAPI_PATH, app, document);
}

async function bootstrap() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    // enable cors
    app.enableCors({
      origin: '*',
      credentials: true,
    });

    // static route for public folder
    app.useStaticAssets(join(__dirname, '..', 'public'));

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

    app.use(helmet()); // set security header for express

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`Environment : ${process.env.NODE_ENV}`);
    console.log(`Environment : ${process.env.TEST_ENV}`);
    console.log(`Application is running on port : ${port}`);
    console.log(`Swagger is running on : /${process.env.OPENAPI_PATH}`);
    console.log(`Swagger Ref is running on : /${process.env.OPENAPI_PATH}`);

  } catch (error) {
    console.error('Error during application startup:', error);
    process.exit(1);
  }
}

bootstrap();
