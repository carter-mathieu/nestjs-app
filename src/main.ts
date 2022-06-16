import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //enable nest class validators in the app
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(5000);
}
bootstrap();
