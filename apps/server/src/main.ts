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
  const port = process.env.PORT;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port);
  });
}
bootstrap();
