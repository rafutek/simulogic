import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

/**
 * Creates and deploys server app.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // allow cross origin requests
  app.useGlobalPipes(new ValidationPipe()); // ensure protection of all endpoints
  await app.listen(process.env.PORT);
  Logger.log(`Listening at ${await app.getUrl()}`);
  Logger.log(`Server in ${process.env.NODE_ENV} mode`);
}
bootstrap();
