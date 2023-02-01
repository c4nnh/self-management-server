import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import admin, { ServiceAccount } from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setGlobalPrefix('api');

  const fbAdminConfig: ServiceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  };

  admin.initializeApp({
    credential: admin.credential.cert(fbAdminConfig),
    storageBucket: process.env.FIREBASE_BUCKET_NAME,
  });

  admin
    .storage()
    .bucket(process.env.FIREBASE_BUCKET_NAME)
    .setCorsConfiguration([
      {
        origin: ['*'],
        method: ['*'],
        maxAgeSeconds: 3600,
        responseHeader: ['Content-Type', 'Access-Control-Allow-Origin'],
      },
    ])
    .then(() => {
      this.app.storage().bucket(process.env.FIREBASE_BUCKET_NAME).makePublic();
    });

  const config = new DocumentBuilder()
    .setTitle('Self management API')
    .setDescription('Open API of self management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
