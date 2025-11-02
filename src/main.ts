import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

        console.log('✅ Firebase initialized for project:', process.env.FIREBASE_PROJECT_ID);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
