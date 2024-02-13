import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const port = AppModule.port || 3002;
  console.log(`App is running on port ${port}`);
  await app.listen(port);
}
bootstrap();